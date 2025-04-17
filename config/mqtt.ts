import { IClientOptions, MqttClient } from "mqtt";
import mqtt from "mqtt";

// ============================
// 1) Options de connexion MQTT
// ============================

export const MQTT_SERVICE_OPTIONS: IClientOptions = {
  hostname: "139.99.120.48",
  port: 9001,
  path: "/mqtt",
  protocol: "ws",
  username: "mosquitto-llm-user",
  password: "pass@4321",

  // Timers & timeouts
  keepalive: 60, // ping toutes les 60s
  reconnectPeriod: 1000, // réessai de connexion toutes les 1s
  connectTimeout: 60000, // 60s de timeout

  clean: true, // nouvelle session à chaque connexion
  rejectUnauthorized: false, // accepter les certificats self-signed

  // Génération plus robuste d'ID de client
  clientId: `eagence-mqtt-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`,

  // Option WebSocket (facultatif, si tu veux logguer l’URL)
  transformWsUrl: (url: string) => {
    console.log("MQTT WebSocket URL:", url);
    return url;
  },
};

// =============================================
// 2) Fonctions utilitaires supplémentaires
// =============================================

// Génère l’URL complet à partir des options (optionnel)
export const buildMqttUrl = (): string => {
  const { protocol, hostname, port, path } = MQTT_SERVICE_OPTIONS;
  const fullUrl = `${protocol}://${hostname}:${port}${path}`;
  console.log("Complete MQTT Broker URL:", fullUrl);
  return fullUrl;
};

// Valide qu'un objet ressemble à un client MQTT
export const validateMqttConnection = (client: any): boolean => {
  if (!client) {
    console.error("❌ No MQTT client instance");
    return false;
  }

  const isValidClient =
    typeof client.connected === "boolean" &&
    typeof client.reconnecting === "boolean";

  if (!isValidClient) {
    console.error("❌ Invalid MQTT client structure");
    return false;
  }

  if (!client.connected) {
    console.warn("⚠️ MQTT client exists but is not connected");
    return false;
  }

  return true;
};

// ===============================================
// 3) Classe singleton : MqttConnectionManager
// ===============================================

class MqttConnectionManager {
  private static instance: MqttConnectionManager;
  private mqttClient: MqttClient | null = null;
  private clientId: string | null = null;
  private isConnecting: boolean = false;

  // Liste des topics auxquels on veut s'abonner
  private subscriptions: Set<string> = new Set();
  // Topics auxquels on est effectivement abonné
  private connectedTopics: Set<string> = new Set();

  // Listeners sur la connexion (pour être notifié quand ça se connecte/déconnecte)
  private connectionListeners: Set<(isConnected: boolean) => void> = new Set();
  // Listeners sur les messages pour chaque topic
  private messageListeners: Map<string, Set<(message: string) => void>> =
    new Map();

  // Queue des messages à publier quand on n'est pas connecté
  private messageQueue: Array<{
    topic: string;
    message: string;
    qos: 0 | 1 | 2;
  }> = [];

  // Promesse de connexion partagée (pour éviter de multiples connexions simultanées)
  private connectionPromise: Promise<boolean> | null = null;
  private connectionResolve: ((value: boolean) => void) | null = null;

  private constructor() {
    // Constructeur privé => Singleton
  }

  // Récupère l'instance unique
  public static getInstance(): MqttConnectionManager {
    if (!MqttConnectionManager.instance) {
      MqttConnectionManager.instance = new MqttConnectionManager();
    }
    return MqttConnectionManager.instance;
  }

