"use client";
import { useResponsive } from "@/src/hooks/useResponsive";
import { bebas_beue } from "@/utils/globalFunction";
import { useRouter } from "next/navigation";
import React from "react";

export default function SucessModale() {
  const { isMobile } = useResponsive();
  const router = useRouter();

  return (
    <div className="w-full p-10 fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white p-6 rounded-xl max-w-xl shadow-lg text-center">
        <div className="flex flex-col justify-center items-center">
          <div className="w-28 h-28 bg-[#4CAF50] rounded-full flex items-center justify-center relative z-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <div className="pt-8">
            {/* Titre */}
            <h2
              className={`text-[35px] text-center font-semibold ${
                bebas_beue.className
              } ${isMobile ? "text-[30px]" : ""}`}
            >
              votre compte est prêt
            </h2>

            {/* Texte d'information */}
            <p className="text-sm text-gray-600 mt-2">
              Vous pouvez maintenant vous connecter avec vos identifiants.
            </p>
          </div>

          {/* Bouton de connexion */}
          <button
            className="w-full rounded-full font-semibold mt-6 py-3 bg-red-500 text-white"
            onClick={() => router.push("/")}
          >
            Aller à la connexion
          </button>
        </div>
      </div>
    </div>
  );
}
