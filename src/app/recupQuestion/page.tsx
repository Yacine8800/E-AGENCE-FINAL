"use client";

import React from "react";
// import { useRouter } from "next/navigation";
import { AuthLayout } from "../authLayout";
import { useResponsive } from "@/src/hooks/useResponsive";
import Title from "../components/title";
import { useRouter } from "next/navigation";

const Page = () => {
  const { isMobile } = useResponsive();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/recupOTP");
  };

  return (
    <AuthLayout>
      <>
        <div
          className={`flex items-center justify-center ${
            isMobile ? "flex-col" : ""
          }`}
        >
          <div className="w-full max-w-xl px-5">
            {/* title */}
            <div>
              <Title title="récupération de compte" />
              <p className="text-[14px] text-smallText font-medium text-center">
                Veuillez complèter le formulaire suivant pour recupérer votre
                compte
              </p>
            </div>
            {/* Formulaire */}
            <div className="pt-5 w-full">
              <form onSubmit={handleSubmit}>
                <div className="pt-7">
                  <label htmlFor="name" className="font-semibold text-base">
                    Compléter votre nom Y***
                  </label>
                  <input
                    type="text"
                    placeholder="Y"
                    required
                    className="w-full font-semibold rounded-xl px-5 py-5 border-2 border-[#EDEDED] mt-2"
                  />
                </div>
                <div className="pt-7">
                  <label htmlFor="response" className="font-semibold text-base">
                    Compléter votre prénom L*****
                  </label>
                  <input
                    type="text"
                    placeholder="L"
                    required
                    className="w-full font-semibold rounded-xl px-5 py-5 border-2 border-[#EDEDED] mt-2"
                  />
                </div>
                <div className="pt-7">
                  <label htmlFor="response" className="font-semibold text-base">
                    Quel est votre plat préféré ?
                  </label>
                  <input
                    type="text"
                    placeholder="Votre réponse"
                    required
                    className="w-full font-semibold rounded-xl px-5 py-5 border-2 border-[#EDEDED] mt-2"
                  />
                </div>
                <div className="pt-7">
                  <button className="w-full rounded-full bg-primary text-white font-semibold py-4">
                    Continuer
                  </button>
                </div>
              </form>
            </div>

            {/* retour à la connexion button */}
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
      </>
    </AuthLayout>
  );
};

export default Page;
