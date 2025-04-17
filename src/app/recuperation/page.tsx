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
    router.push("/recupQuestion");
  };

  return (
    <AuthLayout>
      <>
        <div
          className={`flex items-center justify-center ${
            isMobile ? "pt-10 px-3" : ""
          }`}
        >
          <div className="w-full max-w-md">
            {/* title */}
            <div>
              <Title title="Récupération de compte" />
              <p className="text-[14px] text-smallText font-medium text-center">
                Pour récupérer votre compte veuillez entrer votre numéro de
                téléphone
              </p>
            </div>
            {/* Formulaire */}
            <div className="pt-5 w-full">
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="tel" className="font-bold text-base">
                    N° de téléphone
                  </label>
                  <input
                    type="text"
                    placeholder="Téléphone"
                    required
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
          </div>
        </div>
      </>
    </AuthLayout>
  );
};

export default Page;