  // ===============
  // Se connecter
  // ===============
  public connect(
    customClientId?: string,
    customOptions: Partial<IClientOptions> = {}
  ): Promise<boolean> {
    // Si on est déjà en train de connecter, on renvoie la promesse existante
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // Si déjà connecté, on renvoie true
    if (this.mqttClient && this.mqttClient.connected) {
      console.log("✅ MQTT Client already connected");
      this.notifyConnectionListeners(true);
      return Promise.resolve(true);
    }

    if (this.isConnecting) {
      console.log("⏳ MQTT connection already in progress");
      return this.connectionPromise || Promise.resolve(false);
    }

    // On crée la promesse de connexion
    this.connectionPromise = new Promise((resolve) => {
      this.connectionResolve = resolve;
    });

    this.isConnecting = true;
    this.clientId = customClientId || `eagence-client-${Date.now()}`;

    // URL direct (en dur) pour la connexion WebSocket
    const directUrl = `ws://139.99.120.48:9001/mqtt`;

    // Combine nos options par défaut avec celles fournies
    const options: IClientOptions = {
      ...MQTT_SERVICE_OPTIONS,
      ...customOptions,
      clientId: this.clientId,
    };

    console.log("🔄 Connecting directly to MQTT broker:", directUrl);
    console.log("🔑 Using client ID:", this.clientId);

    // Fermer une éventuelle connexion existante avant de refaire une connexion
    if (this.mqttClient) {
      console.log("🔄 Closing existing MQTT connection before reconnect");
      try {
        this.mqttClient.end(true);
      } catch (err) {
        console.error("Error closing MQTT connection:", err);
      }
      this.mqttClient = null;
    }

    // Timeout si jamais la connexion ne répond pas
    const connectionTimeout = setTimeout(() => {
      if (this.isConnecting && this.connectionResolve) {
        console.error("❌ MQTT connection timeout");
        this.isConnecting = false;
        this.connectionResolve(false);
        this.connectionResolve = null;
        this.connectionPromise = null;
        this.notifyConnectionListeners(false);
      }
    }, 10000); // 10 secondes de timeout

    try {
      // Création du client MQTT
      this.mqttClient = mqtt.connect(directUrl, options);

      // Événement : connect
      this.mqttClient.on("connect", () => {
        console.log("✅ MQTT Client connected successfully");
        this.isConnecting = false;
        clearTimeout(connectionTimeout);

        // Réabonner à tous les topics qu'on souhaite
        this.subscriptions.forEach((topic) => {
          this.subscribeTopic(topic);
        });

        // On résout la promesse
        if (this.connectionResolve) {
          this.connectionResolve(true);
          this.connectionResolve = null;
        }

        // On publie les messages en attente
        this.processMessageQueue();

        // Notifier les listeners qu'on est connecté
        this.notifyConnectionListeners(true);
      });

      // Événement : message reçu
      this.mqttClient.on("message", (topic, payload) => {
        const message = payload.toString();
        console.log(`📬 Message received on ${topic}:`, message);

        // Récupérer tous les callbacks associés à ce topic
        const listenersForTopic = this.messageListeners.get(topic);
        if (listenersForTopic) {
          listenersForTopic.forEach((listener) => listener(message));
        }
      });

      // Événement : erreur
      this.mqttClient.on("error", (err) => {
        console.error("❌ MQTT Client error:", err);
        clearTimeout(connectionTimeout);
        this.isConnecting = false;

        // On résout la promesse avec false
        if (this.connectionResolve) {
          this.connectionResolve(false);
          this.connectionResolve = null;
        }

        this.connectionPromise = null;
        this.notifyConnectionListeners(false);
      });

      // Événement : close
      this.mqttClient.on("close", () => {
        console.warn("⚠️ MQTT Connection closed");
        clearTimeout(connectionTimeout);
        this.isConnecting = false;

        if (this.connectionResolve) {
          this.connectionResolve(false);
          this.connectionResolve = null;
        }

        this.connectionPromise = null;
        this.notifyConnectionListeners(false);
      });

      // Événement : offline
      this.mqttClient.on("offline", () => {
        console.warn("⚠️ MQTT Client went offline");
        this.notifyConnectionListeners(false);
      });

      // Événement : reconnect
      this.mqttClient.on("reconnect", () => {
        console.log("🔄 MQTT Client attempting to reconnect");
      });

      return this.connectionPromise;
    } catch (error) {
      console.error("❌ Failed to connect MQTT client:", error);
      clearTimeout(connectionTimeout);
      this.isConnecting = false;

      if (this.connectionResolve) {
        this.connectionResolve(false);
        this.connectionResolve = null;
      }

      this.connectionPromise = null;
      this.notifyConnectionListeners(false);
      return Promise.resolve(false);
    }
  }

