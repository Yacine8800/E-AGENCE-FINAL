"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { AuthLayout } from "../authLayout";
import { useResponsive } from "@/src/hooks/useResponsive";
import { bebas_beue } from "@/utils/globalFunction";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "../config/constants";

const Page = () => {
  const PIN_LENGTH = 6; // Longueur du code PIN
  const [pin, setPin] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shakeAnimation, setShakeAnimation] = useState(false);
  const [keypadDigits, setKeypadDigits] = useState<string[]>([
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
  ]);
  const [error, setError] = useState<string | null>(null);
  const [currentLogin, setCurrentLogin] = useState<string>("");
  const [redirecting, setRedirecting] = useState(false); // Ajout d'un état pour suivre la redirection

  // Initialiser avec la valeur du localStorage une fois que le composant est monté côté client
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentLogin(localStorage.getItem("currentLogin") || "");
    }
  }, []);

  // Fonction pour mélanger aléatoirement un tableau
  const shuffleArray = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Mélanger les chiffres au chargement initial de la page
  useEffect(() => {
    setKeypadDigits(shuffleArray(keypadDigits));
  }, []);

  // Ajouter un chiffre au PIN
  const handleDigitClick = (digit: string) => {
    if (pin.length < PIN_LENGTH) {
      setPin([...pin, digit]);
    }
  };

  // Supprimer le dernier chiffre
  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const { isMobile } = useResponsive();

  const router = useRouter();

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLogin = localStorage.getItem("currentLogin");
      if (!storedLogin) {
        window.location.href = "/";
      }
    }
  }, []);

  // Utiliser une référence pour suivre si la requête a déjà été envoyée
  const requestSentRef = React.useRef(false);

  // Fonction asynchrone pour gérer la connexion
  const processLogin = async (passcode: string) => {
    try {
      setIsLoading(true);

      const api_token = localStorage.getItem("api_token");
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      // Le token d'authentification pour l'API de login
      myHeaders.append("Authorization", `Bearer ${api_token}`);

      const raw = JSON.stringify({
        login: currentLogin,
        passcode,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow" as RequestRedirect,
      };

      const response = await fetch(
        `${API_URL}/v3/user/client/login`,
        requestOptions
      );

      console.log(response, "responseLogin");

      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`);
      }

      const data = await response.json();

      console.log(data, "responseLogin");

      if (data.message === "Action éffectuée avec succès" && data.data) {
        // Marquer que nous sommes en train de rediriger
        setRedirecting(true);
        
        // Créer un objet avec les données de l'utilisateur
        const userData = {
          token: data.data.token,
          refreshToken: data.data.refreshToken,
          user: data.data.user
        };

        // 1. Stocker dans sessionStorage pour un accès immédiat et synchrone
        sessionStorage.setItem("authData", JSON.stringify(userData));
        
        // 2. Stocker dans localStorage pour persistance à long terme
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("refreshToken", data.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        // 3. Pré-initialiser le dashboard avec les données utilisateur
        // via l'URL avec données en paramètres encodées
        const userDataForUrl = btoa(JSON.stringify({
          firstname: data.data.user.firstname,
          lastname: data.data.user.lastname,
          userId: data.data.user._id
        }));

        // Redirection vers le tableau de bord avec données utilisateur
        // Utiliser un court délai pour éviter de multiples redirections
        setTimeout(() => {
          window.location.href = `/dashboard?udata=${userDataForUrl}`;
        }, 100);
        
        return true;
      } else {
        // Animation d'erreur et réinitialisation
        setError(data.message || "Identifiants incorrects");
        setShakeAnimation(true);
        setPin([]);
        setTimeout(() => {
          setShakeAnimation(false);
        }, 500);
        return false;
      }
    } catch (err) {
      console.error("Erreur pendant la connexion:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
      setShakeAnimation(true);
      setPin([]);
      setTimeout(() => {
        setShakeAnimation(false);
      }, 500);
      return false;
    } finally {
      // Ne réinitialiser les états que si nous ne sommes pas en train de rediriger
      if (!redirecting) {
        setIsLoading(false);
        requestSentRef.current = false;
      }
    }
  };

  // Surveiller la saisie complète du code PIN
  useEffect(() => {
    // Si le PIN est complet, la requête n'a pas encore été envoyée, n'est pas en chargement et pas en redirection
    if (pin.length === PIN_LENGTH && !requestSentRef.current && !isLoading && !redirecting) {
      // Marquer que la requête est en cours d'envoi
      requestSentRef.current = true;
      const passcode = pin.join("");
      processLogin(passcode);
    }
  }, [pin, isLoading, currentLogin, redirecting]);

  // Ces variables ne sont pas utilisées car nous définissons les animations directement dans le style JSX

  return (
    <AuthLayout>
      <>
        {/* Styles pour les animations personnalisées */}
        <style jsx>{`
          @keyframes progressBar {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }

          @keyframes moveLeftRight {
            0% {
              transform: translateX(-100px);
            }
            50% {
              transform: translateX(100px);
            }
            100% {
              transform: translateX(-100px);
            }
          }

          @keyframes blink {
            0%,
            100% {
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
          }

          @keyframes shake {
            0%,
            100% {
              transform: translateX(0);
            }
            10%,
            30%,
            50%,
            70%,
            90% {
              transform: translateX(-10px);
            }
            20%,
            40%,
            60%,
            80% {
              transform: translateX(10px);
            }
          }

          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-progressBar {
            animation: progressBar 1.5s cubic-bezier(0.45, 0, 0.55, 1) forwards;
          }

          .animate-moveLeftRight {
            animation: moveLeftRight 3s ease-in-out infinite;
          }

          .animate-blink {
            animation: blink 1s ease-in-out infinite;
          }

          .animate-shake {
            animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          }

          .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
          }
        `}</style>

        {/* Loader overlay - Design moderne */}
        {isLoading && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
            {/* Container principal */}
            <div className="relative w-full max-w-md px-6 py-10">
              {/* Barre de progression */}
              <div className="w-full h-1 bg-gray-100 rounded-full mb-8 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#EC4F48] to-[#FFBE20] animate-progressBar"></div>
              </div>

              {/* Animations d'électricité moderne */}
              <div className="relative h-40 flex items-center justify-center mb-8">
                {/* Lignes d'énergie */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[200px] h-[1px] bg-gradient-to-r from-transparent via-[#EC4F48] to-transparent animate-pulse"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center transform rotate-45">
                  <div className="w-[200px] h-[1px] bg-gradient-to-r from-transparent via-[#FFBE20] to-transparent animate-pulse"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center transform rotate-90">
                  <div className="w-[200px] h-[1px] bg-gradient-to-r from-transparent via-[#EC4F48] to-transparent animate-pulse"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center transform rotate-135">
                  <div className="w-[200px] h-[1px] bg-gradient-to-r from-transparent via-[#FFBE20] to-transparent animate-pulse"></div>
                </div>

                {/* Cercle central avec éclair */}
                <div className="relative z-10 bg-white rounded-full p-4 shadow-[0_0_30px_rgba(236,79,72,0.3)]">
                  <div className="bg-gradient-to-br from-[#EC4F48] to-[#FFBE20] rounded-full p-5">
                    <svg
                      className="w-10 h-10 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13 2L4.5 12.5H11L9 22L17.5 11.5H11L13 2Z"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="0.5"
                      />
                    </svg>
                  </div>
                </div>

                {/* Points d'énergie qui se déplacent le long des lignes */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#EC4F48] absolute animate-moveLeftRight"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center transform rotate-45">
                  <div
                    className="w-2 h-2 rounded-full bg-[#FFBE20] absolute animate-moveLeftRight"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center transform rotate-90">
                  <div
                    className="w-2 h-2 rounded-full bg-[#EC4F48] absolute animate-moveLeftRight"
                    style={{ animationDelay: "0.8s" }}
                  ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center transform rotate-135">
                  <div
                    className="w-2 h-2 rounded-full bg-[#FFBE20] absolute animate-moveLeftRight"
                    style={{ animationDelay: "1.2s" }}
                  ></div>
                </div>
              </div>

              {/* Texte moderne */}
              <div className="text-center">
                <h3 className="text-[#1F2937] text-xl font-bold mb-2">
                  Connexion en cours
                </h3>
                <p className="text-[#6B7280] text-sm font-medium">
                  Chargement de votre espace énergie
                  <span className="inline-block w-1 h-1 bg-[#EC4F48] rounded-full ml-1 animate-blink"></span>
                  <span
                    className="inline-block w-1 h-1 bg-[#EC4F48] rounded-full ml-1 animate-blink"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="inline-block w-1 h-1 bg-[#EC4F48] rounded-full ml-1 animate-blink"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                </p>
              </div>
            </div>
          </div>
        )}
        <div
          className={`flex items-center justify-center px-4 ${
            isMobile ? "flex-col pt-10 gap-5 px-10" : ""
          }`}
        >
          <div className="w-full">
            {/* bienvenue avec avatar  */}
            <div className="flex flex-col justify-center w-full items-center">
              <Image src="/profile.png" alt="profile" width={139} height={50} />
              <p className="font-bold text-2xl">Akwaba Landry</p>
              <p className="text-sm">Entrez votre code pour vous connecter</p>
              <div className="pt-10">
                <button
                  onClick={() => router.push("/")}
                  className="flex items-center gap-2"
                >
                  <div className=" flex justify-center bg-primary w-8 h-8 rounded-full items-center">
                    <svg
                      width="11"
                      height="18"
                      viewBox="0 0 11 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.71875 2.0625L1.78125 9L8.71875 15.9375"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="text-primary font-medium">
                    Retour à la connexion
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* line vertical */}
          {isMobile ? (
            ""
          ) : (
            <div className="h-96 w-px mx-8 border border-gray-100"></div>
          )}

          {/* Code */}
          <div className="w-full flex flex-col justify-center items-center">
            {/* Titre */}
            <p className="text-center text-base font-semibold mb-4">
              Entrez votre code pour vous connecter
            </p>

            {/* Points indicateurs */}
            <div
              className={`flex gap-2 mb-3 ${
                shakeAnimation ? "animate-shake" : ""
              }`}
            >
              {Array.from({ length: PIN_LENGTH }).map((_, index) => (
                <span
                  key={index}
                  className={`h-6 w-6 rounded-full ${
                    index < pin.length ? "bg-primary" : "bg-[#F1F1F1]"
                  }`}
                ></span>
              ))}
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="flex items-center justify-center w-full mb-4 bg-red-50 border border-red-200 rounded-lg p-3 animate-fade-in">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-600 font-medium text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Clavier numérique avec chiffres qui changent de position */}
            <div className={`grid grid-cols-3 ${isMobile ? "gap-2" : "gap-8"}`}>
              {/* Afficher les 9 premiers chiffres du tableau mélangé */}
              {keypadDigits.slice(0, 9).map((digit) => (
                <button
                  key={`button-${digit}`}
                  onClick={() => handleDigitClick(digit)}
                  className={`h-20 w-28 text-4xl font-bold flex items-center justify-center border-2 border-gray-100 rounded-xl hover:bg-gray-100 transition-all duration-300 ${bebas_beue.className}`}
                >
                  {digit}
                </button>
              ))}

              {/* Dernière ligne : Bouton pour le dernier chiffre */}
              <button
                onClick={() => handleDigitClick(keypadDigits[9])}
                className={`h-20 w-28 text-4xl font-bold flex items-center justify-center border-2 border-gray-100 rounded-xl hover:bg-gray-100 transition-all duration-300 ${bebas_beue.className} col-start-2`}
              >
                {keypadDigits[9]}
              </button>

              {/* Bouton Supprimer */}
              <button
                onClick={handleDelete}
                className="h-20 w-28 flex items-center justify-center rounded-lg hover:bg-gray-100"
              >
                <svg
                  width="36"
                  height="26"
                  viewBox="0 0 36 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.5 8L25.5 18M25.5 8L15.5 18M10.5 1.75H34.25V24.25H10.5L1.75 13L10.5 1.75Z"
                    stroke="#EC4F48"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Lien oublié */}
            <Link
              href={"/recuperation"}
              className="text-sm mt-5 cursor-pointer underline hover:text-primary"
            >
              J&apos;ai oublié mon code
            </Link>
          </div>
        </div>
      </>
    </AuthLayout>
  );
};

export default Page;
