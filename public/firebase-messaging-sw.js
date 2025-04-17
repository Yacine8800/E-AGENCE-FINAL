// Importer les scripts Firebase nécessaires
try {
  importScripts(
    "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
  );
  importScripts(
    "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
  );
} catch (e) {
  console.error("Erreur lors du chargement des scripts Firebase:", e);
}

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCs9Vc6U_6mMGjBNX_5w2eEJLvZD9LF09E",
  authDomain: "web-push-notification-f6169.firebaseapp.com",
  projectId: "web-push-notification-f6169",
  storageBucket: "web-push-notification-f6169.firebasestorage.app",
  messagingSenderId: "995456066626",
  appId: "1:995456066626:web:6a8551d4a104b6614039db",
  measurementId: "G-6TK7K1KYNQ",
};

// Variable pour stocker l'instance de messaging
let messaging;

// Initialiser Firebase de manière sécurisée
try {
  if (typeof firebase !== "undefined") {
    firebase.initializeApp(firebaseConfig);
    messaging = firebase.messaging();

    // Création d'un canal de diffusion pour communiquer avec la page web
    const broadcastChannel = new BroadcastChannel('firebase-messaging-sw-channel');
    
    // Gestionnaire pour les messages en arrière-plan
    messaging.onBackgroundMessage((payload) => {
      console.log(
        "[firebase-messaging-sw.js] Message reçu en arrière-plan :",
        payload
      );

      try {
        // Extraire les données de notification de manière sécurisée
        const notificationData = payload.notification || {};
        const dataPayload = payload.data || {};

        const notificationTitle =
          notificationData.title || "Nouvelle notification";
        const notificationOptions = {
          body:
            notificationData.body || "Vous avez reçu une nouvelle notification",
          icon: "/icon.png", // Assurez-vous d'avoir cette icône dans votre dossier public
          badge: "/badge.png",
          data: dataPayload,
          // Options supplémentaires pour améliorer l'expérience utilisateur
          vibrate: [200, 100, 200],
          requireInteraction: true,
          actions: [
            {
              action: "view",
              title: "Voir",
            },
          ],
        };
        
        // Vérifier que ce n'est pas une notification de test avant de l'envoyer
        const isTestNotification = 
          (notificationTitle === "Notification pour Safari" && 
           notificationOptions.body.includes("temps réel même sur Safari")) ||
          (dataPayload && dataPayload.type === "safari-test");
          
        if (!isTestNotification) {
          // Envoyer le message à toutes les pages ouvertes via le canal de diffusion
          broadcastChannel.postMessage({
            type: 'BACKGROUND_NOTIFICATION',
            payload: {
              title: notificationTitle,
              body: notificationOptions.body,
              data: dataPayload
            }
          });
        } else {
          console.log("Notification de test ignorée");
        }

        self.registration.showNotification(
          notificationTitle,
          notificationOptions
        );
      } catch (error) {
        console.error(
          "[firebase-messaging-sw.js] Erreur lors du traitement de la notification:",
          error
        );
      }
    });
  } else {
    console.warn(
      "[firebase-messaging-sw.js] Firebase n'est pas défini. Vérifiez que les scripts sont bien chargés."
    );
  }
} catch (error) {
  console.error(
    "[firebase-messaging-sw.js] Erreur lors de l'initialisation de Firebase:",
    error
  );
}

// Gestionnaire pour le clic sur la notification
self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification cliquée", event);

  // Fermer la notification
  event.notification.close();

  // Récupérer les données de la notification
  const data = event.notification.data || {};
  let targetUrl = "/";

  // Si la notification contient une URL spécifique, l'utiliser
  if (data && data.url) {
    targetUrl = data.url;
  }

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Si une fenêtre client existe déjà, la focaliser
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if ("focus" in client) {
            return client.focus();
          }
        }
        // Sinon, ouvrir une nouvelle fenêtre
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
      .catch((error) => {
        console.error(
          "[firebase-messaging-sw.js] Erreur lors de la gestion du clic sur notification:",
          error
        );
      })
  );
});

// Gestionnaire d'installation du service worker
self.addEventListener("install", (event) => {
  console.log("[firebase-messaging-sw.js] Service Worker installé");
  self.skipWaiting();
});

// Gestionnaire d'activation du service worker
self.addEventListener("activate", (event) => {
  console.log("[firebase-messaging-sw.js] Service Worker activé");
  
  // Création d'un canal de diffusion pour communiquer avec la page web
  const broadcastChannel = new BroadcastChannel('firebase-messaging-sw-channel');
  
  // Informer toutes les fenêtres clientes que le service worker est prêt
  broadcastChannel.postMessage({
    type: 'SW_ACTIVATED',
    timestamp: Date.now()
  });
  
  return self.clients.claim();
});