  // ===============
  // Gérer la file d'attente des messages
  // ===============
  private processMessageQueue(): void {
    if (
      !this.mqttClient ||
      !this.mqttClient.connected ||
      this.messageQueue.length === 0
    ) {
      return;
    }

    console.log(`Processing ${this.messageQueue.length} queued messages`);

    while (this.messageQueue.length > 0) {
      const msg = this.messageQueue.shift();
      if (msg) {
        try {
          console.log(`Publishing queued message to ${msg.topic}`);
          this.mqttClient.publish(
            msg.topic,
            msg.message,
            { qos: msg.qos },
            (err) => {
              if (err) {
                console.error("❌ Failed to publish queued message:", err);
              } else {
                console.log("✅ Queued message published successfully");
              }
            }
          );
        } catch (err) {
          console.error("Error publishing queued message:", err);
          // Remettre le message dans la file d'attente si erreur
          this.messageQueue.unshift(msg);
          break;
        }
      }
    }
  }

  // ===============
  // S'abonner à un topic
  // ===============
  public subscribeTopic(topic: string): boolean {
    if (!this.mqttClient) {
      console.warn("⚠️ Cannot subscribe, MQTT client not initialized");
      this.subscriptions.add(topic);
      return false;
    }

    if (!this.mqttClient.connected) {
      console.warn("⚠️ Cannot subscribe, MQTT client not connected");
      this.subscriptions.add(topic);
      return false;
    }

    this.subscriptions.add(topic);

    // Ne s'abonner qu'une fois
    if (!this.connectedTopics.has(topic)) {
      this.mqttClient.subscribe(topic, (err) => {
        if (err) {
          console.error(`❌ Failed to subscribe to topic ${topic}:`, err);
          return;
        }
        console.log(`✅ Successfully subscribed to topic: ${topic}`);
        this.connectedTopics.add(topic);
      });
    } else {
      console.log(`ℹ️ Already subscribed to topic: ${topic}`);
    }

    return true;
  }

