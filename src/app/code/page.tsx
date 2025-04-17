"use client";

import React from "react";
// import { useRouter } from "next/navigation";
import { AuthLayout } from "../authLayout";
import { useResponsive } from "@/src/hooks/useResponsive";
import Title from "../components/title";

const Page = () => {
  const { isMobile } = useResponsive();

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
              <Title title="Connexion" />
              <p className="text-[14px] font-medium text-center">
                Nous avons détecter un compte correspondant à l’adresse{" "}
                <span className="font-bold">landryyamb@gmail.com</span>
              </p>
            </div>
            {/* Formulaire */}
            <div className="pt-5 w-full">
              <form
              //   onSubmit={handleSubmit}
              >
                <div>
                  <label htmlFor="email" className="font-bold text-base">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full rounded-xl px-5 py-5 border-2 border-[#EDEDED] mt-2"
                  />
                </div>
                <div className="pt-7">
                  <button className="w-full rounded-full bg-primary text-white font-semibold py-4">
                    Définir mon code confidentiel
                  </button>
                </div>
              </form>
            </div>

            {/* retour à la connexion button */}

            <div className="flex justify-center pt-10">
              <button className="flex items-center gap-2">
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
      </>
    </AuthLayout>
  );
};

export default Page;
