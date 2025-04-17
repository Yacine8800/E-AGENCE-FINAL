"use client";

import React, { useState, useEffect } from "react";
import { AuthLayout } from "@/src/app/authLayout";
import IconGoogle from "../components/icons/iconGoogle";
import IconFacebook from "../components/icons/iconFacebook";
import OtpInput from "react-otp-input";
import { useRouter } from "next/navigation";
import { useResponsive } from "@/src/hooks/useResponsive";

import Image from "next/image";
import { bebas_beue } from "@/utils/globalFunction";
import SucessModale from "../components/modales/sucessModale";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import { API_KEY, API_URL } from "../config/constants";
import CountdownTimer from "../components/countdownTimer";
import Title from "../components/title";

// Constantes
const PIN_LENGTH = 6;

// Composant principal
const RegisterStepper = () => {
  const router = useRouter();
  const { isMobile } = useResponsive();

  // État pour suivre l'étape actuelle
  const [currentStep, setCurrentStep] = useState(1);

  // États pour les différentes étapes
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [secretQuestion, setSecretQuestion] = useState("");
  const [secretAnswer, setSecretAnswer] = useState("");
  const [secretQuestions, setSecretQuestions] = useState<
    Array<{
      _id: string;
      slug: string;
      questionText: string;
      languageCode: string;
      category: string;
      status: string;
      securityLevel: string;
      isCustomizable: boolean;
      minAnswerLength: number;
      maxAnswerLength: number;
      createdBy: string;
      version: number;
      user: null | string;
      createdAt: string;
      updatedAt: string;
      updatedBy: string;
    }>
  >([]);

  // États pour le code PIN
  const [step, setStep] = useState<1 | 2>(1); // Étape 1: Saisie initiale, Étape 2: Confirmation
  const [originalPin, setOriginalPin] = useState<string | null>(null); // Premier PIN
  const [pin, setPin] = useState<string[]>([]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [shakeAnimation, setShakeAnimation] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("error");

  // Fonction pour afficher un toast
  const showToastMessage = (
    message: string,
    type: "success" | "error" = "error",
    duration: number = 3000
  ) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), duration);
  };

  // Fonction pour passer à l'étape suivante
  const goToNextStep = () => {
    const nextStep = currentStep + 1;

    // Si on passe à l'étape de la question secrète, charger les questions
    if (nextStep === 4) {
      loadSecretQuestions();
    }

    setCurrentStep(nextStep);
  };

  // Fonction pour revenir à l'étape précédente
  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Fonction pour revenir à la création de compte (première étape)
  const backToRegister = () => {
    setCurrentStep(1);
  };

  // Fonction pour obtenir le token d'API
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
        body: JSON.stringify({ apikey: `${API_KEY}` }),
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

  // Fonction pour charger les questions secrètes depuis l'API
  const loadSecretQuestions = async () => {
    try {
      // Obtenir le token d'API
      const apiToken = await getApiToken();

      const response = await fetch(`${API_URL}/v3/user/question`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Vérifier si data est un tableau ou s'il contient une propriété data/questions
        if (Array.isArray(data)) {
          setSecretQuestions(data);
        } else if (data.data && Array.isArray(data.data)) {
          setSecretQuestions(data.data);
        } else if (data.questions && Array.isArray(data.questions)) {
          setSecretQuestions(data.questions);
        } else {
          // Si nous recevons un seul objet, le mettre dans un tableau
          const singleQuestion = data.hasOwnProperty("_id") ? [data] : [];
          if (singleQuestion.length > 0) {
            setSecretQuestions(singleQuestion);
          } else {
            console.error("Format de réponse inattendu:", data);
            showToastMessage(
              "Impossible de charger les questions secrètes. Format de réponse inattendu.",
              "error"
            );
          }
        }
      } else {
        console.error(
          "Erreur lors du chargement des questions secrètes:",
          data
        );
        showToastMessage(
          "Impossible de charger les questions secrètes. Veuillez réessayer.",
          "error"
        );
      }
    } catch (error) {
      console.error("Erreur lors du chargement des questions secrètes:", error);
      showToastMessage("Une erreur est survenue. Veuillez réessayer.", "error");
    }
  };

  // Gestionnaire pour l'étape 1 (Création de compte)
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToastMessage(
        "Veuillez entrer un email ou un numéro de téléphone valide",
        "error"
      );
      return;
    }

    try {
      // Obtenir le token d'API
      const apiToken = await getApiToken();

      // Appel API pour générer l'OTP
      const response = await fetch(`${API_URL}/v3/user/otp/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          login: email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToastMessage("Code OTP envoyé avec succès", "success");
        goToNextStep();
      } else {
        showToastMessage(
          data.message || "Erreur lors de la génération du code OTP",
          "error"
        );
      }
    } catch (error) {
      console.error("Erreur lors de la génération de l'OTP:", error);
      showToastMessage("Une erreur est survenue. Veuillez réessayer.", "error");
    }
  };

  // Gestionnaire pour l'étape 2 (OTP)
  const handleOtpChange = (newCode: string) => {
    // Vérifier que l'entrée ne contient que des chiffres et qu'on ne dépasse pas la limite
    if (/^\d*$/.test(newCode) && newCode.length <= 4) {
      setOtpCode(newCode);
    }

    if (newCode.length === 4) {
      verifyOtp(newCode);
    }
  };

  // Fonction pour vérifier l'OTP
  const verifyOtp = async (code: string) => {
    try {
      // Obtenir le token d'API
      const apiToken = await getApiToken();

      const response = await fetch(`${API_URL}/v3/user/otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          login: email,
          code: code,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToastMessage("Code OTP vérifié avec succès", "success");
        setTimeout(() => goToNextStep(), 500);
      } else {
        showToastMessage(
          data.message || "Code OTP invalide. Veuillez réessayer.",
          "error"
        );
        setOtpCode(""); // Réinitialiser le code OTP
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'OTP:", error);
      showToastMessage("Une erreur est survenue. Veuillez réessayer.", "error");
      setOtpCode(""); // Réinitialiser le code OTP
    }
  };

  // Gestionnaire pour l'étape 3 (Identité)
  const handleIdentitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToNextStep();
  };

  // Gestionnaire pour l'étape 4 (Question secrète)
  const handleSecretQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!secretQuestion || !secretAnswer.trim()) {
      showToastMessage(
        "Veuillez sélectionner une question et entrer une réponse",
        "error"
      );
      return;
    }

    showToastMessage("Question secrète enregistrée", "success");
    goToNextStep();
  };

  // Fonctions pour l'étape 5 (Code PIN)
  const handleDigitClick = (digit: string) => {
    if (pin.length < PIN_LENGTH) {
      setPin([...pin, digit]);
      // Mélanger le clavier après chaque saisie
      // setShuffledDigits(shuffleArray([...shuffledDigits]));
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    // Mélanger le clavier après suppression
    // setShuffledDigits(shuffleArray([...shuffledDigits]));
  };

  // Vérifier la validation du PIN
  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      if (step === 1) {
        // Sauvegarder le PIN et passer à l'étape de confirmation
        setOriginalPin(pin.join(""));
        setPin([]); // Réinitialiser l'entrée utilisateur
        setStep(2);
      } else if (step === 2) {
        // Vérifier si la saisie correspond au premier PIN
        if (originalPin === pin.join("")) {
          // Appeler l'API d'inscription
          registerUser(pin.join(""));
        } else {
          setToastMessage("Code incorrect, veuillez réessayer.");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
          setPin([]); // Réinitialiser l'entrée utilisateur
        }
      }
    }
  }, [originalPin, pin, step]);

  // Fonction pour enregistrer l'utilisateur
  const registerUser = async (passcode: string) => {
    try {
      // Obtenir le token d'API
      const apiToken = await getApiToken();

      const response = await fetch(`${API_URL}/v3/user/client/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          login: email,
          passcode: passcode,
          lastname: lastName,
          firstname: firstName,
          secretQuestion: secretQuestion,
          secretResponse: secretAnswer,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToastMessage("Inscription réussie!", "success");
        setErrorMessage(""); // Effacer tout message d'erreur

        // Connecter l'utilisateur automatiquement après l'inscription
        try {
          const loginResponse = await fetch(`${API_URL}/v3/user/client/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiToken}`,
            },
            body: JSON.stringify({
              login: email,
              passcode: passcode,
            }),
          });

          const loginData = await loginResponse.json();

          if (loginResponse.ok && loginData.token) {
            // Stocker le token utilisateur
            localStorage.setItem("token", loginData.token);

            // Rediriger vers le tableau de bord
            router.push("/dashboard");
          } else {
            // Si la connexion automatique échoue, afficher le modal de succès pour permettre à l'utilisateur de se connecter manuellement
            setShowSuccessModal(true);
          }
        } catch (loginError) {
          console.error("Erreur lors de la connexion automatique:", loginError);
          // En cas d'erreur, afficher le modal de succès
          setShowSuccessModal(true);
        }
      } else {
        // Afficher le message d'erreur sous les points de mot de passe
        const errorMsg =
          data.message || "Erreur lors de l'inscription. Veuillez réessayer.";
        setErrorMessage(errorMsg);
        showToastMessage(errorMsg, "error");

        // Déclencher l'animation de secousse
        setShakeAnimation(true);
        setTimeout(() => setShakeAnimation(false), 500);

        setPin([]); // Réinitialiser l'entrée utilisateur
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);

      // Afficher le message d'erreur sous les points de mot de passe
      const errorMsg = "Une erreur est survenue. Veuillez réessayer.";
      setErrorMessage(errorMsg);
      showToastMessage(errorMsg, "error");

      // Déclencher l'animation de secousse
      setShakeAnimation(true);
      setTimeout(() => setShakeAnimation(false), 500);

      setPin([]); // Réinitialiser l'entrée utilisateur
    }
  };

  // Indicateur de progression du stepper
  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-6">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${stepNumber === currentStep
                  ? "bg-primary text-white"
                  : stepNumber < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                  }`}
              >
                {stepNumber < currentStep ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              {stepNumber < 5 && (
                <div
                  className={`w-10 h-1 ${stepNumber < currentStep ? "bg-green-500" : "bg-gray-200"
                    }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Bouton de retour
  const renderBackButton = () => {
    if (currentStep === 1) return null;

    return (
      <div className="flex justify-center pt-10">
        <button
          className="flex items-center gap-2"
          onClick={currentStep === 2 ? backToRegister : goToPreviousStep}
        >
          <div className="flex justify-center bg-primary w-8 h-8 rounded-full items-center">
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
            {currentStep === 2
              ? "Retour à la création de compte"
              : "Retour à l'étape précédente"}
          </p>
        </button>
      </div>
    );
  };

  // Rendu conditionnel du contenu en fonction de l'étape actuelle
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div>
              <Title title="Création de compte" />
              <p className="text-[14px] text-smallText font-medium text-center">
                Saisir l'adresse e-mail ou le n° de téléphone que vous voulez
                associer à votre compte maCIE.
              </p>
            </div>
            {/* Formulaire */}
            <div className="pt-5 w-full">
              <form onSubmit={handleEmailSubmit}>
                <div>
                  <label htmlFor="email" className="font-bold text-base">
                    Email ou N° de téléphone
                  </label>
                  <input
                    type="text"
                    placeholder="E-mail / téléphone"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl px-5 py-5 border-2 border-[#EDEDED] mt-2"
                  />
                </div>
                <div className="pt-7">
                  <button className="w-full rounded-full bg-primary text-white font-semibold py-4">
                    Continuer
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

            {/* Inscription via réseaux sociaux */}
            <div className="flex gap-5 items-center justify-center">
              {[
                {
                  name: "Google",
                  svg: <IconGoogle />,
                },
                { name: "Facebook", svg: <IconFacebook /> },
              ].map(({ name, svg }) => (
                <button
                  key={name}
                  className="flex items-center justify-center rounded-lg py-3 px-7 bg-[#F5F5F5] hover:bg-gray-200"
                >
                  {svg}
                </button>
              ))}
            </div>

            {/* already account */}
            <div className="w-full pt-10">
              <p className="text-sm text-smallText text-center">
                J&apos;ai déjà un compte ?
              </p>
              <div className="pt-7">
                <button
                  onClick={() => router.push("/login")}
                  className="w-full rounded-full text-primary border-2 border-primary font-semibold py-4 hover:bg-gray-100"
                >
                  Se connecter
                </button>
              </div>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div>
              <Title title="Vérification OTP" />
              <p className="text-[14px] font-medium text-center">
                Entrez le code OTP qui vous a été envoyé à{" "}
                <span className="font-bold">
                  {email || "landryyamb@gmail.com"}
                </span>
              </p>
            </div>

            {/* Input OTP */}
            <div
              className={`pt-10 w-full flex justify-center ${isMobile ? "px-5" : ""
                }`}
            >
              <OtpInput
                value={otpCode}
                onChange={handleOtpChange}
                numInputs={4}
                shouldAutoFocus={true}
                renderInput={(props) => (
                  <input
                    {...props}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    onKeyDown={(e) => {
                      if (
                        !/[0-9]/.test(e.key) && // Empêcher les lettres & symboles
                        e.key !== "Backspace" &&
                        e.key !== "Delete"
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                )}
                containerStyle={`${isMobile ? "gap-2" : "gap-5"}`}
                inputStyle={{
                  border: "2px solid #F5F5F5",
                  borderRadius: "10px",
                  width: "80px",
                  height: "80px",
                  fontSize: "30px",
                  color: "#EC4F48",
                  fontWeight: "600",
                  caretColor: "red",
                }}
              />
            </div>

            {/* pas de code  */}
            <div className="pt-10 flex justify-center w-full">
              <CountdownTimer />
            </div>
          </>
        );

      case 3:
        return (
          <>
            <div>
              <Title title="Vérification identité" />
              <p className="text-[14px] text-smallText font-medium text-center">
                Nous avons récupérer les informations suivantes vous concernant
              </p>
            </div>
            {/* Formulaire */}
            <div className="pt-5 w-full">
              <form onSubmit={handleIdentitySubmit}>
                <div>
                  <label
                    htmlFor="firstName"
                    className="font-semibold text-base"
                  >
                    Nom(s)
                  </label>
                  <input
                    type="text"
                    placeholder="Yamb"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full font-semibold rounded-xl px-5 py-5 border-2 border-[#EDEDED] mt-2"
                  />
                </div>
                <div className="pt-7">
                  <label htmlFor="lastName" className="font-semibold text-base">
                    Prénom(s)
                  </label>
                  <input
                    type="text"
                    placeholder="Landry"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full font-semibold rounded-xl px-5 py-5 border-2 border-[#EDEDED] mt-2"
                  />
                </div>
                <div className="pt-7">
                  <button className="w-full rounded-full bg-primary text-white font-semibold py-4">
                    Définir ma question secrète
                  </button>
                </div>
              </form>
            </div>
          </>
        );

      case 4:
        return (
          <>
            <div>
              <Title title="Question secrète" />
              <p className="text-[14px] text-smallText font-medium text-center">
                Choisissez une question et une réponse pour protéger votre
                compte.
              </p>
            </div>
            {/* Formulaire */}
            <div className="pt-5 w-full">
              <form onSubmit={handleSecretQuestionSubmit}>
                <div>
                  <label htmlFor="question" className="font-semibold text-base">
                    Sélectionnez une question secrète
                  </label>
                  <select
                    id="question"
                    name="question"
                    required
                    value={secretQuestion}
                    onChange={(e) => setSecretQuestion(e.target.value)}
                    className="w-full font-semibold rounded-xl px-3 py-5 border-2 border-[#EDEDED] mt-2 bg-white"
                  >
                    <option value="" disabled>
                      Choisissez une question
                    </option>
                    {secretQuestions.length > 0 ? (
                      secretQuestions.map((q) => (
                        <option key={q._id} value={q._id}>
                          {q.questionText}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="">Aucune question</option>
                      </>
                    )}
                  </select>
                </div>
                <div className="pt-7">
                  <label htmlFor="response" className="font-semibold text-base">
                    Entrez votre réponse secrète
                  </label>
                  <input
                    type="text"
                    placeholder="Votre réponse"
                    required
                    value={secretAnswer}
                    onChange={(e) => setSecretAnswer(e.target.value)}
                    className="w-full font-semibold rounded-xl px-5 py-5 border-2 border-[#EDEDED] mt-2"
                  />
                </div>
                <div className="pt-7">
                  <button className="w-full rounded-full bg-primary text-white font-semibold py-4">
                    Définir mon code confidentiel
                  </button>
                </div>
              </form>
            </div>
          </>
        );

      case 5:
        return (
          <>
            <div className="flex flex-col justify-center w-full items-center">
              <Title title="Sécurisation du compte" />
              <Image src="/profile.png" alt="profile" width={139} height={50} />
            </div>

            <div className="w-full flex flex-col justify-center items-center mt-8">
              {/* Titre */}
              <p className="text-center text-base font-semibold mb-4">
                {step === 1
                  ? "Sécurisez votre compte en définissant votre code confidentiel"
                  : "Confirmez votre code confidentiel"}
              </p>

              {/* Points indicateurs */}
              <div
                className={`flex gap-2 mb-3 ${shakeAnimation ? "animate-shake" : ""
                  }`}
              >
                {Array.from({ length: PIN_LENGTH }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-6 w-6 rounded-full ${index < pin.length ? "bg-primary" : "bg-[#F1F1F1]"
                      }`}
                  ></span>
                ))}
              </div>

              {/* Message d'erreur */}
              {errorMessage && (
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
                    <p className="text-red-600 font-medium text-sm">
                      {errorMessage}
                    </p>
                  </div>
                </div>
              )}

              {/* Clavier numérique (mélangé après la première saisie) */}
              <div
                className={`grid grid-cols-3 ${isMobile ? "gap-2" : "gap-8"}`}
              >
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
          </>
        );

      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      <>
        {/* Styles pour les animations personnalisées */}
        <style jsx>{`
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

          .animate-shake {
            animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          }

          .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
          }
        `}</style>

        <div
          className={`flex items-center justify-center ${isMobile ? "pt-10 px-3" : ""
            }`}
        >
          <div className="w-full max-w-md">
            {/* Indicateur d'étape */}
            {renderStepIndicator()}

            {/* Contenu de l'étape actuelle */}
            {renderStepContent()}

            {/* Bouton de retour */}
            {renderBackButton()}
          </div>
        </div>

        {/* Toast de notification */}
        <div
          className={`fixed top-4 right-4 max-w-xs w-full bg-white shadow-md rounded-lg p-4 flex items-center gap-3 transform transition-all duration-300 z-[2000] ${showToast
            ? "translate-y-0 opacity-100"
            : "translate-y-[-20px] opacity-0"
            }`}
        >
          <div
            className={`${toastType === "error" ? "bg-red-500" : "bg-green-500"
              } p-2 rounded-full`}
          >
            {toastType === "error" ? (
              <AlertCircle className="text-white h-5 w-5" />
            ) : (
              <CheckCircle className="text-white h-5 w-5" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-gray-800">
              {toastType === "error" ? "Erreur" : "Succès"}
            </p>
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

export default RegisterStepper;
