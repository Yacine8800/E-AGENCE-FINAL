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

  // État pour le paramètre mode de l'URL
  const [modeParam, setModeParam] = useState<string | null>(null);

  // État pour suivre l'étape actuelle
  const [currentStep, setCurrentStep] = useState("userInfo"); // userInfo, otpVerification, passcode

  // États pour les informations utilisateur
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactPrefix, setContactPrefix] = useState("+225");
  const [contact, setContact] = useState("");
  const [otpCode, setOtpCode] = useState("");

  // États pour le code PIN
  const [step, setStep] = useState<1 | 2>(1); // Étape 1: Saisie initiale, Étape 2: Confirmation
  const [originalPin, setOriginalPin] = useState<string | null>(null); // Premier PIN
  const [pin, setPin] = useState<string[]>([]);

  // États pour les notifications
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [shakeAnimation, setShakeAnimation] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("error");

  // Récupérer le paramètre mode depuis l'URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Récupérer les paramètres d'URL
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get('mode');

      if (mode) {
        // Stocker le mode pour l'utiliser après inscription
        setModeParam(mode);
        localStorage.setItem('pendingDemandeMode', mode);
      }
    }
  }, []);

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

  // Gestionnaire pour la soumission du formulaire d'informations utilisateur
  const handleUserInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !firstName.trim() || !lastName.trim() || !contact.trim()) {
      showToastMessage("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }

    try {
      // Obtenir le token d'API
      const apiToken = await getApiToken();

      // Appel API pour générer l'OTP pour le numéro de téléphone
      const phoneResponse = await fetch(`${API_URL}/v3/user/otp/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          login: `${contact}`,
        }),
      });

      const phoneData = await phoneResponse.json();

      // Vérifier si la requête a réussi
      if (phoneResponse.ok) {
        showToastMessage("Code OTP envoyé à votre numéro de téléphone", "success");
        setCurrentStep("otpVerification");
      } else {
        // La requête a échoué
        const errorMessage = phoneData.message || "Erreur lors de l'envoi du code OTP";
        showToastMessage(errorMessage, "error");
      }
    } catch (error) {
      console.error("Erreur lors de la génération de l'OTP:", error);
      showToastMessage("Une erreur est survenue. Veuillez réessayer.", "error");
    }
  };

  // Gestionnaire pour l'OTP
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

      // Vérifier l'OTP avec le numéro de téléphone
      const phoneVerification = await fetch(`${API_URL}/v3/user/otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          login: `${contact}`,
          code: code,
        }),
      });

      const phoneData = await phoneVerification.json();

      // Si la vérification par téléphone réussit
      if (phoneVerification.ok) {
        showToastMessage("Code OTP vérifié avec succès", "success");
        setTimeout(() => setCurrentStep("passcode"), 500);
        return;
      }

      // Si la vérification échoue
      const errorMessage = phoneData.message || "Code OTP invalide. Veuillez réessayer.";
      showToastMessage(errorMessage, "error");
      setOtpCode(""); // Réinitialiser le code OTP

    } catch (error) {
      console.error("Erreur lors de la vérification de l'OTP:", error);
      showToastMessage("Une erreur est survenue. Veuillez réessayer.", "error");
      setOtpCode(""); // Réinitialiser le code OTP
    }
  };

  // Fonctions pour la gestion du code PIN
  const handleDigitClick = (digit: string) => {
    if (pin.length < PIN_LENGTH) {
      setPin([...pin, digit]);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
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
          setToastMessage("Les codes ne correspondent pas, veuillez réessayer.");
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
          email: email,
          contact: contact,
          contactPrefix: contactPrefix,
          lastname: lastName,
          firstname: firstName,
          passcode: passcode,
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
            localStorage.setItem("user", JSON.stringify(loginData.data.user));

            // Récupérer le mode à utiliser pour l'ouverture du modal
            const pendingMode = localStorage.getItem('pendingDemandeMode');

            // Rediriger vers le tableau de bord avec ouverture automatique du modal si nécessaire
            if (pendingMode) {
              // Déterminer quel type de demande ouvrir dans le dashboard
              let demandeType = "";
              switch (parseInt(pendingMode)) {
                case 3: // Mutation
                  demandeType = "mutation";
                  break;
                case 1: // Branchement d'abonnement
                  demandeType = "branchement";
                  break;
                case 2: // Réabonnement
                  demandeType = "reabonnement";
                  break;
                default:
                  demandeType = "";
              }

              // Stocker le type de demande dans localStorage pour que le dashboard puisse l'utiliser
              if (demandeType) {
                localStorage.setItem('openDemandeType', demandeType);
                console.log("Type de demande à ouvrir après redirection:", demandeType);

                // Attendre un moment pour s'assurer que le localStorage est bien mis à jour
                setTimeout(() => {
                  // S'assurer une dernière fois que tout est bien stocké
                  console.log("Vérification avant redirection:", {
                    token: !!localStorage.getItem("token"),
                    user: !!localStorage.getItem("user"),
                    openDemandeType: localStorage.getItem('openDemandeType')
                  });

                  // Rediriger vers le tableau de bord
                  router.push("/dashboard?openModal=true");
                }, 500);
              } else {
                // Rediriger vers le tableau de bord sans paramètre spécial
                router.push("/dashboard");
              }
            } else {
              // Rediriger vers le tableau de bord sans paramètre spécial
              router.push("/dashboard");
            }
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

  // Rendu conditionnel du contenu en fonction de l'étape actuelle
  const renderContent = () => {
    switch (currentStep) {
      case "userInfo":
        return (
          <>
            <div>
              <Title title="Création de compte" />
              <p className="text-[14px] text-smallText font-medium text-center">
                Saisissez vos informations pour créer votre compte maCIE.
              </p>
            </div>
            {/* Formulaire */}
            <div className="pt-5 w-full">
              <form onSubmit={handleUserInfoSubmit}>
                <div className="mb-4">
                  <label htmlFor="lastName" className="font-bold text-base">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Votre nom"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-xl px-5 py-5 border-2 border-[#EDEDED] mt-2"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="firstName" className="font-bold text-base">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="Votre prénom"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-xl px-5 py-5 border-2 border-[#EDEDED] mt-2"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="font-bold text-base">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Votre email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl px-5 py-5 border-2 border-[#EDEDED] mt-2"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="contact" className="font-bold text-base">
                    Téléphone
                  </label>
                  <div className="flex mt-2">
                    <select
                      value={contactPrefix}
                      onChange={(e) => setContactPrefix(e.target.value)}
                      className="rounded-l-xl px-3 py-5 border-2 border-r-0 border-[#EDEDED] bg-white"
                    >
                      <option value="+225">+225</option>
                      <option value="+33">+33</option>
                      <option value="+1">+1</option>
                    </select>
                    <input
                      type="tel"
                      id="contact"
                      placeholder="Votre numéro de téléphone"
                      required
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="flex-1 rounded-r-xl px-5 py-5 border-2 border-[#EDEDED]"
                    />
                  </div>
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

      case "otpVerification":
        return (
          <>
            <div>
              <Title title="Vérification OTP" />
              <p className="text-[14px] font-medium text-center">
                Entrez le code OTP qui vous a été envoyé à{" "}
                <span className="font-bold">{contactPrefix}{contact}</span>
              </p>
            </div>

            {/* Input OTP */}
            <div
              className={`pt-10 w-full flex justify-center ${isMobile ? "px-5" : ""}`}
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

            {/* Bouton Retour */}
            <div className="mt-8">
              <button
                onClick={() => setCurrentStep("userInfo")}
                className="w-full rounded-full text-primary border-2 border-primary font-semibold py-4 hover:bg-gray-100"
              >
                Retour
              </button>
            </div>
          </>
        );

      case "passcode":
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
                className={`flex gap-2 mb-3 ${shakeAnimation ? "animate-shake" : ""}`}
              >
                {Array.from({ length: PIN_LENGTH }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-6 w-6 rounded-full ${index < pin.length ? "bg-primary" : "bg-[#F1F1F1]"}`}
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

              {/* Clavier numérique */}
              <div className={`grid grid-cols-3 ${isMobile ? "gap-2" : "gap-8"}`}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit, index) => (
                  <button
                    key={digit}
                    onClick={() => handleDigitClick(digit.toString())}
                    className={`h-20 w-28 text-4xl font-bold flex items-center justify-center border-2 border-gray-100 rounded-xl hover:bg-gray-100 ${bebas_beue.className} ${digit === 0 ? "col-start-2" : ""}`}
                    style={{
                      gridColumn: digit === 0 ? "2" : "auto",
                    }}
                  >
                    {digit}
                  </button>
                ))}

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

              {/* Bouton Retour */}
              <div className="mt-8">
                <button
                  onClick={() => setCurrentStep("otpVerification")}
                  className="w-full rounded-full text-primary border-2 border-primary font-semibold py-4 hover:bg-gray-100"
                >
                  Retour
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

        <div className="h-full overflow-auto">
          <div className="w-full max-w-md mx-auto px-4 pt-4 pb-4">
            {/* Contenu de l'étape actuelle */}
            {renderContent()}
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
            className={`${toastType === "error" ? "bg-red-500" : "bg-green-500"} p-2 rounded-full`}
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
