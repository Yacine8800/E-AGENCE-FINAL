"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useResponsive } from "@/src/hooks/useResponsive";
import { API_URL } from "../config/constants";
import { useAuth } from "@/src/hooks/useAuth";
import IconFacebook from "../components/icons/iconFacebook";
import IconGoogle from "../components/icons/iconGoogle";
import { AuthLayout } from "../authLayout";
import Title from "../components/title";
import Script from "next/script";
import { API_GOOGLE_CLIENT_ID } from "@/config/constants";
import { axiosService } from "@/src/services/axios.service";

// Déclaration des types pour Facebook SDK
declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: {
      init: (options: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: {
          authResponse?: {
            accessToken: string;
            userID: string;
            expiresIn: number;
          };
          status?: string;
        }) => void,
        options?: { scope: string }
      ) => void;
    };
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: any) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

const Login = () => {
  const { isMobile } = useResponsive();
  const router = useRouter();

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNotFoundModal, setShowNotFoundModal] = useState(false);
  const [modeParam, setModeParam] = useState<string | null>(null);

  const auth = useAuth();
  const { storeLogin } = auth;

  // Récupérer le paramètre mode depuis l'URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Récupérer les paramètres d'URL
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get('mode');

      if (mode) {
        // Stocker le mode pour l'utiliser après connexion
        setModeParam(mode);
        localStorage.setItem('pendingDemandeMode', mode);
      }
    }
  }, []);

  const getApiToken = async () => {
    try {
      // Vérifier si le token existe déjà dans le localStorage et s'il est encore valide
      const storedToken = localStorage.getItem("api_token");
      const tokenExpiry = localStorage.getItem("api_token_expiry");

      // Si le token existe et n'est pas expiré, l'utiliser
      if (storedToken && tokenExpiry && new Date(tokenExpiry) > new Date()) {
        return storedToken;
      }

      // Sinon, en demander un nouveau
      const response = await fetch(`${API_URL}/v3/user/get-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apikey: process.env.API_KEY }),
      });

      const data = await response.json();

      if (data.message === "ok" && data.data) {
        // Stocker le token dans le localStorage
        localStorage.setItem("api_token", data.data);

        // Calculer et stocker la date d'expiration (24h par défaut)
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 24);
        localStorage.setItem("api_token_expiry", expiry.toISOString());

        return data.data;
      }

      throw new Error("Impossible d'obtenir le token d'API");
    } catch (error) {
      console.error("Erreur lors de l'obtention du token d'API:", error);
      throw error;
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook', token: string) => {
    try {
      setIsLoading(true);
      // const apiToken = await getApiToken();

      const response : any = await axiosService.post(`/v3/user/client/login/${provider}`, {
        token: token,
      });

      const data = response.data;

      if (response.ok && data.message === "Action éffectuée avec succès") {
        // Store user info and redirect
        storeLogin(data.data?.email || data.data?.phone);
        router.push("/dashboard");
      } else {
        console.error(`Erreur de connexion ${provider}:`, data);
        // Gérer l'erreur de connexion
      }
    } catch (error) {
      console.error(`Erreur lors de la connexion ${provider}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement des SDKs
  useEffect(() => {
    // Charger le SDK Google
    const loadGoogleSDK = () => {
      return new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    };

    // Charger le SDK Facebook
    const loadFacebookSDK = () => {
      return new Promise<void>((resolve) => {
        // Initialiser FB une fois que le SDK est chargé
        window.fbAsyncInit = function () {
          window.FB.init({
            appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID as string,
            cookie: true,
            xfbml: true,
            version: 'v18.0'
          });
          resolve();
        };

        const script = document.createElement("script");
        script.src = "https://connect.facebook.net/en_US/sdk.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      });
    };

    // Charger les deux SDKs de manière asynchrone
    const initializeSocialSDKs = async () => {
      try {
        await Promise.all([loadGoogleSDK(), loadFacebookSDK()]);
        console.log("SDKs sociaux chargés avec succès");
      } catch (error) {
        console.error("Erreur lors du chargement des SDKs:", error);
      }
    };

    initializeSocialSDKs();

    // Cleanup function
    return () => {
      const scripts = document.getElementsByTagName("script");
      Array.from(scripts).forEach(script => {
        if (
          script.src.includes("sdk.js") ||
          script.src.includes("gsi/client")
        ) {
          script.remove();
        }
      });
    };
  }, []);

  // Fonctions pour initialiser les providers sociaux
  const initGoogleLogin = () => {
    // Vérifier si le SDK Google est chargé
    if (typeof window !== 'undefined' && window.google) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: "597218590015-9ksk7c8vqttdbkas6p2jcrg65kb6c7b7.apps.googleusercontent.com",
        scope: 'email profile',
        callback: (tokenResponse: any) => {
          console.log(tokenResponse, "tokenResponse");
          if (tokenResponse && tokenResponse.access_token) {
            handleSocialLogin('google', tokenResponse.access_token);
          }
        },
      });

      client.requestAccessToken();
    } else {
      console.error("Le SDK Google n'est pas chargé");
    }
  };

  const initFacebookLogin = async () => {
    try {
      // Vérifier si nous sommes en HTTPS
      if (typeof window !== 'undefined' && window.location.protocol !== 'https:') {
        console.error("La connexion Facebook nécessite HTTPS");
        alert("La connexion Facebook n'est disponible qu'en HTTPS. Veuillez utiliser une connexion sécurisée.");
        return;
      }

      // Vérifier si FB est initialisé
      if (typeof window !== 'undefined' && window.FB) {
        window.FB.login(
          (response) => {
            if (response.authResponse) {
              handleSocialLogin('facebook', response.authResponse.accessToken);
            } else {
              console.log('Connexion Facebook annulée par l\'utilisateur');
            }
          },
          { scope: 'email,public_profile' }
        );
      } else {
        console.error("Facebook SDK n'est pas initialisé");
        alert("Une erreur s'est produite lors de l'initialisation de Facebook. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion Facebook:", error);
      alert("Une erreur s'est produite lors de la connexion Facebook. Veuillez réessayer.");
    }
  };

  // Gestion du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) return;
    setIsLoading(true);

    try {
      const apiToken = await getApiToken();

      const response = await fetch(`${API_URL}/v3/user/client/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({ login: loginIdentifier }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.message === "Client introuvable") {
          setShowNotFoundModal(true);
          return;
        }
        if (
          data.message === "Action éffectuée avec succès" &&
          data.data &&
          typeof data.data === "object"
        ) {
          storeLogin(loginIdentifier);
          router.push("/verify");
          return;
        }
      } else {
        console.error("Erreur de vérification:", data);
      }
    } catch (error) {
      console.error("Erreur lors de la requête:", error);
    } finally {
      // Désactiver le loader après la requête
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <>
        {/* Modal "Client introuvable" */}
        {showNotFoundModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white p-6 rounded-xl max-w-sm w-full mx-4 shadow-2xl transform transition-all duration-300 border border-gray-200">
              <div className="flex flex-col items-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Compte introuvable</h3>
                <p className="text-center text-base font-medium text-gray-600">
                  Votre compte est introuvable.
                  <br />
                  Veuillez vous inscrire avant de vous connecter.
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    router.push("/register-stepper");
                  }}
                  className="w-full rounded-full bg-primary text-white font-semibold py-3 hover:bg-primary/90 transition-colors"
                >
                  S&apos;inscrire
                </button>
                <button
                  onClick={() => setShowNotFoundModal(false)}
                  className="w-full rounded-full border border-gray-300 text-gray-700 font-semibold py-3 hover:bg-gray-50 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          className={`flex items-center justify-center ${isMobile ? "flex-col pt-10 px-5" : ""
            }`}
        >
          <div className="w-full max-w-md">
            {/* Titre */}
            <div>
              <Title title="Connexion" />
              <p className="text-[14px] text-smallText font-medium text-center">
                Saisir l'adresse e-mail ou le n° de téléphone associé à votre
                compte maCIE
              </p>
            </div>

            {/* Formulaire */}
            <div className="pt-5 w-full">
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="font-bold text-base">
                    Email ou N° de téléphone
                  </label>
                  <input
                    type="text"
                    placeholder="E-mail / téléphone"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full rounded-xl px-5 py-5 border-2 border-[#EDEDED] mt-2"
                  />
                </div>
                <div className="pt-7">
                  <button
                    type="submit"
                    disabled={isLoading} // Désactivé pendant le chargement
                    className="w-full rounded-full bg-primary text-white font-semibold py-4 flex items-center justify-center"
                  >
                    {isLoading ? "Chargement..." : "Continuer"}
                  </button>
                </div>
              </form>
            </div>

            {/* Séparateur */}
            <div className="flex items-center my-5 px-10 pt-3">
              <div className="flex-grow border-t border-smallText"></div>
              <span className="px-3 text-sm text-smallText">
                ou continuer avec
              </span>
              <div className="flex-grow border-t border-smallText"></div>
            </div>

            {/* Réseaux sociaux */}
            <div className="flex gap-5 items-center justify-center">
              <button
                onClick={initGoogleLogin}
                className="flex items-center justify-center rounded-lg py-3 px-7 bg-[#F5F5F5] hover:bg-gray-200"
              >
                <IconGoogle />
              </button>
              <button
                onClick={initFacebookLogin}
                className="flex items-center justify-center rounded-lg py-3 px-7 bg-[#F5F5F5] hover:bg-gray-200"
              >
                <IconFacebook />
              </button>
            </div>

            {/* S'inscrire */}
            <div className="w-full pt-10">
              <p className="text-sm text-smallText text-center">
                Je n&apos;ai pas de compte ?
              </p>
              <div className="pt-7">
                <button
                  onClick={() => router.push("/register-stepper")}
                  className="w-full rounded-full text-primary border-2 border-primary font-semibold py-4 hover:bg-gray-100"
                >
                  S&apos;inscrire
                </button>
              </div>
            </div>
          </div>

          {/* Séparateur vertical sur desktop */}
          {!isMobile && (
            <div className="h-96 w-px mx-8 border border-gray-100"></div>
          )}

          {/* QR Code */}
          <div className="w-full mt-12 text-center">
            <div className="inline-block">
              <Image
                src="/qrcode/qrcode.png"
                alt="QR Code"
                width={150}
                height={150}
                className="rounded-lg"
              />
            </div>
            <h3 className="text-base font-bold text-gray-700 mt-4">
              Se connecter avec QR code
            </h3>
            <p className="text-sm text-smallText mt-1">
              Scan ce code avec ton téléphone pour te connecter instantanément
            </p>
          </div>




        </div>
      </>
    </AuthLayout>
  );
};

export default Login;
