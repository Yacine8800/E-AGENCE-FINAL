"use client";

import { API_EAGENCE } from "@/config/constants";
import { ReduxProvider } from "@/src/store/provider";
import { LoaderProvider } from "@/src/contexts/LoaderContext";
import { Montserrat } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import {
  listenForMessages,
  requestForToken,
  simulateNotification,
} from "../firebase/config";
import DesktopEffects from "./components/DesktopEffects";
import FlashInfos from "./components/FlashInfos";
import FloatingBot from "./components/FloatingBot";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./globals.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../hooks/useAuth";
import { useResponsive } from "../hooks/useResponsive";
import ElectricityEffect from "./components/ElectricityEffect";
import EnergyScrollbar from "./components/EnergyScrollbar";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

// Composant enfant qui s'occupe de la protection des routes
// Il utilisera useAuth à l'intérieur du ReduxProvider
const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Liste des routes protégées qui nécessitent une authentification
  const protectedRoutes = ["/dashboard"];

  // Liste des routes d'authentification (réservées aux utilisateurs non connectés)
  const authRoutes = [
    "/login",
    "/register-stepper",
    "/verify",
    "/recuperation",
    "/defineCode",
    "/code",
    "/OTP",
    "/recupOTP",
    "/recupQuestion",
  ];

  // Protection des routes côté client
  useEffect(() => {
    // Si l'utilisateur tente d'accéder à une route protégée sans être authentifié
    if (
      !isAuthenticated &&
      protectedRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      )
    ) {
      router.push("/login");
      return;
    }

    // Si l'utilisateur est authentifié et tente d'accéder à une route d'authentification
    if (
      isAuthenticated &&
      authRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      )
    ) {
      router.push("/");
      return;
    }
  }, [pathname, isAuthenticated, router, protectedRoutes, authRoutes]);

  // Gérer les événements de navigation manuels (back/forward, changement manuel d'URL)
  useEffect(() => {
    // Fonction de gestion pour vérifier l'accès à l'URL actuelle
    const handleNavigation = () => {
      const currentPath = window.location.pathname;

      // Vérifier si l'URL actuelle est protégée et l'utilisateur n'est pas authentifié
      if (
        !isAuthenticated &&
        protectedRoutes.some(
          (route) =>
            currentPath === route || currentPath.startsWith(`${route}/`)
        )
      ) {
        router.push("/login");
        return;
      }

      // Vérifier si l'URL actuelle est réservée à l'authentification et l'utilisateur est authentifié
      if (
        isAuthenticated &&
        authRoutes.some(
          (route) =>
            currentPath === route || currentPath.startsWith(`${route}/`)
        )
      ) {
        router.push("/");
        return;
      }
    };

    // Écouter l'événement popstate (navigation avec les boutons back/forward du navigateur)
    window.addEventListener("popstate", handleNavigation);

    // Écouter l'événement personnalisé pour les changements d'URL via pushState
    window.addEventListener("urlChanged", handleNavigation);

    // Nettoyer les écouteurs d'événements
    return () => {
      window.removeEventListener("popstate", handleNavigation);
      window.removeEventListener("urlChanged", handleNavigation);
    };
  }, [isAuthenticated, router, protectedRoutes, authRoutes]);

  // Afficher le Header seulement pour certaines pages
  const showHeader = ![
    "/login",
    "/register-stepper",
    "/verify",
    "/dashboard",
  ].includes(pathname);

  const showMT = [
    "/login",
    "/register-stepper",
    "/verify",
    "/dashboard",
  ].includes(pathname);

  return (
    <>
      {showHeader && <Header />}
      <main className={!showMT ? "mt-32" : ""}>
        <div className="flex-1 overflow-x-hidden">
          <DesktopEffects />
          <ToastContainer />
          {children}
        </div>
      </main>
      {showHeader && <Footer />}
      <div>
        <FloatingBot />
      </div>
      <FlashInfos />
    </>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);

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
      <head>
        <Script id="auth-check" strategy="beforeInteractive">
          {`
            // Intercepter les requêtes fetch pour ajouter l'en-tête d'authentification
            const originalFetch = window.fetch;
            window.fetch = function(url, options = {}) {
              // Créer des options avec les headers existants ou un nouvel objet
              const newOptions = { ...options };
              newOptions.headers = newOptions.headers || {};
              
              // Vérifier si l'utilisateur a un token dans localStorage
              try {
                const token = localStorage.getItem('token');
                if (token) {
                  // Ajouter un header personnalisé pour indiquer qu'un token existe
                  newOptions.headers = {
                    ...newOptions.headers,
                    'x-has-token': 'true'
                  };
                }
              } catch (error) {
                console.error('Error accessing localStorage:', error);
              }
              
              // Appeler la fonction fetch originale avec les options modifiées
              return originalFetch(url, newOptions);
            };

            // Intercepter les navigations par changement d'URL
            if (typeof window !== 'undefined') {
              const originalPushState = history.pushState;
              history.pushState = function(state, title, url) {
                // Vérifier si l'URL est une route protégée et si l'utilisateur est authentifié
                const token = localStorage.getItem('token');
                const isAuthenticated = !!token;
                
                // Appeler la méthode originale
                const result = originalPushState.apply(this, [state, title, url]);
                
                // Déclencher un événement personnalisé pour être capturé par React
                const event = new CustomEvent('urlChanged', { 
                  detail: { 
                    url, 
                    isAuthenticated 
                  } 
                });
                window.dispatchEvent(event);
                
                return result;
              };
            }
          `}
        </Script>
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WSGT5KVL');`}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-M9KJ90D8Y2"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-M9KJ90D8Y2');
          `}
        </Script>
      </head>
      <body className={montserrat.className}>
        <ReduxProvider>
          <LoaderProvider>
            <RouteGuard>{children}</RouteGuard>
          </LoaderProvider>
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
