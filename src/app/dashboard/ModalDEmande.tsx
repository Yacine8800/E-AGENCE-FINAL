"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Stepper from "./stepper";
import DemandeGrid from "./demandes/DemandeGrid";
import {
  DEMANDES,
  TYPE_CATEGORIES,
  getDemandesByCategory,
  getDemandeLabel,
  DemandeType,
  DemandeCategory
} from "../constants/demandes";

// Styles CSS pour l'effet de retournement
const flipStyles = `
  .flip-container {
    perspective: 1200px;
  }
  
  .flipper {
    transition: transform 0.8s;
    transform-style: preserve-3d;
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .flip-active .flipper {
    transform: rotateY(180deg);
  }
  
  .front, .back {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .front {
    z-index: 2;
    transform: rotateY(0deg);
  }
  
  .back {
    transform: rotateY(180deg);
  }
  
  .expanding {
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1) !important;
  }
`;

const ModalDEmande = ({ onClose }: { onClose: () => void }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<DemandeCategory>(
    (localStorage.getItem("selectedCategoryId") as DemandeCategory) || TYPE_CATEGORIES[0].id as DemandeCategory
  );

  useEffect(() => {
    localStorage.setItem("selectedCategoryId", selectedCategoryId);
  }, [selectedCategoryId]);

  const [selectedDemande, setSelectedDemande] = useState<DemandeType | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipPosition, setFlipPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [flipCardInfo, setFlipCardInfo] = useState<{ title: string, icon: string } | null>(null);
  const [flipActive, setFlipActive] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const flipperRef = useRef<HTMLDivElement>(null);

  // On récupère les demandes pour la catégorie sélectionnée
  const demandesForCurrentCategory = getDemandesByCategory(selectedCategoryId);

  // Fonction pour gérer la sélection de demande avec effet de retournement
  const handleSelectDemande = (type: DemandeType, cardRect: DOMRect, title: string, icon: string) => {
    // Sauvegarde des infos de la carte pour l'animation
    setFlipCardInfo({ title, icon });

    // Obtenons la position du conteneur modal
    if (!modalRef.current) return;

    const modalRect = modalRef.current.getBoundingClientRect();

    // Calcul de la position relative de la carte par rapport au modal
    const relativeTop = cardRect.top - modalRect.top;
    const relativeLeft = cardRect.left - modalRect.left;

    // Définir la position initiale pour l'animation de flip
    setFlipPosition({
      top: relativeTop,
      left: relativeLeft,
      width: cardRect.width,
      height: cardRect.height
    });

    // Calculer la position centrale pour l'expansion
    const centerX = window.innerWidth / 2 - cardRect.width / 2;
    const centerY = window.innerHeight / 2 - cardRect.height / 2 - 80; // Ajustement pour le header

    // Démarrer l'animation de flip
    setIsFlipping(true);

    // Déclencher le flip après un court délai
    setTimeout(() => {
      setFlipActive(true);

      // Après le flip, commencer l'expansion
      setTimeout(() => {
        setExpanding(true);

        // Une fois l'expansion terminée, montrer le formulaire
        setTimeout(() => {
          setSelectedDemande(type);
          setIsFlipping(false);
          setFlipActive(false);
          setExpanding(false);
          setFlipCardInfo(null);
        }, 600);
      }, 800);
    }, 100);
  };

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
      {/* Styles CSS pour l'effet de flip */}
      <style jsx global>{flipStyles}</style>

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => {
          onClose();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('modal-closed'));
          }
          setSelectedCategoryId(TYPE_CATEGORIES[0].id as DemandeCategory);
          setSelectedDemande(null);
        }}
      ></div>

      <div
        ref={modalRef}
        className="relative w-full md:w-[550px] bg-white h-full shadow-xl overflow-auto flex flex-col transition-all duration-500 rounded-l-[24px]"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          {selectedDemande === null ? "" : <button
            onClick={() => {
              if (selectedDemande) {
                setSelectedDemande(null);
              } else {
                setSelectedCategoryId(TYPE_CATEGORIES[0].id as DemandeCategory);
              }
            }}
            className="text-gray-500 hover:text-gray-700"
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

          <h2 className="text-2xl font-bold text-gray-800 text-center flex-1">
            {selectedDemande
              ? getDemandeLabel(selectedDemande)
              : "Mes Demandes"}
          </h2>

          <button
            type="button"
            onClick={(e) => {
              onClose();
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('modal-closed'));
              }
              if (selectedDemande) {
                setSelectedDemande(null);
              } else {
                setSelectedCategoryId(TYPE_CATEGORIES[0].id as DemandeCategory);
              }
            }}
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
          >
            <svg
              width="20"
              height="20"
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

        {/* Div pour l'animation de flip */}
        {isFlipping && flipCardInfo && (
          <div
            className={`absolute z-30 flip-container ${flipActive ? 'flip-active' : ''} ${expanding ? 'expanding' : ''}`}
            style={{
              top: expanding ? '80px' : `${flipPosition.top}px`,
              left: expanding ? '0' : `${flipPosition.left}px`,
              width: expanding ? '100%' : `${flipPosition.width}px`,
              height: expanding ? 'calc(100% - 80px)' : `${flipPosition.height}px`,
              borderRadius: expanding ? '0' : '16px',
              overflow: 'hidden',
              transition: expanding ? 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
              transformOrigin: 'center center',
              boxShadow: expanding ? 'none' : '0px 2px 10px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="flipper" ref={flipperRef}>
              {/* Face avant (visible au départ) */}
              <div className="front bg-white border border-gray-100 rounded-[16px]">
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <div className="w-16 h-16 relative mb-3 flex items-center justify-center">
                    <Image src={flipCardInfo.icon} alt="" layout="fill" objectFit="contain" />
                  </div>
                  <h3 className="font-medium text-gray-800 text-center">{flipCardInfo.title}</h3>
                </div>
              </div>

              {/* Face arrière (formulaire) */}
              <div className="back bg-white">
                {expanding ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="animate-pulse w-10 h-10 relative mb-4">
                        <Image src={flipCardInfo.icon} alt="" layout="fill" objectFit="contain" className="opacity-50" />
                      </div>
                      <div className="animate-pulse text-red-500 font-medium">
                        Chargement du formulaire...
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full mb-2"></div>
                    <p className="text-sm text-gray-500">Préparation...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION : Sélection du type de demande */}
        {!selectedDemande && (
          <>
            <div className={`bg-white w-full px-6 py-3 ${isFlipping ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
              <div className="flex items-center mb-1">
                <div className="w-4 h-4 relative mr-2 flex items-center justify-center bg-red-100 rounded-full flex-shrink-0">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5v14M5 12h14" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex items-center">
                  <h3 className="text-sm font-semibold text-gray-800">Demandes</h3>
                </div>
              </div>
              <p className="text-gray-500 text-xs mb-3 ml-6">
                Les demandes sont des requêtes de service que vous soumettez pour vos besoins en électricité.
              </p>

              <p className="font-medium text-gray-900 text-xs mb-2">
                Je souhaite faire une demande pour :
              </p>
              <div className="flex flex-col md:flex-row gap-2 w-full mb-4">
                {TYPE_CATEGORIES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedCategoryId(type.id as DemandeCategory)}
                    className={`flex-1 px-2 py-2 min-h-[50px] rounded-lg font-medium text-xs transition-all duration-300 flex items-center justify-center text-center
                      ${selectedCategoryId === type.id
                        ? "bg-red-500 text-white shadow-md"
                        : "bg-white text-gray-800 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                      } border ${selectedCategoryId === type.id ? "border-red-500" : "border-gray-200"}`}
                    style={{
                      boxShadow: selectedCategoryId === type.id
                        ? "0px 4px 10px rgba(236, 79, 72, 0.15)"
                        : "0px 2px 5px rgba(0, 0, 0, 0.05)"
                    }}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Utilisation du nouveau composant DemandeGrid pour afficher les demandes */}
            <div className={`px-6 pt-2 pb-12 ${isFlipping ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                {selectedCategoryId === "particulier-domicile" ? "Demandes pour particuliers" :
                  selectedCategoryId === "particulier-professionnel" ? "Demandes pour professionnels" :
                    "Demandes pour entreprises"}
              </h3>
              <DemandeGrid
                onSelect={(type, cardRect, title, icon) => handleSelectDemande(type, cardRect, title, icon)}
                selectedDemande={selectedDemande}
              />
            </div>
          </>
        )}

        {/* STEPPER : S'affiche uniquement si une demande est sélectionnée */}
        {selectedDemande && !isFlipping && (
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
