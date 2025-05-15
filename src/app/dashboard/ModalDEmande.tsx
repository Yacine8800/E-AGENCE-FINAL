"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Stepper from "./stepper";
import {
  DEMANDES,
  TYPE_CATEGORIES,
  getDemandesByCategory,
  getDemandeLabel,
  DemandeType,
  DemandeCategory
} from "../constants/demandes";

const ModalDEmande = ({ onClose }: { onClose: () => void }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<DemandeCategory>(
    (localStorage.getItem("selectedCategoryId") as DemandeCategory) || TYPE_CATEGORIES[0].id as DemandeCategory
  );

  useEffect(() => {
    localStorage.setItem("selectedCategoryId", selectedCategoryId);
  }, [selectedCategoryId]);

  const [selectedDemande, setSelectedDemande] = useState<DemandeType | null>(null);

  // On récupère les demandes pour la catégorie sélectionnée
  const demandesForCurrentCategory = getDemandesByCategory(selectedCategoryId);

  // Dispatch custom event to notify that modal has opened
  useEffect(() => {
    // Dispatch modal opened event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('modal-opened'));
    }

    return () => {
      // Dispatch modal closed event when component unmounts
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('modal-closed'));
      }
    };
  }, []);

  // Effet pour vérifier s'il y a une demande à ouvrir automatiquement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const openDemandeType = localStorage.getItem('openDemandeType') as DemandeType | null;
      if (openDemandeType) {
        console.log("Demande à ouvrir automatiquement:", openDemandeType);

        // Chercher la demande dans notre structure DEMANDES
        const demandeToOpen = Object.values(DEMANDES).find(d => d.id === openDemandeType && !d.disabled);

        if (demandeToOpen) {
          // Trouver la catégorie appropriée
          if (demandeToOpen.category.length > 0) {
            setSelectedCategoryId(demandeToOpen.category[0]);
          }

          // Définir la demande sélectionnée
          setSelectedDemande(demandeToOpen.id);

          // Signaler que la demande a été traitée avec succès
          console.log("Demande ouverte avec succès dans ModalDEmande");

          // Supprimer la demande du localStorage
          setTimeout(() => {
            localStorage.removeItem('openDemandeType');
            console.log("openDemandeType supprimé du localStorage");
          }, 2000);
        } else {
          console.warn(`Le type de demande "${openDemandeType}" n'est pas valide ou est désactivé`);
          localStorage.removeItem('openDemandeType');
        }
      }
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[999] flex justify-end">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={() => {
          onClose();
          // Dispatch modal-closed event when backdrop is clicked
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('modal-closed'));
          }
          setSelectedCategoryId(TYPE_CATEGORIES[0].id as DemandeCategory);
          setSelectedDemande(null);
        }}
      ></div>

      <div className="relative w-full md:w-[600px] bg-[#F8F9F9] h-full shadow-2xl overflow-auto flex flex-col rounded-l-2xl transition-all duration-500">
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b">

          {selectedDemande === null ? "" : <button
            onClick={() => {
              if (selectedDemande) {
                setSelectedDemande(null);
              } else {
                setSelectedCategoryId(TYPE_CATEGORIES[0].id as DemandeCategory);
              }
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg
              width="22"
              height="20"
              viewBox="0 0 22 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.2864 18.5635L1.72388 10.001L10.2864 1.43848M2.91311 10.001H20.276"
                stroke="#EC4F48"
                strokeWidth="2.69"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>}

          <h2 className="text-lg md:text-xl font-semibold text-gray-800 text-center flex-1">
            {selectedDemande
              ? getDemandeLabel(selectedDemande)
              : "Demandes"}
          </h2>
          {/* Bouton de fermeture */}
          <button
            type="button"
            onClick={(e) => {
              onClose();
              // Dispatch modal-closed event when the close button is clicked
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('modal-closed'));
              }
              if (selectedDemande) {
                setSelectedDemande(null);
              } else {
                setSelectedCategoryId(TYPE_CATEGORIES[0].id as DemandeCategory);
              }
            }}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full shadow-md cursor-pointer pointer-events-auto"
            style={{
              backgroundColor: "#F3F4F6",
              color: "#4B5563",
              border: "none",
              outline: "none",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* SECTION : Sélection du type de demande */}
        {!selectedDemande && (
          <>
            <div className="bg-[#F7F7F7] w-full flex flex-col gap-4 px-4 md:px-6 py-4 md:py-6 rounded-t-lg mb-4">
              <p className="font-semibold text-gray-700 text-sm md:text-base">
                Je souhaite faire une demande pour :
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-3 w-full">
                {TYPE_CATEGORIES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedCategoryId(type.id as DemandeCategory)}
                    className={`flex-1 h-[70px] rounded-lg font-bold text-base transition-all duration-300 shadow-sm
                      ${selectedCategoryId === type.id
                        ? "bg-red-500 text-white scale-105 shadow-md"
                        : "bg-white text-gray-800 hover:bg-gray-200"
                      }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SECTION : Choix du type de demande */}
            {!selectedDemande && (
              <div className="flex flex-col gap-4 px-4 md:px-6 py-6 md:py-8">
                <p className="font-semibold text-gray-800 text-sm md:text-base">
                  Choisissez le type de demande souhaité :
                </p>
                <div className="grid grid-cols-2 gap-6 w-full items-center">
                  {demandesForCurrentCategory.map(
                    (demande, index, array) => (
                      <button
                        key={demande.id}
                        onClick={() => !demande.disabled && setSelectedDemande(demande.id)}
                        className={`bg-white h-[115px] rounded-xl shadow-md flex flex-col items-center justify-center p-5 gap-3 
                        transition-all duration-300 hover:shadow-lg ${!demande.disabled ? "hover:scale-105" : "cursor-not-allowed opacity-50"}
                        ${selectedDemande === demande.id ? "border-2 border-red-500 scale-105" : "border border-transparent"}
                        ${index === array.length - 1 && array.length % 2 !== 0 ? "col-span-2 mx-auto" : ""}
                        `}
                      >
                        <Image
                          src={demande.src}
                          alt={demande.label}
                          width={demande.width}
                          height={demande.height}
                          className={`object-contain ${demande.disabled ? "opacity-60" : ""}`}
                        />
                        <span className={`font-medium text-center text-[14px] ${demande.disabled ? "text-gray-400" : "text-gray-700"}`}>
                          {demande.label}
                          {demande.disabled && <div className="text-xs italic mt-1">Bientôt disponible</div>}
                        </span>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* STEPPER : S'affiche uniquement si une demande est sélectionnée */}
        {selectedDemande && (
          <Stepper
            type={selectedDemande}
            closeModal={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default ModalDEmande;
