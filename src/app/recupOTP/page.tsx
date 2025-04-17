"use client";

import React, { useState } from "react";
import { AuthLayout } from "../authLayout";
import { useResponsive } from "@/src/hooks/useResponsive";
import Title from "../components/title";
import OtpInput from "react-otp-input";
import CountdownTimer from "../components/countdownTimer";
import { useRouter } from "next/navigation";
import SucessModale from "../components/modales/sucessModale";

const Page = () => {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [code, setCode] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (newCode: string) => {
    // Vérifier que l'entrée ne contient que des chiffres et qu'on ne dépasse pas la limite
    if (/^\d*$/.test(newCode) && newCode.length <= 4) {
      setCode(newCode);
    }

    if (newCode.length == 4) {
      setShowSuccessModal(true);
    }
  };

  return (
    <AuthLayout>
      <div
        className={`flex items-center justify-center ${
          isMobile ? "flex-col pt-10 px-5" : ""
        }`}
      >
        <div className="w-full max-w-md">
          {/* Title */}
          <div>
            <Title title="Vérification OTP" />
            <p className="text-[14px] font-medium text-center">
              Entrez le code à OTP qui vous a été envoyé au
              <span className="font-bold"> 225 0101020105</span>
            </p>
          </div>

          {/* Input OTP */}
          <div
            className={`pt-10 w-full flex justify-center ${
              isMobile ? "px-5" : ""
            }`}
          >
            <OtpInput
              value={code}
              onChange={handleChange}
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

          {/* Bouton retour */}
          <div className="flex justify-center pt-10">
            <button
              className="flex items-center gap-2"
              onClick={() => router.push("/register")}
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
                Retour à la création de compte
              </p>
            </button>
          </div>
        </div>
      </div>

      {showSuccessModal && <SucessModale />}
    </AuthLayout>
  );
};

export default Page;
