"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AuthLayout } from "../authLayout";
import { useResponsive } from "@/src/hooks/useResponsive";
import Title from "../components/title";
import { useRouter } from "next/navigation";
import { bebas_beue } from "@/utils/globalFunction";
import SucessModale from "../components/modales/sucessModale";
import { X, AlertCircle } from "lucide-react";

const PIN_LENGTH = 6;

const Page = () => {
  const [step, setStep] = useState<1 | 2>(1); // Étape 1: Saisie initiale, Étape 2: Confirmation
  const [originalPin, setOriginalPin] = useState<string | null>(null); // Premier PIN
  const [pin, setPin] = useState<string[]>([]);
  const [shuffledDigits, setShuffledDigits] = useState<string[]>([
    "9",
    "4",
    "6",
    "7",
    "1",
    "0",
    "2",
    "8",
    "5",
  ]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const router = useRouter();
  const { isMobile } = useResponsive();

  // Ajouter un chiffre au PIN et mélanger le clavier après chaque saisie
  const handleDigitClick = (digit: string) => {
    if (pin.length < PIN_LENGTH) {
      setPin([...pin, digit]);
      // Mélanger le clavier après chaque saisie
      setShuffledDigits(shuffleArray([...shuffledDigits]));
    }
  };

  // Supprimer le dernier chiffre et mélanger le clavier
  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    // Mélanger le clavier après suppression
    setShuffledDigits(shuffleArray([...shuffledDigits]));
  };

  // Mélanger les chiffres (Fisher-Yates shuffle)
  const shuffleArray = (array: string[]) => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  // Vérifier la validation du PIN
  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      if (step === 1) {
        // Sauvegarder le PIN et passer à l'étape de confirmation
        setOriginalPin(pin.join(""));
        setPin([]); // Réinitialiser l'entrée utilisateur
        // Pas besoin de mélanger ici car le mélange se fait déjà après chaque saisie
        setStep(2);
      } else if (step === 2) {
        // Vérifier si la saisie correspond au premier PIN
        if (originalPin === pin.join("")) {
          setShowSuccessModal(true); // Afficher le modal de succès
        } else {
          setToastMessage("Code incorrect, veuillez réessayer.");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
          setPin([]); // Réinitialiser l'entrée utilisateur
        }
      }
    }
  }, [originalPin, pin, shuffledDigits, step]);

  return (
    <AuthLayout>
      <>
        <div
          className={`flex items-center justify-center px-4 ${
            isMobile ? "flex-col pt-10 gap-5 px-10" : ""
          }`}
        >
          <div className="w-full max-w-md">
            <div className="flex flex-col justify-center w-full items-center">
              <Title title="Sécurisation du compte" />
              <Image src="/profile.png" alt="profile" width={139} height={50} />
              <div className="pt-10">
                <button
                  onClick={() => router.push("/register")}
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
                    Retour à la création de compte
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
              {step === 1
                ? "Sécurisez votre compte en définissant votre code confidentiel"
                : "Confirmez votre code confidentiel"}
            </p>

            {/* Points indicateurs */}
            <div className="flex gap-2 mb-6">
              {Array.from({ length: PIN_LENGTH }).map((_, index) => (
                <span
                  key={index}
                  className={`h-6 w-6 rounded-full ${
                    index < pin.length ? "bg-primary" : "bg-[#F1F1F1]"
                  }`}
                ></span>
              ))}
            </div>

            {/* Clavier numérique (mélangé après la première saisie) */}
            <div className={`grid grid-cols-3 ${isMobile ? "gap-2" : "gap-8"}`}>
              {shuffledDigits.map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleDigitClick(digit)}
                  className={`h-20 w-28 text-4xl font-bold flex items-center justify-center border-2 border-gray-100 rounded-xl hover:bg-gray-100 ${bebas_beue.className} `}
                >
                  {digit}
                </button>
              ))}

              {/* Dernière ligne : Bouton "3" centré */}
              <button
                onClick={() => handleDigitClick("3")}
                className={`h-20 w-28 text-4xl font-bold flex items-center justify-center border-2 border-gray-100 rounded-xl hover:bg-gray-100 ${bebas_beue.className} col-start-2`}
              >
                3
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

            {showSuccessModal && <SucessModale />}
          </div>
        </div>

        {/* Toast de notification */}
        <div
          className={`fixed top-4 right-4 max-w-xs w-full bg-white shadow-md rounded-lg p-4 flex items-center gap-3 transform transition-all duration-300 z-[2000] ${
            showToast
              ? "translate-y-0 opacity-100"
              : "translate-y-[-20px] opacity-0"
          }`}
        >
          <div className="bg-red-500 p-2 rounded-full">
            <AlertCircle className="text-white h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-gray-800">Erreur</p>
            <p className="text-xs text-gray-500">{toastMessage}</p>
          </div>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setShowToast(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </>
    </AuthLayout>
  );
};

export default Page;
