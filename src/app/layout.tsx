"use client";

import "./globals.css";
import { Montserrat } from "next/font/google";
import Header from "./components/Header";
import { ReduxProvider } from "@/src/store/provider";
import Footer from "./components/Footer";
import FloatingBot from "./components/FloatingBot";
import FlashInfos from "./components/FlashInfos";
import { useEffect, useState } from "react";
import {
  listenForMessages,
  requestForToken,
  simulateNotification,
} from "../firebase/config";
import DesktopEffects from "./components/DesktopEffects";
import { API_EAGENCE, API_EAGENCE_JOEL, API_BOT_CIE } from "@/config/constants";
import { usePathname } from "next/navigation";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

// export const metadata = {
//   title: "E-AGENCE",
//   description: "Votre agence digitale de confiance",
// };

import { toast, ToastContainer } from "react-toastify";
import EnergyScrollbar from "./components/EnergyScrollbar";
import ElectricityEffect from "./components/ElectricityEffect";
import { useResponsive } from "../hooks/useResponsive";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const pathname = usePathname();

  // Détermine la section active en fonction du chemin (même logique que dans le Header)


  useEffect(() => {
    const getToken = async () => {
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

      // Si c'est Safari ou si les notifications ne sont pas supportées
      if (isSafari() || !isNotificationSupported()) {
        console.log(
          "Navigateur Safari détecté ou notifications non supportées - utilisation du mode de compatibilité"
        );

        try {
          if (typeof window !== "undefined" && "BroadcastChannel" in window) {
            const safariChannel = new BroadcastChannel(
              "safari-notification-channel"
            );

            // Recevoir les messages des autres onglets (pour Safari)
            safariChannel.onmessage = (event) => {
              console.log("Safari channel message received:", event.data);
              if (event.data && event.data.type === "SAFARI_NOTIFICATION") {
                simulateNotification(
                  event.data.title || "Nouvelle notification",
                  event.data.body || "Vous avez reçu une nouvelle notification",
                  event.data.data || {}
                );
              }
            };
          }
        } catch (err) {
          console.error(
            "Erreur lors de la configuration du canal pour Safari:",
            err
          );
        }
        return;
      }

      // Pour les navigateurs compatibles
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const token = await requestForToken();
          if (token) {
            setToken(token);
            try {
              const response = await fetch(
                `${API_EAGENCE}/notifications/register-web`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    fcmToken: token,
                    userId: "1234567890",
                  }),
                }
              );

              if (response.ok) {
                console.log("FCM token registered successfully");
              } else {
                console.error(
                  "Failed to register FCM token:",
                  await response.text()
                );
              }
            } catch (error) {
              console.error("Error registering FCM token:", error);
            }
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors de la demande de permission de notification:",
          error
        );
      }
    };

    getToken();
  }, []);

  // Initialiser l'écoute des messages Firebase
  useEffect(() => {
    if (token) {
      listenForMessages((payload) => {
        // Créer un événement personnalisé pour transmettre les données de notification
        const event = new CustomEvent("firebase-notification", {
          detail: {
            title: payload.notification?.title || "Nouvelle notification",
            body:
              payload.notification?.body ||
              "Vous avez reçu une nouvelle notification",
            data: payload.data,
          },
        });

        // Dispatcher l'événement pour qu'il soit capturé par le composant FlashInfos
        window.dispatchEvent(event);
      });
    }
  }, [token]);

  return (
    <html lang="fr">
      <body className={montserrat.className}>
        <ReduxProvider>
          {!['/login', '/register-stepper', '/verify', '/dashboard'].includes(pathname) && <Header />}

          <main className="">
            <div className="flex-1 overflow-x-hidden">
              {/* Using component wrapper to handle responsive rendering */}
              <DesktopEffects />
              <ToastContainer />
              {children}
            </div>
          </main>
          <Footer />
          <div>
            <FloatingBot />
          </div>

          <FlashInfos />
        </ReduxProvider>
      </body>
    </html>
  );
}


function ResponsiveEffects() {
  const { isMobile } = useResponsive();

  if (isMobile) return null;

  return (
    <>
      <EnergyScrollbar />
      <ElectricityEffect />
    </>
  );
}