  // ===============
  // Publier un message
  // ===============
  public publishMessage(
    topic: string,
    message: string,
    qos: 0 | 1 | 2 = 1
  ): Promise<boolean> {
    return new Promise(async (resolve) => {
      // Si client pas connecté
      if (!this.mqttClient || !this.mqttClient.connected) {
        console.log("⏳ MQTT not connected, establishing connection...");
        console.log(`Adding message to queue for topic: ${topic}`);
        this.messageQueue.push({ topic, message, qos });

        try {
          // Tentative de publication directe avec un client temporaire
          console.log("Creating direct connection for publishing...");
          const directUrl = `ws://139.99.120.48:9001/mqtt`;

          const pubOptions = {
            ...MQTT_SERVICE_OPTIONS,
            clientId: `eagence-pub-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 5)}`,
            clean: true,
            connectTimeout: 5000, // plus court pour la publication directe
          };

          const pubClient = mqtt.connect(directUrl, pubOptions);

          const pubTimeout = setTimeout(() => {
            console.log("Publish client connection timeout");
            try {
              pubClient.end(true);
            } catch (e) {}
            resolve(false);
          }, 5000);

          pubClient.on("connect", () => {
            console.log("Direct publishing client connected");
            clearTimeout(pubTimeout);

            try {
              console.log(`Publishing message directly to ${topic}`);
              pubClient.publish(topic, message, { qos }, (err) => {
                if (err) {
                  console.error("Direct publish error:", err);
                  resolve(false);
                } else {
                  console.log("Direct publish successful");
                  resolve(true);
                }
                try {
                  pubClient.end(true);
                } catch (e) {}
              });
            } catch (pubErr) {
              console.error("Error during direct publish:", pubErr);
              try {
                pubClient.end(true);
              } catch (e) {}
              resolve(false);
            }
          });

          pubClient.on("error", (err) => {
            console.error("Direct publishing client error:", err);
            clearTimeout(pubTimeout);
            try {
              pubClient.end(true);
            } catch (e) {}

            // Fallback : utilisation du client principal
            console.log("Trying main client connection as fallback...");
            this.connect(this.clientId || undefined).then((connected) => {
              if (connected) {
                console.log("Main client connected, queue will be processed");
                resolve(true);
              } else {
                console.error("Both direct and main client connections failed");
                resolve(false);
              }
            });
          });

          return;
        } catch (err) {
          console.error("Error creating direct publish client:", err);
          // Continuer avec le client principal
        }

        // Fallback si échec direct
        try {
          const connected = await this.connect(this.clientId || undefined);
          if (!connected) {
            console.error("Failed to connect main client for publishing");
            resolve(false);
            return;
          }
        } catch (connErr) {
          console.error("Error during connection attempt:", connErr);
          resolve(false);
          return;
        }
      }

      // Ici, on est censé être connecté
      if (this.mqttClient && this.mqttClient.connected) {
        try {
          console.log(`📤 Publishing message to ${topic} with main client`);
          this.mqttClient.publish(topic, message, { qos }, (err) => {
            if (err) {
              console.error("❌ Failed to publish message:", err);
              this.messageQueue.push({ topic, message, qos });
              resolve(false);
            } else {
              console.log("✅ Message published successfully");
              resolve(true);
            }
          });
        } catch (err) {
          console.error("Error in publish:", err);
          this.messageQueue.push({ topic, message, qos });
          resolve(false);
        }
      } else {
        console.error("Client still not connected after connection attempt");
        this.messageQueue.push({ topic, message, qos });
        resolve(false);
      }
    });
  }

  // ===============
  // Ajouter un listener de connexion
  // ===============
  public addConnectionListener(
    listener: (isConnected: boolean) => void
  ): () => void {
    this.connectionListeners.add(listener);

    // On notifie immédiatement du statut actuel
    if (this.mqttClient) {
      listener(this.mqttClient.connected);
    } else {
      listener(false);
    }

    // Retourne une fonction pour désinscrire le listener
    return () => {
      this.connectionListeners.delete(listener);
    };
  }

  // ===============
  // Ajouter un listener de message
  // ===============
  public addMessageListener(
    topic: string,
    listener: (message: string) => void
  ): () => void {
    if (!this.messageListeners.has(topic)) {
      this.messageListeners.set(topic, new Set());
    }

    const topicListeners = this.messageListeners.get(topic)!;
    topicListeners.add(listener);

    // On s'abonne automatiquement
    this.subscribeTopic(topic);

    // Fonction pour se désinscrire
    return () => {
      const listeners = this.messageListeners.get(topic);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) {
          this.messageListeners.delete(topic);
        }
      }
    };
  }

  // Notifier tous les listeners de connexion
  private notifyConnectionListeners(isConnected: boolean): void {
    this.connectionListeners.forEach((listener) => {
      try {
        listener(isConnected);
      } catch (error) {
        console.error("Error in MQTT connection listener:", error);
      }
    });
  }

  // ===============
  // Vérifier si connecté
  // ===============
  public isConnected(): boolean {
    return !!this.mqttClient && this.mqttClient.connected;
  }

  // ===============
  // Se déconnecter
  // ===============
  public disconnect(): void {
    if (this.mqttClient) {
      console.log("🔌 Disconnecting MQTT client");
      this.mqttClient.end(true);
      this.mqttClient = null;
      this.connectedTopics.clear();
      this.notifyConnectionListeners(false);
    }
  }
}

// ======================================
// 4) Exporter l'instance du Singleton
// ======================================

export const mqttManager = MqttConnectionManager.getInstance();
