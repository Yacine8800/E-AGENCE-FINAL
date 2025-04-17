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
    router.push("/defineCode");
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
              <Title title="Question secrète" />
              <p className="text-[14px] text-smallText font-medium text-center">
                Choisissez une question et une réponse pour protéger votre
                compte.
              </p>
            </div>
            {/* Formulaire */}
            <div className="pt-5 w-full">
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="question" className="font-semibold text-base">
                    Sélectionnez une question secrète
                  </label>
                  <select
                    id="question"
                    name="question"
                    required
                    defaultValue="" 
                    className="w-full font-semibold rounded-xl px-3 py-5 border-2 border-[#EDEDED] mt-2 bg-white"
                  >
                    <option value="" disabled>
                      Choisissez une question
                    </option>
                    <option value="nom_mère">
                      Quel est le nom de votre mère ?
                    </option>
                    <option value="premier_animal">
                      Quel était votre premier animal de compagnie ?
                    </option>
                    <option value="ville_naissance">
                      Dans quelle ville êtes-vous né(e) ?
                    </option>
                    <option value="film_prefere">
                      Quel est votre film préféré ?
                    </option>
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
