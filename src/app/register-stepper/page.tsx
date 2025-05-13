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
import { X, AlertCircle, CheckCircle, ChevronDown } from "lucide-react";
import { API_KEY, API_URL } from "../config/constants";
import CountdownTimer from "../components/countdownTimer";
import Title from "../components/title";

// Constants
const PIN_LENGTH = 6;

// Registration phases
const PHASE = {
  USER_INFO: 'user_info',
  OTP_VERIFICATION: 'otp_verification',
  PASSCODE_CREATION: 'passcode_creation',
  PASSCODE_CONFIRMATION: 'passcode_confirmation'
};

// Définition des préfixes téléphoniques
const COUNTRY_PREFIXES = [
  { code: "+225", country: "Côte d'Ivoire" },
  { code: "+233", country: "Ghana" },
  { code: "+228", country: "Togo" },
  { code: "+229", country: "Bénin" },
  { code: "+226", country: "Burkina Faso" },
];

const Register = () => {
  const router = useRouter();
  const { isMobile } = useResponsive();

  // Current registration phase
  const [currentPhase, setCurrentPhase] = useState(PHASE.USER_INFO);

  // Form data
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    confirmEmail: "",
    contactPrefix: "+225",
    contact: "",
  });

  // OTP verification
  const [otpCode, setOtpCode] = useState("");

  // Passcode management
  const [passcode, setPasscode] = useState<string[]>([]);
  const [confirmPasscode, setConfirmPasscode] = useState<string[]>([]);

  // UI state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("error");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [shakeAnimation, setShakeAnimation] = useState(false);

  // Handle mode param for redirect after registration
  const [modeParam, setModeParam] = useState<string | null>(null);

  // State pour le dropdown des préfixes
  const [prefixDropdownOpen, setPrefixDropdownOpen] = useState(false);
  const [selectedPrefix, setSelectedPrefix] = useState(COUNTRY_PREFIXES[0]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get('mode');
      if (mode) {
        setModeParam(mode);
        localStorage.setItem('pendingDemandeMode', mode);
      }
    }
  }, []);

  // Show toast message
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

  // Get API token for authenticated requests
  const getApiToken = async () => {
    try {
      const storedToken = localStorage.getItem("api_token");
      const tokenExpiry = localStorage.getItem("api_token_expiry");

      if (storedToken && tokenExpiry && new Date(tokenExpiry) > new Date()) {
        return storedToken;
      }

      const response = await fetch(`${API_URL}/v3/user/get-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apikey: `${API_KEY}` }),
      });

      const data = await response.json();

      if (data.message === "ok" && data.data) {
        localStorage.setItem("api_token", data.data);
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

  // Handle form data change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Gérer le changement de préfixe
  const handlePrefixChange = (prefix: typeof COUNTRY_PREFIXES[0]) => {
    setSelectedPrefix(prefix);
    setFormData(prev => ({ ...prev, contactPrefix: prefix.code }));
    setPrefixDropdownOpen(false);
  };

  // Submit user information and send OTP
  const handleUserInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email && !formData.contact) {
      showToastMessage("Veuillez saisir un email ou un numéro de téléphone", "error");
      return;
    }

    if (formData.email && formData.email !== formData.confirmEmail) {
      showToastMessage("Les adresses email ne correspondent pas", "error");
      return;
    }

    try {
      const apiToken = await getApiToken();
      const loginValue = formData.contact;

      const response = await fetch(`${API_URL}/v3/user/otp/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          login: loginValue,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToastMessage("Code OTP envoyé avec succès", "success");
        setCurrentPhase(PHASE.OTP_VERIFICATION);
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

  // Handle OTP verification
  const handleOtpChange = (newCode: string) => {
    if (/^\d*$/.test(newCode) && newCode.length <= 4) {
      setOtpCode(newCode);
    }

    if (newCode.length === 4) {
      verifyOtp(newCode);
    }
  };

  // Verify OTP with API
  const verifyOtp = async (code: string) => {
    try {
      const apiToken = await getApiToken();
      const loginValue = formData.contact;

      const response = await fetch(`${API_URL}/v3/user/otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          login: loginValue,
          code: code,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToastMessage("Code OTP vérifié avec succès", "success");
        setTimeout(() => setCurrentPhase(PHASE.PASSCODE_CREATION), 500);
      } else {
        showToastMessage(
          data.message || "Code OTP invalide. Veuillez réessayer.",
          "error"
        );
        setOtpCode(""); // Reset OTP code
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'OTP:", error);
      showToastMessage("Une erreur est survenue. Veuillez réessayer.", "error");
      setOtpCode(""); // Reset OTP code
    }
  };

  // Handle passcode entry
  const handleDigitClick = (digit: string) => {
    if (currentPhase === PHASE.PASSCODE_CREATION) {
      if (passcode.length < PIN_LENGTH) {
        setPasscode([...passcode, digit]);
      }
    } else if (currentPhase === PHASE.PASSCODE_CONFIRMATION) {
      if (confirmPasscode.length < PIN_LENGTH) {
        setConfirmPasscode([...confirmPasscode, digit]);
      }
    }
  };

  // Handle passcode deletion
  const handleDelete = () => {
    if (currentPhase === PHASE.PASSCODE_CREATION) {
      setPasscode(passcode.slice(0, -1));
    } else if (currentPhase === PHASE.PASSCODE_CONFIRMATION) {
      setConfirmPasscode(confirmPasscode.slice(0, -1));
    }
  };

  // Check passcode when fully entered
  useEffect(() => {
    if (passcode.length === PIN_LENGTH && currentPhase === PHASE.PASSCODE_CREATION) {
      setCurrentPhase(PHASE.PASSCODE_CONFIRMATION);
    }
  }, [passcode, currentPhase]);

  // Verify confirmation passcode matches and register user
  useEffect(() => {
    if (confirmPasscode.length === PIN_LENGTH && currentPhase === PHASE.PASSCODE_CONFIRMATION) {
      if (passcode.join("") === confirmPasscode.join("")) {
        registerUser(passcode.join(""));
      } else {
        setToastMessage("Les codes ne correspondent pas, veuillez réessayer.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

        // Reset passcode and return to creation phase
        setPasscode([]);
        setConfirmPasscode([]);
        setCurrentPhase(PHASE.PASSCODE_CREATION);
      }
    }
  }, [confirmPasscode, passcode, currentPhase]);

  // Register user with API
  const registerUser = async (finalPasscode: string) => {
    try {
      const apiToken = await getApiToken();

      const payload = {
        email: formData.email,
        contact: formData.contact,
        contactPrefix: formData.contactPrefix,
        lastname: formData.lastname,
        firstname: formData.firstname,
        passcode: finalPasscode
      };

      const response = await fetch(`${API_URL}/v3/user/client/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        showToastMessage("Inscription réussie!", "success");

        // Try to login automatically
        try {
          const loginResponse = await fetch(`${API_URL}/v3/user/client/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiToken}`,
            },
            body: JSON.stringify({
              login: formData.email || formData.contact,
              passcode: finalPasscode,
            }),
          });

          const loginData = await loginResponse.json();

          if (loginResponse.ok && loginData.token) {
            localStorage.setItem("token", loginData.token);
            localStorage.setItem("user", JSON.stringify(loginData.data.user));

            // Redirect based on pending mode
            const pendingMode = localStorage.getItem('pendingDemandeMode');

            if (pendingMode) {
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

              if (demandeType) {
                localStorage.setItem('openDemandeType', demandeType);
                setTimeout(() => router.push("/dashboard?openModal=true"), 500);
              } else {
                router.push("/dashboard");
              }
            } else {
              router.push("/dashboard");
            }
          } else {
            // If auto-login fails, redirect to login page
            setTimeout(() => router.push("/login"), 1000);
          }
        } catch (loginError) {
          console.error("Erreur lors de la connexion automatique:", loginError);
          setTimeout(() => router.push("/login"), 1000);
        }
      } else {
        const errorMsg = data.message || "Erreur lors de l'inscription. Veuillez réessayer.";
        setErrorMessage(errorMsg);
        showToastMessage(errorMsg, "error");

        setShakeAnimation(true);
        setTimeout(() => setShakeAnimation(false), 500);

        setPasscode([]);
        setConfirmPasscode([]);
        setCurrentPhase(PHASE.PASSCODE_CREATION);
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      const errorMsg = "Une erreur est survenue. Veuillez réessayer.";
      setErrorMessage(errorMsg);
      showToastMessage(errorMsg, "error");

      setShakeAnimation(true);
      setTimeout(() => setShakeAnimation(false), 500);

      setPasscode([]);
      setConfirmPasscode([]);
      setCurrentPhase(PHASE.PASSCODE_CREATION);
    }
  };

  // Render User Information Form
  const renderUserInfoForm = () => (
    <>
      <div>
        <Title title="Création de compte" />
        <p className="text-[14px] text-smallText font-medium text-center">
          Remplissez les informations ci-dessous pour créer votre compte maCIE.
        </p>
      </div>

      {/* Form */}
      <div className="pt-5 w-full">
        <form onSubmit={handleUserInfoSubmit}>
          <div className="space-y-4">
            {/* Nom et prénom sur la même ligne */}
            <div className="flex gap-3">
              <div className="w-1/2">
                <label htmlFor="lastname" className="font-bold text-base">
                  Nom(s) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  placeholder="Votre nom"
                  required
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className="w-full rounded-xl px-5 py-4 border-2 border-[#EDEDED] mt-2"
                />
              </div>

              <div className="w-1/2">
                <label htmlFor="firstname" className="font-bold text-base">
                  Prénom(s) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  placeholder="Votre prénom"
                  required
                  value={formData.firstname}
                  onChange={handleInputChange}
                  className="w-full rounded-xl px-5 py-4 border-2 border-[#EDEDED] mt-2"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="font-bold text-base">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="votre.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-xl px-5 py-4 border-2 border-[#EDEDED] mt-2"
              />
            </div>

            <div>
              <label htmlFor="confirmEmail" className="font-bold text-base">
                Confirmer Email
              </label>
              <input
                type="email"
                id="confirmEmail"
                name="confirmEmail"
                placeholder="Confirmez votre email"
                value={formData.confirmEmail}
                onChange={handleInputChange}
                className={`w-full rounded-xl px-5 py-4 border-2 ${formData.email && formData.confirmEmail && formData.email !== formData.confirmEmail
                  ? "border-red-500"
                  : "border-[#EDEDED]"
                  } mt-2`}
              />
              {formData.email && formData.confirmEmail && formData.email !== formData.confirmEmail && (
                <p className="text-red-500 text-sm mt-1">Les adresses email ne correspondent pas</p>
              )}
            </div>

            <div className="flex gap-2">
              <div className="w-2/5 relative">
                <label htmlFor="contactPrefix" className="font-bold text-base">
                  Préfixe <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-2">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between rounded-xl px-4 py-4 border-2 border-[#EDEDED] bg-white text-left focus:outline-none focus:border-primary transition-colors"
                    onClick={() => setPrefixDropdownOpen(!prefixDropdownOpen)}
                  >
                    <span className="font-medium">{selectedPrefix.code}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform ${prefixDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {prefixDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-56 overflow-auto">
                      {COUNTRY_PREFIXES.map((prefix) => (
                        <button
                          key={prefix.code}
                          type="button"
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                          onClick={() => handlePrefixChange(prefix)}
                        >
                          <span className="font-medium">{prefix.code}</span>
                          <span className="text-sm text-gray-500">
                            {prefix.country}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="w-3/5">
                <label htmlFor="contact" className="font-bold text-base">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="contact"
                  name="contact"
                  placeholder="0700000000"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full rounded-xl px-5 py-4 border-2 border-[#EDEDED] mt-2"
                />
              </div>
            </div>
          </div>

          <div className="pt-7">
            <button
              type="submit"
              className="w-full rounded-full bg-primary text-white font-semibold py-4 hover:bg-primary/90 transition-colors"
              disabled={!formData.lastname || !formData.firstname || (!formData.email && !formData.contact)}
            >
              Continuer
            </button>
          </div>
        </form>
      </div>

      {/* Separator */}
      <div className="flex items-center my-5 px-10 pt-3">
        <div className="flex-grow border-t border-smallText"></div>
        <span className="px-3 text-sm text-smallText">
          ou continuer avec
        </span>
        <div className="flex-grow border-t border-smallText"></div>
      </div>

      {/* Social signup */}
      <div className="flex gap-5 items-center justify-center">
        <button className="flex items-center justify-center rounded-lg py-3 px-7 bg-[#F5F5F5] hover:bg-gray-200">
          <IconGoogle />
        </button>
        <button className="flex items-center justify-center rounded-lg py-3 px-7 bg-[#F5F5F5] hover:bg-gray-200">
          <IconFacebook />
        </button>
      </div>

      {/* Already have an account */}
      <div className="w-full pt-10">
        <p className="text-sm text-smallText text-center">
          J&apos;ai déjà un compte ?
        </p>
        <div className="pt-3">
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

  // Render OTP Verification Form
  const renderOtpVerification = () => (
    <>
      <div>
        <Title title="Vérification OTP" />
        <p className="text-[14px] font-medium text-center">
          Entrez le code OTP qui vous a été envoyé à{" "}
          <span className="font-bold">
            {formData.contact}
          </span>
        </p>
      </div>

      {/* OTP Input */}
      <div className={`pt-10 w-full flex justify-center ${isMobile ? "px-5" : ""}`}>
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
                  !/[0-9]/.test(e.key) &&
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

      {/* Countdown */}
      <div className="pt-10 flex justify-center w-full">
        <CountdownTimer />
      </div>

      {/* Back button */}
      <div className="flex justify-center pt-10">
        <button
          className="flex items-center gap-2"
          onClick={() => setCurrentPhase(PHASE.USER_INFO)}
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
            Retour
          </p>
        </button>
      </div>
    </>
  );

  // Render Passcode Creation/Confirmation
  const renderPasscodePhase = () => (
    <>
      <div className="flex flex-col justify-center w-full items-center">
        <Title title="Sécurisation du compte" />
        <Image src="/profile.png" alt="profile" width={139} height={50} />
      </div>

      <div className="w-full flex flex-col justify-center items-center mt-8">
        {/* Title */}
        <p className="text-center text-base font-semibold mb-4">
          {currentPhase === PHASE.PASSCODE_CREATION
            ? "Sécurisez votre compte en définissant votre code confidentiel"
            : "Confirmez votre code confidentiel"}
        </p>

        {/* PIN indicators */}
        <div className={`flex gap-2 mb-3 ${shakeAnimation ? "animate-shake" : ""}`}>
          {Array.from({ length: PIN_LENGTH }).map((_, index) => (
            <span
              key={index}
              className={`h-6 w-6 rounded-full ${index < (currentPhase === PHASE.PASSCODE_CREATION ? passcode.length : confirmPasscode.length)
                ? "bg-primary"
                : "bg-[#F1F1F1]"
                }`}
            ></span>
          ))}
        </div>

        {/* Error message */}
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

        {/* Numeric keypad */}
        <div className={`grid grid-cols-3 ${isMobile ? "gap-2" : "gap-8"}`}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigitClick(digit.toString())}
              className={`h-20 w-28 text-4xl font-bold flex items-center justify-center border-2 border-gray-100 rounded-xl hover:bg-gray-100 ${bebas_beue.className}`}
              style={{
                gridColumn: digit === 0 ? "2" : "auto",
              }}
            >
              {digit}
            </button>
          ))}

          {/* Delete button */}
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
      </div>
    </>
  );

  // Render current phase content
  const renderPhaseContent = () => {
    switch (currentPhase) {
      case PHASE.USER_INFO:
        return renderUserInfoForm();
      case PHASE.OTP_VERIFICATION:
        return renderOtpVerification();
      case PHASE.PASSCODE_CREATION:
      case PHASE.PASSCODE_CONFIRMATION:
        return renderPasscodePhase();
      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      <>
        {/* Styles for custom animations */}
        <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
          }

          @keyframes fade-in {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .animate-shake {
            animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
          }

          .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
          }
        `}</style>

        <div className={`flex items-center justify-center ${isMobile ? "pt-10 px-3" : ""}`}>
          <div className="w-full max-w-md">
            {/* Current phase content */}
            {renderPhaseContent()}
          </div>
        </div>

        {/* Toast notification */}
        <div
          className={`fixed top-4 right-4 max-w-xs w-full bg-white shadow-md rounded-lg p-4 flex items-center gap-3 transform transition-all duration-300 z-[2000] ${showToast ? "translate-y-0 opacity-100" : "translate-y-[-20px] opacity-0"
            }`}
        >
          <div className={`${toastType === "error" ? "bg-red-500" : "bg-green-500"} p-2 rounded-full`}>
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

export default Register;
