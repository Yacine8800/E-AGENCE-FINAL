"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Stepper from "./stepper";

const typesDeDemandeParType = {
  "particulier-domicile": [
    {
      id: "branchement",
      src: "/demande/branchement.png",
      label: "Branchement d'abonnement",
      width: 30,
      height: 30,
      disabled: true // Désactivé car la vue n'est pas disponible
    },
    // {
    //   id: "abonnement",
    //   src: "/demande/abonnement.png",
    //   label: "Abonnement simple",
    //   width: 50,
    //   height: 50,
    // },
    {
      id: "mutation",
      src: "/demande/mutation.png",
      label: "Mutation",
      width: 50,
      height: 50,
    },

    {
      id: "puissance",
      src: "/demande/puissance.png",
      label: "Augmentation de puissance",
      width: 50,
      height: 50,
      disabled: true // Désactivé car la vue n'est pas disponible
    },
    {
      id: "reabonnement",
      src: "/demande/reabon.png",
      label: "Réabonnement",
      width: 50,
      height: 50,
    },
    // {
    //   id: "inscription",
    //   src: "/demande/inscription.png",
    //   label: "Nouvelle Inscription",
    //   width: 50,
    //   height: 50,
    // },
    // {
    //   id: "newAbonnement",
    //   src: "/demande/newAbonnement.png",
    //   label: "Renouvellement d'abonnement",
    //   width: 50,
    //   height: 50,
    // },
  ],
  // "particulier-professionnel": [
  //   {
  //     id: "installation",
  //     src: "/compteur/compteur1.png",
  //     label: "Installation compteur",
  //     width: 60,
  //     height: 60,
  //   },
  //   {
  //     id: "puissance",
  //     src: "/demande/puissance.png",
  //     label: "Changement de puissance",
  //     width: 60,
  //     height: 60,
  //   },
  //   {
  //     id: "mutation",
  //     src: "/demande/mutation.png",
  //     label: "Transfert de contrat",
  //     width: 60,
  //     height: 60,
  //   },
  //   {
  //     id: "reabonnement",
  //     src: "/demande/reabon.png",
  //     label: "Renouvellement abonnement",
  //     width: 60,
  //     height: 60,
  //   },
  // ],
  // entreprise: [
  //   {
  //     id: "raccordement",
  //     src: "/telephone/phoneNoir.png",
  //     label: "Étude de raccordement",
  //     width: 60,
  //     height: 60,
  //   },
  //   {
  //     id: "extension",
  //     src: "/ampoule.png",
  //     label: "Extension réseau",
  //     width: 60,
  //     height: 60,
  //   },
  //   {
  //     id: "tarif",
  //     src: "/profile.png",
  //     label: "Changement tarifaire",
  //     width: 60,
  //     height: 60,
  //   },
  //   {
  //     id: "connexion",
  //     src: "/main.png",
  //     label: "Nouvelle connexion",
  //     width: 60,
  //     height: 60,
  //   },
  // ],
};

const typesDeSelection = [
  { id: "particulier-domicile", label: "Particulier domicile" },
  { id: "particulier-professionnel", label: "Particulier professionnel" },
  { id: "entreprise", label: "Entreprise" },
];

const ModalDEmande = ({ onClose }: { onClose: () => void }) => {
  const [selectedTypeId, setSelectedTypeId] = useState<string>(
    localStorage.getItem("selectedTypeId") || typesDeSelection[0].id
  );

  useEffect(() => {
    localStorage.setItem("selectedTypeId", selectedTypeId);
  }, [selectedTypeId]);

  const [selectedDemande, setSelectedDemande] = useState<string | null>(null);

  // Effet pour vérifier s'il y a une demande à ouvrir automatiquement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const openDemandeType = localStorage.getItem('openDemandeType');
      if (openDemandeType) {
        console.log("Demande à ouvrir automatiquement:", openDemandeType);

        // Vérifier si le type de demande existe dans les options disponibles
        const isValidType = Object.values(typesDeDemandeParType)
          .some(demandes => demandes.some(demande => demande.id === openDemandeType && !demande.disabled));

        if (isValidType) {
          // Trouver le bon type de profil qui contient cette demande
          for (const [typeId, demandes] of Object.entries(typesDeDemandeParType)) {
            if (demandes.some(demande => demande.id === openDemandeType && !demande.disabled)) {
              setSelectedTypeId(typeId);
              break;
            }
          }

          // Définir la demande sélectionnée
          setSelectedDemande(openDemandeType);

          // Signaler que la demande a été traitée avec succès
          console.log("Demande ouverte avec succès dans ModalDEmande");

          // Supprimer la demande du localStorage pour éviter de l'ouvrir à nouveau
          // mais avec un délai pour être sûr que tout est bien configuré
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

  console.log(selectedDemande, "selectedDemande")

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={() => {
          onClose();
          setSelectedTypeId(typesDeSelection[0].id);
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
                setSelectedTypeId(typesDeSelection[0].id);
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
              ? typesDeDemandeParType[
                selectedTypeId! as keyof typeof typesDeDemandeParType
              ]?.find((d) => d.id === selectedDemande)?.label
              : "Demandes"}
          </h2>
          {/* Bouton de fermeture */}
          <button
            type="button"
            onClick={(e) => {
              onClose();
              if (selectedDemande) {
                setSelectedDemande(null);
              } else {
                setSelectedTypeId(typesDeSelection[0].id);
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
                {typesDeSelection.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedTypeId(type.id)}
                    className={`flex-1 h-[70px] rounded-lg font-bold text-base transition-all duration-300 shadow-sm
                      ${selectedTypeId === type.id
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
            {selectedTypeId && (
              <div className="flex flex-col gap-4 px-4 md:px-6 py-6 md:py-8">
                <p className="font-semibold text-gray-800 text-sm md:text-base">
                  Choisissez le type de demande souhaité :
                </p>
                <div className="grid grid-cols-2 gap-6 w-full items-center">
                  {typesDeDemandeParType[selectedTypeId as keyof typeof typesDeDemandeParType]?.map(
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
            type={
              selectedDemande as "mutation" | "branchement" | "reabonnement"
            }
            closeModal={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default ModalDEmande;
