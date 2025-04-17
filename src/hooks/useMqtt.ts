import { useEffect, useState, useCallback, useRef } from "react";
import { mqttManager } from "../../config/mqtt";

interface MqttOptions {
  topic: string;
  clientId?: string;
}

/**
 * Hook React pour utiliser MQTT avec une connexion persistante entre les composants
 */
export const useMqtt = ({ topic, clientId }: MqttOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Référence pour garder trace des nettoyages
  const cleanupFunctions = useRef<(() => void)[]>([]);

  // Fonction pour se connecter au serveur MQTT
  const connect = useCallback(async () => {
    console.log(
      `🔌 Connecting to MQTT with clientId '${clientId}' and subscribing to topic '${topic}'`
    );

    try {
      // Initier la connexion via le singleton (asynchrone)
      const connected = await mqttManager.connect(clientId);
      console.log(
        `MQTT connection result: ${connected ? "success" : "failed"}`
      );

      // Écouter les changements d'état de connexion
      const connectionCleanup = mqttManager.addConnectionListener(
        (connected) => {
          console.log(
            `MQTT connection status changed: ${
              connected ? "connected" : "disconnected"
            }`
          );
          setIsConnected(connected);
        }
      );

      // Écouter les messages sur le topic spécifié
      const messageCleanup = mqttManager.addMessageListener(
        topic,
        (receivedMessage) => {
          console.log(`Message received on ${topic}:`, receivedMessage);

          // Tenter de décoder si c'est un message en base64
          try {
            // Vérifier si c'est potentiellement un message base64 (format standard)
            const isBase64 = /^[A-Za-z0-9+/=]+$/.test(receivedMessage.trim());

            if (isBase64) {
              // Tentative de décodage Base64
              try {
                // Convertir la chaîne base64 en UTF-8
                const decodedMessage = atob(receivedMessage);
                console.log(`Decoded base64 message:`, decodedMessage);

                // Essayer de parser en JSON si possible
                try {
                  const jsonMessage = JSON.parse(decodedMessage);
                  console.log(`Parsed JSON from decoded message:`, jsonMessage);
                  setMessage(JSON.stringify(jsonMessage));
                } catch (jsonError) {
                  // Si ce n'est pas du JSON valide, utiliser la chaîne décodée
                  console.log(
                    `Decoded message is not valid JSON, using as string`
                  );
                  setMessage(decodedMessage);
                }
              } catch (decodeError) {
                console.log(
                  `Failed to decode as base64, treating as regular message`
                );
                setMessage(receivedMessage);
              }
            } else {
              // Pas un message base64, utiliser tel quel
              setMessage(receivedMessage);
            }
          } catch (error) {
            console.error("Error processing message:", error);
            setMessage(receivedMessage); // Fallback to original message
          }
        }
      );

      // Stocker les fonctions de nettoyage
      cleanupFunctions.current = [connectionCleanup, messageCleanup];

      // Retourner une fonction de nettoyage pour useEffect
      return () => {
        cleanupFunctions.current.forEach((cleanup) => cleanup());
      };
    } catch (err) {
      setError(err as Error);
      return () => {};
    }
  }, [topic, clientId]);

  // S'abonner au topic et se connecter lors du montage du composant
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    connect().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [connect]);

  // Fonction pour publier un message
  const publishMessage = useCallback(
    async (payload: string, targetTopic?: string): Promise<boolean> => {
      const publishTopic = targetTopic || topic;
      console.log(`Attempting to publish message to ${publishTopic}`);

      try {
        setIsSending(true);

        // Publier le message via le gestionnaire (asynchrone)
        const result = await mqttManager.publishMessage(publishTopic, payload);

        setIsSending(false);
        return result;
      } catch (err) {
        console.error("Error publishing message:", err);
        setError(err as Error);
        setIsSending(false);
        return false;
      }
    },
    [topic]
  );

  return {
    isConnected: mqttManager.isConnected(),
    message: message,
    error,
    publishMessage,
    isSending,
    reconnect: connect,
  };
};

export default useMqtt;
