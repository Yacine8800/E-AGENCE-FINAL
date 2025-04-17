import {
  API_APP_ID,
  API_AUTH_DOMAIN,
  API_KEY,
  API_MEASUREMENT_ID,
  API_MESSAGING_SENDER_ID,
  API_PROJECT_ID,
  API_STORAGE_BUCKET,
  API_VAPID_KEY,
} from "@/config/constants";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: `${API_KEY}`,
  authDomain: `${API_AUTH_DOMAIN}`,
  projectId: `${API_PROJECT_ID}`,
  storageBucket: `${API_STORAGE_BUCKET}`,
  messagingSenderId: `${API_MESSAGING_SENDER_ID}`,
  appId: `${API_APP_ID}`,
  measurementId: `${API_MEASUREMENT_ID}`,
};

const FIREBASE_VAPID_KEY = `${API_VAPID_KEY}`;

const app = initializeApp(firebaseConfig);
let messaging: ReturnType<typeof getMessaging> | null = null;

// Vérifier si le navigateur est Safari
const isSafari = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes("safari") && !userAgent.includes("chrome");
};

// Vérifier si les notifications sont supportées
const isNotificationSupported = () => {
  return (
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
};

// Initialiser Firebase Messaging seulement si ce n'est pas Safari et si les notifications sont supportées
if (typeof window !== "undefined" && !isSafari() && isNotificationSupported()) {
  messaging = getMessaging(app);
}

export const requestForToken = () => {
  // Si c'est Safari ou si les notifications ne sont pas supportées, retourner null
  if (
    typeof window !== "undefined" &&
    (isSafari() || !isNotificationSupported())
  ) {
    console.warn(
      "Les notifications ne sont pas supportées sur ce navigateur (probablement Safari)."
    );
    return Promise.resolve(null);
  }

  if (!messaging) return Promise.resolve(null);

  return getToken(messaging, {
    vapidKey: FIREBASE_VAPID_KEY,
  })
    .then((currentToken) => {
      if (currentToken) {
        return currentToken;
      } else {
        console.warn(
          "No registration token available. Request permission to generate one."
        );
        return null;
      }
    })
    .catch((err) => {
      console.error("An error occurred while retrieving token - ", err);
      return null;
    });
};

export const listenForMessages = (callback: (payload: any) => void) => {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("Message reçu : ", payload);
    callback(payload);
  });
};

// Fonction pour simuler une notification pour Safari et la diffuser sur tous les onglets
export const simulateNotification = (
  title: string,
  body: string,
  data?: any
) => {
  // Vérifier si c'est une notification de test (pour éviter l'affichage indésirable)
  const isTestNotification =
    (title === "Notification pour Safari" &&
      body.includes("temps réel même sur Safari")) ||
    (data && data.type === "safari-test");

  // Ne pas traiter les notifications de test en production
  if (isTestNotification && process.env.NODE_ENV === "production") {
    console.log("Notification de test ignorée en production");
    return;
  }

  if (typeof window !== "undefined") {
    // Créer et dispatcher l'événement pour l'onglet actuel
    const event = new CustomEvent("firebase-notification", {
      detail: {
        title,
        body,
        data,
      },
    });
    window.dispatchEvent(event);

    // Diffuser la notification vers les autres onglets via BroadcastChannel
    try {
      if ("BroadcastChannel" in window) {
        // Vérifier encore une fois que ce n'est pas une notification de test avant de la diffuser
        if (!isTestNotification || process.env.NODE_ENV !== "production") {
          // Utiliser un canal dédié pour Safari
          const safariChannel = new BroadcastChannel(
            "safari-notification-channel"
          );

          // Envoyer la notification aux autres onglets
          safariChannel.postMessage({
            type: "SAFARI_NOTIFICATION",
            title: title,
            body: body,
            data: data,
            timestamp: Date.now(),
          });

          console.log(
            "Notification broadcastée vers les autres onglets Safari"
          );
        }
      }
    } catch (err) {
      console.error(
        "Erreur lors de la diffusion de la notification Safari:",
        err
      );
    }
  }
};
