"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Sidebar from "../layout/sidebar";
import Navbar from "../layout/navbar";
import Image from "next/image";
import Modal from "../components/ui/Modal";
import RattacherCompteurForm from "../components/dashboard/RattacherCompteurForm";
import RattacherIdentifiantForm from "../components/dashboard/RattacherIdentifiantForm";
import { useAuth } from "@/src/hooks/useAuth";

import Factures from "../components/Facture/facture";
import ModalDEmande from "./ModalDEmande";
import { API_URL } from "../config/constants";
import { handleApiError } from "@/utils/apiErrorHandler";
import ConsumptionBarChart from "../components/barchat";
import LinkIcon from "@/src/components/icons/LinkIcon";
import PlusIcon from "@/src/components/icons/PlusIcon";



interface Client {
  _id: string;
  slug: string;
  onlineId: string | null;
  login: string;
  contact: string;
  email: string | null;
  firstname: string;
  lastname: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Compteur {
  _id: string;
  slug: string;
  type: string;
  level: number;
  identifiant: string;
  label: string;
  linkedAt: string | null;
  statutRattachement: string;
  locked: boolean;
  lockedAt: string | null;
  failedAttempts: number;
  status: string;
  client: Client;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id?: string; // Keep for backward compatibility
  isAlert?: boolean; // Keep for UI functionality
}

interface Identifiant {
  _id: string;
  slug: string;
  type: string;
  level: number;
  identifiant: string;
  label: string;
  linkedAt: string | null;
  statutRattachement: string;
  locked: boolean;
  lockedAt: string | null;
  failedAttempts: number;
  status: string;
  client: Client;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id?: string; // Keep for backward compatibility
  isAlert?: boolean; // Keep for UI functionality
}

// Level 2 Attachment Form Component
const Level2Form = ({
  onSubmit,
  onCancel,
  isLoading,
  itemType,
}: {
  onSubmit: (data: { index?: number; montant?: number }) => Promise<boolean>;
  onCancel: () => void;
  isLoading: boolean;
  itemType: "prepaid" | "postpaid";
}) => {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate value
    if (!value || isNaN(Number(value))) {
      setError(`Veuillez entrer ${itemType === "postpaid" ? "un index" : "un montant"} valide`);
      return;
    }

    // Structure data based on item type
    const data = itemType === "postpaid"
      ? { index: Number(value) }
      : { montant: Number(value) };

    const success = await onSubmit(data);
    if (success) {
      setValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 py-6">
      <div className="mb-4">
        <label htmlFor="value" className="block text-gray-700 font-medium mb-2">
          {itemType === "postpaid" ? "Index du compteur" : "Montant"}
        </label>
        <input
          type="number"
          id="value"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder={`Saisissez ${itemType === "postpaid" ? "votre index actuel" : "le montant"}`}
          required
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <p className="text-gray-500 text-sm mt-2">
          {itemType === "postpaid"
            ? "L'index se trouve sur votre compteur."
            : "Veuillez indiquer le montant à recharger."}
        </p>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2 bg-gradient-to-r from-[#FFA755] to-[#EC4F48] text-white rounded-lg hover:shadow-md disabled:opacity-70"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Traitement...
            </span>
          ) : (
            "Soumettre"
          )}
        </button>
      </div>
    </form>
  );
};

// MeterSection Component moved before Dashboard
const MeterSection = ({
  title,
  iconFill,
  items,
  emptyText,
  buttonText,
  onButtonClick,
  itemType,
  selectedItem,
  setSelectedItem,
  isLoading,
}: {
  title: string;
  iconFill: string;
  items: any[];
  emptyText: string;
  buttonText: string;
  onButtonClick: () => void;
  itemType: "prepaid" | "postpaid";
  selectedItem: {
    type: "prepaid" | "postpaid" | null;
    item: Compteur | Identifiant | null;
  };
  setSelectedItem: React.Dispatch<
    React.SetStateAction<{
      type: "prepaid" | "postpaid" | null;
      item: Compteur | Identifiant | null;
    }>
  >;
  isLoading: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxVisibleItems, setMaxVisibleItems] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayedItems, setDisplayedItems] = useState<any[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(false);

  // Déterminer dynamiquement combien d'éléments peuvent être affichés
  useEffect(() => {
    const calculateVisibleItems = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      // Estimation de l'espace occupé par chaque élément (élément + marges)
      const itemWidth = 70; // ~60px pour l'élément + ~10px pour les marges/gaps
      const addBtnWidth = 60; // Largeur approximative du bouton d'ajout
      const viewMoreWidth = 70; // Largeur approximative du bouton "voir plus"

      // Calcul du nombre d'éléments pouvant tenir avec bouton d'ajout + voir plus
      const availableWidth = containerWidth - addBtnWidth - viewMoreWidth;
      const canFit = Math.floor(availableWidth / itemWidth);

      // Détermine combien d'éléments afficher (max 2, min 1)
      // On limite à 2 éléments maximum pour éviter le décalage du bouton d'ajout
      const itemsCount = items.length;
      let visibleCount = Math.min(Math.max(canFit, 1), 2);

      // Si on peut tout afficher sans "voir plus", on montre tout
      if (itemsCount <= canFit + 1) {
        // +1 car le bouton d'ajout prend aussi de l'espace
        visibleCount = itemsCount;
      }

      setMaxVisibleItems(visibleCount);

      // Modifier la logique pour sélectionner les éléments à afficher
      let itemsToShow: any[] = [];
      const selectedItemId = selectedItem.item?._id || selectedItem.item?.id || selectedItem.item?.identifiant;
      const isCorrectType = selectedItem.type === itemType;

      // Si un élément est sélectionné et du bon type, assurer qu'il soit dans les éléments affichés
      if (selectedItemId && isCorrectType) {
        // Trouver l'élément sélectionné
        const selectedItemIndex = items.findIndex(item =>
          item._id === selectedItemId ||
          item.id === selectedItemId ||
          item.identifiant === selectedItemId
        );

        if (selectedItemIndex !== -1) {
          if (visibleCount === 1) {
            // Si on ne peut afficher qu'un seul élément, afficher l'élément sélectionné
            itemsToShow = [items[selectedItemIndex]];
          } else if (visibleCount >= items.length) {
            // Si on peut afficher tous les éléments
            itemsToShow = [...items];
          } else {
            // Essayer d'afficher l'élément sélectionné avec des éléments adjacents
            const startIndex = Math.max(0, Math.min(selectedItemIndex, items.length - visibleCount));
            itemsToShow = items.slice(startIndex, startIndex + visibleCount);
          }
        } else {
          // L'élément sélectionné n'est pas trouvé, afficher les premiers éléments
          itemsToShow = items.slice(0, visibleCount);
        }
      } else {
        // Aucun élément sélectionné ou pas du bon type, afficher les premiers éléments
        itemsToShow = items.slice(0, visibleCount);
      }

      setDisplayedItems(itemsToShow);
      setHasMoreItems(items.length > itemsToShow.length);
    };

    // Calcul initial
    calculateVisibleItems();

    // Recalculer quand la fenêtre change de taille ou quand l'élément sélectionné change
    const handleResize = () => {
      calculateVisibleItems();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [items, selectedItem, itemType]);

  const handleItemClick = (item: any) => {
    setSelectedItem({ type: itemType, item: item });
    setIsModalOpen(false);
  };

  const handleViewMoreClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg
            width="18"
            height="22"
            viewBox="0 0 14 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.333 2.33268H9.79967C9.63399 2.33268 9.49967 2.19837 9.49967 2.03268V0.966015C9.49967 0.80033 9.36536 0.666016 9.19967 0.666016H8.13301C7.96732 0.666016 7.83301 0.80033 7.83301 0.966015V2.03268C7.83301 2.19837 7.69869 2.33268 7.53301 2.33268H6.46634C6.30066 2.33268 6.16634 2.19837 6.16634 2.03268V0.966015C6.16634 0.80033 6.03203 0.666016 5.86634 0.666016H4.79967C4.63399 0.666016 4.49967 0.80033 4.49967 0.966015V2.03268C4.49967 2.19837 4.36536 2.33268 4.19967 2.33268H3.66634C1.82467 2.33268 0.333008 3.82435 0.333008 5.66601V13.9993C0.333008 15.841 1.82467 17.3327 3.66634 17.3327H10.333C12.1747 17.3327 13.6663 15.841 13.6663 13.9993V5.66601C13.6663 3.82435 12.1747 2.33268 10.333 2.33268ZM6.99967 13.9993C5.84967 13.9993 4.91634 13.0827 4.91634 11.9493C4.91634 11.041 5.5223 9.74975 6.99988 9.74975C8.47745 9.74975 9.08301 11.041 9.08301 11.9493C9.08301 13.0827 8.14967 13.9993 6.99967 13.9993ZM10.333 7.03268C10.333 7.19837 10.1987 7.33268 10.033 7.33268H3.96634C3.80066 7.33268 3.66634 7.19837 3.66634 7.03268V5.96601C3.66634 5.80033 3.80066 5.66601 3.96634 5.66601H10.033C10.1987 5.66601 10.333 5.80033 10.333 5.96601V7.03268Z"
              fill={iconFill}
            />
          </svg>
          <h2 className="text-lg font-medium truncate">
            {items.length > 0 ? `${title} (${items.length})` : title}
          </h2>
        </div>
      </div>

      <div className="w-full bg-[#F5F5F5] p-4 rounded-xl shadow-sm h-[159px] overflow-hidden transition-all duration-300">
        <div className="flex flex-col items-center h-full">
          {items.length === 0 ? (
            <div className="w-full h-full flex flex-col text-center justify-center items-center">
              <p className="text-base text-gray-500 font-semibold pb-1">
                {isLoading ? "Chargement..." : emptyText}
              </p>
              <button
                className="w-fit mt-2 flex px-[15px] flex-row gap-2 py-2 rounded-xl text-xs font-semibold justify-center items-center bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm hover:shadow"
                onClick={onButtonClick}
              >
                <svg width="14" height="14" viewBox="0 0 19 18" fill="#222928">
                  <path d="M8.5 17C8.5 17.2652 8.60536 17.5196 8.79289 17.7071C8.98043 17.8946 9.23478 18 9.5 18C9.76522 18 10.0196 17.8946 10.2071 17.7071C10.3946 17.5196 10.5 17.2652 10.5 17V10H17.5C17.7652 10 18.0196 9.89464 18.2071 9.70711C18.3946 9.51957 18.5 9.26522 18.5 9C18.5 8.73478 18.3946 8.48043 18.2071 8.29289C18.0196 8.10536 17.7652 8 17.5 8H10.5V1C10.5 0.734784 10.3946 0.48043 10.2071 0.292893C10.0196 0.105357 9.76522 0 9.5 0C9.23478 0 8.98043 0.105357 8.79289 0.292893C8.60536 0.48043 8.5 0.734784 8.5 1V8H1.5C1.23478 8 0.98043 8.10536 0.792893 8.29289C0.605357 8.48043 0.5 8.73478 0.5 9C0.5 9.26522 0.605357 9.51957 0.792893 9.70711C0.98043 9.89464 1.23478 10 1.5 10H8.5V17Z" />
                </svg>
                {buttonText}
              </button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col">
              <div
                ref={containerRef}
                className="w-full flex flex-wrap justify-between items-center"
              >
                <div className="flex flex-wrap justify-start gap-2">
                  {displayedItems.map((item: any) => (
                    <div
                      key={item._id || item.id || item.identifiant}
                      className={`flex flex-col items-center p-1 rounded-lg cursor-pointer transition-all duration-200 ${((selectedItem.item?._id && selectedItem.item._id === item._id) ||
                        (selectedItem.item?.id && selectedItem.item.id === item.id) ||
                        (selectedItem.item?.identifiant && selectedItem.item.identifiant === item.identifiant &&
                          selectedItem.type === itemType))
                        ? itemType === "prepaid"
                          ? "bg-gradient-to-r from-[#27c3b2]/20 to-[#56c1b5]/20 ring-1 ring-[#27c3b2]/20 shadow"
                          : "bg-gradient-to-r from-[#FFA755]/20 to-[#EC4F48]/20 ring-1 ring-[#EC4F48]/20 shadow"
                        : "hover:bg-gray-50"
                        }`}
                      onClick={() => handleItemClick(item)}
                      style={{ position: 'static', zIndex: 'auto' }}
                    >
                      <div className="flex items-start mb-1 relative" style={{ position: 'static', zIndex: 'auto' }}>
                        <div className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-200 ${((selectedItem.item?._id && selectedItem.item._id === item._id) ||
                          (selectedItem.item?.id && selectedItem.item.id === item.id) ||
                          (selectedItem.item?.identifiant && selectedItem.item.identifiant === item.identifiant &&
                            selectedItem.type === itemType))
                          ? itemType === "prepaid"
                            ? "bg-gradient-to-r from-[#27c3b2] to-[#56c1b5] shadow"
                            : "bg-gradient-to-r from-[#FFA755] to-[#EC4F48] shadow"
                          : "bg-white shadow-sm hover:shadow"
                          }`} style={{ position: 'static', zIndex: 'auto' }}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 30 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ position: 'static', zIndex: 'auto' }}
                          >
                            <path
                              d="M15 12.5C17.7614 12.5 20 10.2614 20 7.5C20 4.73858 17.7614 2.5 15 2.5C12.2386 2.5 10 4.73858 10 7.5C10 10.2614 12.2386 12.5 15 12.5Z"
                              fill={
                                ((selectedItem.item?._id && selectedItem.item._id === item._id) ||
                                  (selectedItem.item?.id && selectedItem.item.id === item.id) ||
                                  (selectedItem.item?.identifiant && selectedItem.item.identifiant === item.identifiant &&
                                    selectedItem.type === itemType))
                                  ? "white"
                                  : iconFill
                              }
                            />
                            <path
                              opacity="0.5"
                              d="M25 21.875C25 24.9812 25 27.5 15 27.5C5 27.5 5 24.9812 5 21.875C5 18.7688 9.4775 16.25 15 16.25C20.5225 16.25 25 18.7688 25 21.875Z"
                              fill={
                                ((selectedItem.item?._id && selectedItem.item._id === item._id) ||
                                  (selectedItem.item?.id && selectedItem.item.id === item.id) ||
                                  (selectedItem.item?.identifiant && selectedItem.item.identifiant === item.identifiant &&
                                    selectedItem.type === itemType))
                                  ? "white"
                                  : iconFill
                              }
                            />
                          </svg>
                          {item.isAlert && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-[1px] border-white shadow-sm">
                            </div>
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-xs font-medium text-center transition-colors ${((selectedItem.item?._id && selectedItem.item._id === item._id) ||
                          (selectedItem.item?.id && selectedItem.item.id === item.id) ||
                          (selectedItem.item?.identifiant && selectedItem.item.identifiant === item.identifiant &&
                            selectedItem.type === itemType))
                          ? "font-bold"
                          : ""
                          }`}
                        style={{
                          color: ((selectedItem.item?._id && selectedItem.item._id === item._id) ||
                            (selectedItem.item?.id && selectedItem.item.id === item.id) ||
                            (selectedItem.item?.identifiant && selectedItem.item.identifiant === item.identifiant &&
                              selectedItem.type === itemType))
                            ? itemType === "prepaid" ? "#27c3b2" : "#EC4F48"
                            : iconFill
                        }}
                      >
                        {item.libelle || item.label || ""}
                      </span>
                      <span className="text-[10px] text-gray-600 overflow-hidden text-ellipsis w-full text-center mt-0.5">
                        {(itemType === "prepaid"
                          ? item.identifiant
                          : item.label || item.identifiant
                        )?.substring(0, 8)}
                        {(itemType === "prepaid"
                          ? item.identifiant
                          : item.label || item.identifiant
                        )?.length > 8
                          ? "..."
                          : ""}
                      </span>
                    </div>
                  ))}

                  {/* Voir plus card */}
                  {hasMoreItems && (
                    <div
                      className="flex flex-col items-center p-1 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                      onClick={handleViewMoreClick}
                      style={{ position: 'static', zIndex: 'auto' }}
                    >
                      <div className="flex mb-1 relative" style={{ position: 'static', zIndex: 'auto' }}>
                        <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-2xl shadow-sm hover:shadow transition-colors" style={{ position: 'static', zIndex: 'auto' }}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 30 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ position: 'static', zIndex: 'auto' }}
                          >
                            <circle cx="10" cy="15" r="2" fill={iconFill} />
                            <circle cx="15" cy="15" r="2" fill={iconFill} />
                            <circle cx="20" cy="15" r="2" fill={iconFill} />
                          </svg>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-center">
                        Voir plus
                      </span>
                      <span className="text-[10px] text-gray-600 text-center mt-0.5">
                        {items.length - maxVisibleItems} autres
                      </span>
                    </div>
                  )}
                </div>

                {/* Bouton d'ajout toujours visible */}
                <div className="flex flex-col items-center justify-center p-1 ml-auto" style={{ position: 'static', zIndex: 'auto' }}>
                  <button
                    className="w-10 h-10 bg-[#E8E8E8] flex justify-center items-center rounded-2xl hover:bg-gray-200 active:bg-gray-300 transition-colors shadow-sm hover:shadow"
                    onClick={onButtonClick}
                    style={{ position: 'static', zIndex: 'auto' }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 19 18"
                      fill="currentColor"
                      style={{ position: 'static', zIndex: 'auto' }}
                    >
                      <path d="M8.5 17C8.5 17.2652 8.60536 17.5196 8.79289 17.7071C8.98043 17.8946 9.23478 18 9.5 18C9.76522 18 10.0196 17.8946 10.2071 17.7071C10.3946 17.5196 10.5 17.2652 10.5 17V10H17.5C17.7652 10 18.0196 9.89464 18.2071 9.70711C18.3946 9.51957 18.5 9.26522 18.5 9C18.5 8.73478 18.3946 8.48043 18.2071 8.29289C18.0196 8.10536 17.7652 8 17.5 8H10.5V1C10.5 0.734784 10.3946 0.48043 10.2071 0.292893C10.0196 0.105357 9.76522 0 9.5 0C9.23478 0 8.98043 0.105357 8.79289 0.292893C8.60536 0.48043 8.5 0.734784 8.5 1V8H1.5C1.23478 8 0.98043 8.10536 0.792893 8.29289C0.605357 8.48043 0.5 8.73478 0.5 9C0.5 9.26522 0.605357 9.51957 0.792893 9.70711C0.98043 9.89464 1.23478 10 1.5 10H8.5V17Z" />
                    </svg>
                  </button>
                  <span className="text-[10px] text-gray-600 mt-1">
                    Ajouter
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal pour voir tous les compteurs */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999999] flex items-center justify-center p-4 animate-fadeIn">
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-xl w-full max-h-[80vh] flex flex-col z-[1000000] shadow-xl animate-fadeInUp"
            style={{
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
            }}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${itemType === "prepaid"
                  ? "bg-gradient-to-r from-[#27c3b2] to-[#56c1b5]"
                  : "bg-gradient-to-r from-[#FFA755] to-[#EC4F48]"
                  }`}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 12.5C17.7614 12.5 20 10.2614 20 7.5C20 4.73858 17.7614 2.5 15 2.5C12.2386 2.5 10 4.73858 10 7.5C10 10.2614 12.2386 12.5 15 12.5Z"
                      fill="white"
                    />
                    <path
                      opacity="0.5"
                      d="M25 21.875C25 24.9812 25 27.5 15 27.5C5 27.5 5 24.9812 5 21.875C5 18.7688 9.4775 16.25 15 16.25C20.5225 16.25 25 18.7688 25 21.875Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {itemType === "prepaid" ? "Mes compteurs" : "Mes identifiants"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {items.length} {itemType === "prepaid" ? "compteurs" : "identifiants"} disponibles
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-all duration-300 hover:rotate-90"
                title="Fermer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[500px] scrollbar-thin">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((item: any, index: number) => (
                  <div
                    key={item._id || item.id || item.identifiant}
                    className={`flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all duration-300 ${((selectedItem.item?._id && selectedItem.item._id === item._id) ||
                      (selectedItem.item?.id && selectedItem.item.id === item.id) ||
                      (selectedItem.item?.identifiant && selectedItem.item.identifiant === item.identifiant &&
                        selectedItem.type === itemType))
                      ? itemType === "prepaid"
                        ? "bg-gradient-to-r from-[#27c3b2]/10 to-[#56c1b5]/10 ring-1 ring-[#27c3b2]/20 shadow-sm"
                        : "bg-gradient-to-r from-[#FFA755]/10 to-[#EC4F48]/10 ring-1 ring-[#EC4F48]/20 shadow-sm"
                      : "hover:bg-gray-50 active:bg-gray-100"
                      }`}
                    onClick={() => handleItemClick(item)}
                    style={{
                      animationDelay: `${index * 0.05}s`,
                      animation: "fadeInUp 0.5s ease-out forwards"
                    }}
                  >
                    <div className="flex items-center justify-center mb-3 relative">
                      <div
                        className={`w-14 h-14 flex items-center justify-center rounded-full transition-all duration-300 ${((selectedItem.item?._id && selectedItem.item._id === item._id) ||
                          (selectedItem.item?.id && selectedItem.item.id === item.id) ||
                          (selectedItem.item?.identifiant && selectedItem.item.identifiant === item.identifiant &&
                            selectedItem.type === itemType))
                          ? itemType === "prepaid"
                            ? "bg-gradient-to-r from-[#27c3b2] to-[#56c1b5] shadow"
                            : "bg-gradient-to-r from-[#FFA755] to-[#EC4F48] shadow"
                          : "bg-white shadow-sm hover:shadow"
                          }`}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 30 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="transition-transform duration-300 group-hover:scale-110"
                        >
                          <path
                            d="M15 12.5C17.7614 12.5 20 10.2614 20 7.5C20 4.73858 17.7614 2.5 15 2.5C12.2386 2.5 10 4.73858 10 7.5C10 10.2614 12.2386 12.5 15 12.5Z"
                            fill={
                              ((selectedItem.item?._id && selectedItem.item._id === item._id) ||
                                (selectedItem.item?.id && selectedItem.item.id === item.id) ||
                                (selectedItem.item?.identifiant && selectedItem.item.identifiant === item.identifiant &&
                                  selectedItem.type === itemType))
                                ? "white"
                                : iconFill
                            }
                          />
                          <path
                            opacity="0.5"
                            d="M25 21.875C25 24.9812 25 27.5 15 27.5C5 27.5 5 24.9812 5 21.875C5 18.7688 9.4775 16.25 15 16.25C20.5225 16.25 25 18.7688 25 21.875Z"
                            fill={
                              ((selectedItem.item?._id && selectedItem.item._id === item._id) ||
                                (selectedItem.item?.id && selectedItem.item.id === item.id) ||
                                (selectedItem.item?.identifiant && selectedItem.item.identifiant === item.identifiant &&
                                  selectedItem.type === itemType))
                                ? "white"
                                : iconFill
                            }
                          />
                        </svg>
                        {item.isAlert && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-[1px] border-white shadow-sm animate-pulse"></div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <span
                        className={`text-sm transition-colors ${((selectedItem.item?._id && selectedItem.item._id === item._id) ||
                          (selectedItem.item?.id && selectedItem.item.id === item.id) ||
                          (selectedItem.item?.identifiant && selectedItem.item.identifiant === item.identifiant &&
                            selectedItem.type === itemType))
                          ? "font-semibold"
                          : "font-medium"
                          }`}
                        style={{
                          color: ((selectedItem.item?._id && selectedItem.item._id === item._id) ||
                            (selectedItem.item?.id && selectedItem.item.id === item.id) ||
                            (selectedItem.item?.identifiant && selectedItem.item.identifiant === item.identifiant &&
                              selectedItem.type === itemType))
                            ? itemType === "prepaid" ? "#27c3b2" : "#EC4F48"
                            : "#222928"
                        }}
                      >
                        {item.libelle || item.label || ""}
                      </span>
                      <span className="text-xs text-gray-500 overflow-hidden text-ellipsis w-full text-center mt-1">
                        {itemType === "prepaid"
                          ? item.identifiant
                          : item.label || item.identifiant}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Bouton Voir Plus pour les prépayés */}
                {false && (
                  <div
                    className="flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gray-50 active:bg-gray-100"
                    onClick={() => {
                      setIsModalOpen(false); // Fermer la modal actuelle
                      setTimeout(() => {
                        onButtonClick(); // Appeler onButtonClick après fermeture
                      }, 300); // Délai pour l'animation de fermeture
                    }}
                    style={{
                      animationDelay: `${items.length * 0.05}s`,
                      animation: "fadeInUp 0.5s ease-out forwards"
                    }}
                  >
                    <div className="flex items-center justify-center mb-3 relative">
                      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-[#27c3b2]/20 to-[#56c1b5]/20 transition-all duration-300 hover:shadow">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="transition-transform duration-300 group-hover:scale-110"
                        >
                          <path d="M12 5V19M5 12H19" stroke="#27c3b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <span className="text-sm font-medium text-[#27c3b2]">
                        Ajouter un compteur
                      </span>
                      <span className="text-xs text-gray-500 text-center mt-1">
                        Prépayé
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-5 border-t border-gray-100">
              {/* Restaurer le bouton du bas pour tous les types */}
              <button
                onClick={() => {
                  setIsModalOpen(false); // Fermer la modal actuelle
                  setTimeout(() => {
                    onButtonClick(); // Appeler onButtonClick après fermeture
                  }, 300); // Délai pour l'animation de fermeture
                }}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-[1.02] ${itemType === "prepaid"
                  ? "text-white bg-gradient-to-r from-[#27c3b2] to-[#56c1b5] hover:shadow-[0_10px_15px_-3px_rgba(39,195,178,0.3)]"
                  : "text-white bg-gradient-to-r from-[#FFA755] to-[#EC4F48] hover:shadow-[0_10px_15px_-3px_rgba(236,79,72,0.3)]"
                  }`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 19 18"
                  fill="white"
                  className="transition-transform group-hover:rotate-90"
                >
                  <path d="M8.5 17C8.5 17.2652 8.60536 17.5196 8.79289 17.7071C8.98043 17.8946 9.23478 18 9.5 18C9.76522 18 10.0196 17.8946 10.2071 17.7071C10.3946 17.5196 10.5 17.2652 10.5 17V10H17.5C17.7652 10 18.0196 9.89464 18.2071 9.70711C18.3946 9.51957 18.5 9.26522 18.5 9C18.5 8.73478 18.3946 8.48043 18.2071 8.29289C18.0196 8.10536 17.7652 8 17.5 8H10.5V1C10.5 0.734784 10.3946 0.48043 10.2071 0.292893C10.0196 0.105357 9.76522 0 9.5 0C9.23478 0 8.98043 0.105357 8.79289 0.292893C8.60536 0.48043 8.5 0.734784 8.5 1V8H1.5C1.23478 8 0.98043 8.10536 0.792893 8.29289C0.605357 8.48043 0.5 8.73478 0.5 9C0.5 9.26522 0.605357 9.51957 0.792893 9.70711C0.98043 9.89464 1.23478 10 1.5 10H8.5V17Z" />
                </svg>
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const [isRattachementModalOpen, setIsRattachementModalOpen] = useState(false);
  const [rattachementType, setRattachementType] = useState<
    "prepaid" | "postpaid"
  >("postpaid");

  // États précédents conservés pour compatibilité
  const [isCompteurModalOpen, setIsCompteurModalOpen] = useState(false);
  const [isIdentifiantModalOpen, setIsIdentifiantModalOpen] = useState(false);

  // Paramètres de pagination et filtrage pour l'API
  const [rattachementParams, setRattachementParams] = useState({
    page: 1,
    pageSize: 5,
    // Vous pouvez ajouter d'autres paramètres selon vos besoins
  });

  // États pour gérer le chargement des données
  const [compteursPrepaid, setCompteursPrepaid] = useState<Compteur[]>([]);
  const [compteursPostpaid, setCompteursPostpaid] = useState<Compteur[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPrepaid, setIsLoadingPrepaid] = useState(false);
  const [isLoadingPostpaid, setIsLoadingPostpaid] = useState(false);
  // Référence pour suivre si les données ont déjà été chargées
  const dataLoadedRef = React.useRef(false);

  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [urlUserData, setUrlUserData] = useState<{
    firstname: string;
    lastname: string;
    userId: string;
  } | null>(null);

  // Fonction pour afficher un message toast
  const showToastMessage = useCallback(
    (
      message: string,
      type: "success" | "error" | "info" | "warning" = "info"
    ) => {
      // Vérifier si la fonction toast existe dans l'environnement global
      if (typeof window !== "undefined" && (window as any).toast) {
        (window as any).toast[type](message);
      } else {
        // Utiliser l'API native si disponible
        if (typeof window !== "undefined" && "Notification" in window) {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              new Notification(message);
            }
          });
        }
      }
    },
    []
  );

  // Pour gérer le montage du composant côté client et récupérer les données de l'URL
  useEffect(() => {
    setMounted(true);

    // Récupérer les données utilisateur depuis l'URL si présentes
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const udata = urlParams.get("udata");

      if (udata) {
        try {
          // Décoder les données utilisateur
          const decodedData = JSON.parse(atob(udata));
          setUrlUserData(decodedData);

          // Nettoyer l'URL pour des raisons de sécurité après avoir récupéré les données
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        } catch (error) {
          console.error(
            "Erreur lors du décodage des données utilisateur:",
            error
          );
        }
      }
    }
  }, []);

  // Récupérer les données utilisateur de sessionStorage si disponibles
  useEffect(() => {
    if (typeof window !== "undefined" && !user) {
      const authData = sessionStorage.getItem("authData");
      if (authData) {
        try {
          // Utiliser les données de sessionStorage pour mettre à jour le state local
          const parsedData = JSON.parse(authData);
          if (parsedData.user) {
            setUrlUserData({
              firstname: parsedData.user.firstname,
              lastname: parsedData.user.lastname,
              userId: parsedData.user._id,
            });
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données de session:",
            error
          );
        }
      }
    }
  }, [user]);

  // Optimisation des fonctions de récupération des données
  const fetchAllRattachements = useCallback(async () => {
    // Si les données ont déjà été chargées et qu'on n'est pas en train de rafraîchir
    // intentionnellement, on quitte la fonction
    if (dataLoadedRef.current && rattachementParams.page === 1) {
      return;
    }

    // Vérifier si nous sommes côté client avant de tenter d'accéder au localStorage
    if (typeof window === "undefined") {
      return; // Ne pas exécuter côté serveur
    }

    setIsLoading(true);
    setIsLoadingPrepaid(true);
    setIsLoadingPostpaid(true);

    // Fonction pour charger depuis le cache
    const tryLoadFromCache = () => {
      try {
        const cachedPrepaid = sessionStorage.getItem("compteursPrepaid");
        const cachedPostpaid = sessionStorage.getItem("compteursPostpaid");

        if (cachedPrepaid) {
          const parsedData = JSON.parse(cachedPrepaid);
          const compteursFromCache = parsedData.map((item: any) => ({
            _id: item._id,
            id: item.id,
            identifiant: item.identifiant,
            label: item.label || item.identifiant,
            isAlert: item.isAlert || false,
            status: item.status,
            statutRattachement: item.statutRattachement,
            type: "prepaid",
          }));
          setCompteursPrepaid(compteursFromCache);
        }

        if (cachedPostpaid) {
          const parsedData = JSON.parse(cachedPostpaid);
          const compteursFromCache = parsedData.map((item: any) => ({
            _id: item._id,
            id: item.id,
            identifiant: item.identifiant,
            label: item.label || item.identifiant,
            isAlert: item.isAlert || false,
            status: item.status,
            statutRattachement: item.statutRattachement,
            type: "postpaid",
          }));
          setCompteursPostpaid(compteursFromCache);
        }

        return cachedPrepaid || cachedPostpaid;
      } catch (cacheError) {
        console.error("Erreur lors de la récupération du cache:", cacheError);
        return false;
      }
    };

    try {
      // Récupérer le token depuis plusieurs sources possibles
      let token_login: string | null = null;

      // Vérifier si nous sommes côté client avant d'accéder au localStorage/sessionStorage
      if (typeof window !== "undefined") {
        // Essayer de récupérer le token depuis différentes sources dans un ordre de priorité
        token_login = localStorage.getItem("token_login");

        if (!token_login) {
          token_login = localStorage.getItem("token");
        }

        if (!token_login) {
          token_login = sessionStorage.getItem("token_login");
        }

        if (!token_login) {
          token_login = sessionStorage.getItem("token");
        }

        // Essayer de récupérer depuis authData en dernier recours
        if (!token_login) {
          const authData = sessionStorage.getItem("authData");
          if (authData) {
            try {
              const parsedAuthData = JSON.parse(authData);
              token_login = parsedAuthData.token;
            } catch (e) {
              console.error("Erreur lors du parsing de authData:", e);
            }
          }
        }
      }

      // Si aucun token n'est trouvé, charger les données depuis le cache si disponible
      if (!token_login) {
        console.warn(
          "Token d'authentification non trouvé, tentative de récupération depuis le cache"
        );

        // Si des données sont chargées depuis le cache
        if (tryLoadFromCache()) {
          showToastMessage(
            "Session expirée. Affichage des données en cache. Veuillez vous reconnecter.",
            "warning"
          );
          // Marquer que les données ont été chargées (même si c'est depuis le cache)
          dataLoadedRef.current = true;
        } else {
          // Si pas de données en cache et pas de token, rediriger vers la page de connexion
          showToastMessage(
            "Session expirée. Veuillez vous reconnecter.",
            "error"
          );

          // Délai court avant la redirection pour permettre l'affichage du message
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        }

        // Terminer les états de chargement
        setIsLoading(false);
        setIsLoadingPrepaid(false);
        setIsLoadingPostpaid(false);
        return;
      }

      // Construire l'URL avec les paramètres
      const queryParams = new URLSearchParams();
      Object.entries(rattachementParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      // Configuration des requêtes
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token_login}`,
      };

      // Exécuter les deux requêtes en parallèle
      const [postpaidResponse, prepaidResponse] = await Promise.all([
        fetch(
          `${API_URL}/v3/rattachement/postpaye/me?${queryParams.toString()}`,
          {
            method: "GET",
            headers,
          }
        ),
        fetch(
          `${API_URL}/v3/rattachement/prepaye/me?${queryParams.toString()}`,
          {
            method: "GET",
            headers,
          }
        ),
      ]);

      // Vérifier les réponses et traiter les codes d'erreur HTTP
      if (!postpaidResponse.ok) {
        // Si le token est expiré (401) ou non autorisé (403)
        if (
          postpaidResponse.status === 401 ||
          postpaidResponse.status === 403
        ) {
          // Essayer de restaurer depuis le cache et suggérer une reconnexion
          const hasCachedData = tryLoadFromCache();
          if (hasCachedData) {
            showToastMessage(
              "Session expirée. Affichage des données en cache. Veuillez vous reconnecter.",
              "warning"
            );
          } else {
            showToastMessage(
              "Session expirée. Veuillez vous reconnecter.",
              "error"
            );
            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
          }
          return;
        }
        throw new Error(
          `Erreur lors de la récupération des rattachements postpayés: ${postpaidResponse.status}`
        );
      }

      if (!prepaidResponse.ok) {
        if (prepaidResponse.status === 401 || prepaidResponse.status === 403) {
          // Déjà géré par le bloc précédent
          return;
        }
        throw new Error(
          `Erreur lors de la récupération des rattachements prépayés: ${prepaidResponse.status}`
        );
      }

      // Transformer les réponses en JSON en parallèle
      const [postpaidData, prepaidData] = await Promise.all([
        postpaidResponse.json(),
        prepaidResponse.json(),
      ]);

      // Traiter les données postpayées
      if (postpaidData && postpaidData.data) {
        const compteursFromApi = postpaidData.data.map((item: any) => ({
          ...item, // Preserve all original fields
          label: item.label || item.identifiant, // Ensure label exists
          isAlert: item.isAlert || false, // Add UI-specific field if not present
          type: "postpaid", // Ensure type is set to postpaid
        }));

        setCompteursPostpaid(compteursFromApi);
      }

      // Traiter les données prépayées
      if (prepaidData && prepaidData.data) {
        const compteursFromApi = prepaidData.data.map((item: any) => ({
          ...item, // Preserve all original fields
          label: item.label || item.identifiant, // Ensure label exists
          isAlert: item.isAlert || false, // Add UI-specific field if not present
          type: "prepaid", // Ensure type is set to prepaid
        }));

        setCompteursPrepaid(compteursFromApi);
      }

      // Marquer que les données ont été chargées
      dataLoadedRef.current = true;

      // Utiliser sessionStorage pour stocker les résultats (mise en cache)
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "compteursPrepaid",
          JSON.stringify(prepaidData.data || [])
        );
        sessionStorage.setItem(
          "compteursPostpaid",
          JSON.stringify(postpaidData.data || [])
        );
        sessionStorage.setItem(
          "rattachementsLastUpdate",
          new Date().toISOString()
        );
      }
    } catch (err: any) {
      console.error("Erreur lors de la récupération des rattachements:", err);

      // En cas d'erreur, essayer de récupérer les données en cache
      if (typeof window !== "undefined") {
        try {
          const cachedPrepaid = sessionStorage.getItem("compteursPrepaid");
          const cachedPostpaid = sessionStorage.getItem("compteursPostpaid");

          if (cachedPrepaid) {
            const parsedData = JSON.parse(cachedPrepaid);
            const compteursFromCache = parsedData.map((item: any) => ({
              ...item, // Preserve all original fields
              label: item.label || item.identifiant, // Ensure label exists
              isAlert: item.isAlert || false, // Add UI-specific field if not present
              type: "prepaid", // Ensure type is set to prepaid
            }));
            setCompteursPrepaid(compteursFromCache);
          }

          if (cachedPostpaid) {
            const parsedData = JSON.parse(cachedPostpaid);
            const compteursFromCache = parsedData.map((item: any) => ({
              ...item, // Preserve all original fields
              label: item.label || item.identifiant, // Ensure label exists
              isAlert: item.isAlert || false, // Add UI-specific field if not present
              type: "postpaid", // Ensure type is set to postpaid
            }));
            setCompteursPostpaid(compteursFromCache);
          }

          // Afficher un message si on utilise les données en cache
          if (cachedPrepaid || cachedPostpaid) {
            showToastMessage(
              "Affichage des données en cache. Essayez de rafraîchir la page.",
              "info"
            );
          }
        } catch (cacheError) {
          console.error("Erreur lors de la récupération du cache:", cacheError);
        }
      }
    } finally {
      setIsLoading(false);
      setIsLoadingPrepaid(false);
      setIsLoadingPostpaid(false);
    }
  }, [rattachementParams, showToastMessage]);

  // Charger les données au montage du composant et lors des changements de paramètres
  useEffect(() => {
    // S'assurer que nous sommes côté client avant d'appeler fetchAllRattachements
    if (typeof window !== "undefined" && mounted) {
      fetchAllRattachements();
    }
  }, [fetchAllRattachements, mounted]);

  // Mettre à jour fetchRattachements pour qu'il utilise la nouvelle fonction optimisée
  const fetchRattachements = useCallback(() => {
    // Réinitialiser le flag pour forcer le rechargement des données
    dataLoadedRef.current = false;
    fetchAllRattachements();
  }, [fetchAllRattachements]);

  // Fonction pour décoder le token JWT et extraire l'ID client
  const decodeToken = (token: string | null): any | null => {
    if (!token) return null;

    try {
      // Décoder le token JWT pour obtenir la payload
      const base64Url = token.split(".")[1];
      if (!base64Url) return null;

      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(base64));

      return payload;
    } catch (error) {
      console.error("Erreur lors du décodage du token:", error);
      return null;
    }
  };

  // Fonction générique pour soumettre le formulaire de rattachement
  const handleRattachementSubmit = async (data: {
    identifiant: string;
    isAlerte?: boolean;
    label?: string;
  }) => {
    try {
      // Récupérer le label (utiliser l'identifiant comme fallback si non fourni)
      const label = data.label || data.identifiant;

      // Appeler directement la fonction de rattachement selon le type
      let success;
      if (rattachementType === "postpaid") {
        success = await handleRattachementPostpaid(data.identifiant, label);
      } else {
        success = await handleRattachementPrepaid(data.identifiant, label);
      }

      // Fermer la modal si le rattachement a réussi
      if (success) {
        setIsRattachementModalOpen(false);
      }

      return success;
    } catch (error) {
      console.error("Erreur lors du rattachement:", error);
      return false;
    }
  };

  // Fonction pour le rattachement générique (utilisable pour prépayé et postpayé)
  const handleRattachement = async (
    identifiant: string,
    label: string,
    type: "prepaid" | "postpaid"
  ) => {
    try {
      setIsLoading(true);

      // Récupérer le token pour l'authentification
      const token_login =
        localStorage.getItem("token_login") ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        (sessionStorage.getItem("authData")
          ? JSON.parse(sessionStorage.getItem("authData") || "{}").token
          : null);

      if (!token_login) {
        throw new Error("Aucun token d'authentification trouvé");
      }

      // Récupérer l'objet user depuis localStorage et le parser correctement
      let clientId: string | null = null;
      const userStr = localStorage.getItem("user");

      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          clientId = userObj._id;
        } catch (e) {
          console.error("Erreur lors du parsing de l'utilisateur:", e);
        }
      }

      // Si on n'a pas trouvé de clientId dans localStorage, chercher dans d'autres sources
      if (!clientId && user && user._id) {
        clientId = user._id;
      }

      // En dernier recours, essayer d'extraire à partir du token
      if (!clientId) {
        const decodedToken = decodeToken(token_login);
        if (decodedToken && decodedToken._id) {
          clientId = decodedToken._id;
        }
      }

      // Vérifier si on a bien un clientId
      if (!clientId) {
        throw new Error("Impossible de récupérer l'ID client");
      }

      // Corps de la requête
      const requestBody = {
        identifiant,
        label,
        clientId,
      };

      // URL de l'endpoint en fonction du type
      const endpoint =
        type === "postpaid"
          ? `${API_URL}/v3/rattachement/postpaye/niveau/1`
          : `${API_URL}/v3/rattachement/prepaye/niveau/1`;

      // Effectuer la requête
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token_login}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Erreur lors du rattachement: ${response.status}`
        );
      }

      // Si le rattachement est réussi
      if (data && data.message === "Action éffectuée avec succès") {
        // Afficher le message de succès
        showToastMessage(
          `Rattachement ${type === "postpaid" ? "postpayé" : "prépayé"
          } effectué avec succès`,
          "success"
        );

        // Rafraîchir la liste des rattachements
        fetchRattachements();

        return true;
      } else {
        throw new Error(data.message || "Erreur lors du rattachement");
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      showToastMessage(errorMessage, "error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions simplifiées pour le rattachement - ne font que relayer à handleRattachement
  const handleRattachementPostpaid = (identifiant: string, label: string) => {
    return handleRattachement(identifiant, label, "postpaid");
  };

  const handleRattachementPrepaid = (identifiant: string, label: string) => {
    return handleRattachement(identifiant, label, "prepaid");
  };

  // État pour gérer le compteur/identifiant sélectionné
  const [selectedItem, setSelectedItem] = useState<{
    type: "prepaid" | "postpaid" | null;
    item: Compteur | Identifiant | null;
  }>({ type: null, item: null });

  // Nouvel état pour stocker les détails du compteur sélectionné
  const [itemDetails, setItemDetails] = useState<any>(null);
  console.log(itemDetails, "itemDetails");
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Nouvel état pour stocker les détails de la dernière facture
  const [lastInvoice, setLastInvoice] = useState<any>(null);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);

  // Fonction pour récupérer les détails d'un identifiant/compteur
  const fetchItemDetails = useCallback(
    async (id: string) => {
      if (!id) {
        console.error("ID manquant pour fetchItemDetails");
        return;
      }

      setIsLoadingDetails(true);

      try {
        // Récupérer le token pour l'authentification
        const token_login =
          localStorage.getItem("token_login") ||
          localStorage.getItem("token") ||
          sessionStorage.getItem("token") ||
          (sessionStorage.getItem("authData")
            ? JSON.parse(sessionStorage.getItem("authData") || "{}").token
            : null);

        if (!token_login) {
          console.error("Token d'authentification introuvable");
          throw new Error("Aucun token d'authentification trouvé");
        }

        // Configuration de la requête
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token_login}`,
        };

        // Appel API pour récupérer les détails
        const response = await fetch(
          `${API_URL}/v3/rattachement/details/${id}`,
          {
            method: "GET",
            headers,
          }
        );

        if (!response.ok) {
          // Gérer les erreurs d'authentification
          if (response.status === 401 || response.status === 403) {
            showToastMessage(
              "Session expirée. Veuillez vous reconnecter.",
              "warning"
            );
            return;
          }
          throw new Error(
            `Erreur lors de la récupération des détails: ${response.status}`
          );
        }

        const responseData = await response.json();

        // Mettre à jour l'état avec les détails reçus selon le nouveau format de réponse
        if (responseData && responseData.data) {
          setItemDetails(responseData.data);
        } else {
          console.warn("Réponse API sans données valides:", responseData);
          setItemDetails(null);
        }
      } catch (error: any) {
        console.error(
          "Erreur détaillée lors de la récupération des détails:",
          error
        );
        const errorMessage = handleApiError(error);
        showToastMessage(errorMessage, "error");
        setItemDetails(null);
      } finally {
        setIsLoadingDetails(false);
      }
    },
    [showToastMessage]
  );

  // Fonction pour récupérer la dernière facture d'un identifiant postpayé
  const fetchLastInvoice = useCallback(
    async (identifiant: string) => {
      if (!identifiant) {
        console.error("Identifiant manquant pour fetchLastInvoice");
        return;
      }

      setIsLoadingInvoice(true);

      try {
        // Récupérer le token pour l'authentification
        const token_login =
          localStorage.getItem("token_login") ||
          localStorage.getItem("token") ||
          sessionStorage.getItem("token") ||
          (sessionStorage.getItem("authData")
            ? JSON.parse(sessionStorage.getItem("authData") || "{}").token
            : null);

        if (!token_login) {
          console.error("Token d'authentification introuvable");
          throw new Error("Aucun token d'authentification trouvé");
        }

        // Configuration de la requête
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token_login}`,
        };

        // Appel API pour récupérer la dernière facture
        const response = await fetch(
          `${API_URL}/v3/rattachement/postpaye/factures/${identifiant}/last`,
          {
            method: "GET",
            headers,
          }
        );

        if (!response.ok) {
          // Gérer les erreurs d'authentification
          if (response.status === 401 || response.status === 403) {
            showToastMessage(
              "Session expirée. Veuillez vous reconnecter.",
              "warning"
            );
            return;
          }
          throw new Error(
            `Erreur lors de la récupération de la dernière facture: ${response.status}`
          );
        }

        const responseData = await response.json();

        // Mettre à jour l'état avec les détails reçus selon le nouveau format de réponse
        if (responseData && responseData.data) {
          setLastInvoice(responseData.data);
        } else {
          console.warn(
            "Réponse API sans données valides pour la facture:",
            responseData
          );
          setLastInvoice(null);
        }
      } catch (error: any) {
        console.error(
          "Erreur détaillée lors de la récupération de la dernière facture:",
          error
        );
        const errorMessage = handleApiError(error);
        showToastMessage(errorMessage, "error");
        setLastInvoice(null);
      } finally {
        setIsLoadingInvoice(false);
      }
    },
    [showToastMessage]
  );

  // Appeler fetchItemDetails chaque fois que selectedItem change
  useEffect(() => {
    if (selectedItem.item) {
      // Utiliser _id en priorité, puis id, puis identifiant
      const itemId =
        selectedItem.item._id ||
        selectedItem.item.id ||
        selectedItem.item.identifiant;
      const identifiant = selectedItem.item.identifiant;

      if (itemId) {
        fetchItemDetails(itemId);

        // Vérifier que c'est uniquement un compteur postpayé avant d'appeler fetchLastInvoice
        if (selectedItem.type === "postpaid" && identifiant) {
          // Appel de fetchLastInvoice uniquement pour les postpayés
          fetchLastInvoice(identifiant);
        } else {
          // Réinitialiser les données de facture si ce n'est pas un compteur postpayé
          setLastInvoice(null);
        }
      } else {
        setItemDetails(null);
        setLastInvoice(null);
      }
    } else {
      // Réinitialiser les détails si aucun élément n'est sélectionné
      setItemDetails(null);
      setLastInvoice(null);
    }
  }, [selectedItem, fetchItemDetails, fetchLastInvoice]);

  // État pour gérer l'affichage de l'image de facture en grand
  const [selectedFacture, setSelectedFacture] = useState<{
    isOpen: boolean;
    image: string;
    title: string;
    montant: string;
    consommation: string;
    isPaid: boolean;
  }>({
    isOpen: false,
    image: "",
    title: "",
    montant: "",
    consommation: "",
    isPaid: true,
  });

  // États pour gérer le zoom de l'image (modal facture)
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  // État pour masquer/afficher le montant
  const [isMontantHidden, setIsMontantHidden] = useState(false);

  // Pour gérer le montage du composant côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Réinitialise le zoom et la position quand on ferme la modal
  useEffect(() => {
    if (!selectedFacture.isOpen) {
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [selectedFacture.isOpen]);

  // Fonction pour ouvrir la modale de rattachement avec le type approprié
  const openRattachementModal = (type: "prepaid" | "postpaid") => {
    setRattachementType(type);
    setIsRattachementModalOpen(true);
  };

  // Pour compatibilité avec le code existant
  const handleCompteurSubmit = async (data: any) => {
    return handleRattachementSubmit(data);
  };

  const handleIdentifiantSubmit = async (data: any) => {
    return handleRattachementSubmit(data);
  };

  const [isDemandeModalOpen, setIsDemandeModalOpen] = useState(false);
  const [isLevel2ModalOpen, setIsLevel2ModalOpen] = useState(false);
  // Ajouter un nouvel état pour le modal de réclamation
  const [isReclModalOpen, setIsReclModalOpen] = useState(false);

  // Effet pour vérifier s'il y a une demande en attente à ouvrir automatiquement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Utiliser setTimeout pour donner le temps au composant de se monter complètement
      setTimeout(() => {
        // Vérifier s'il y a une demande à ouvrir automatiquement
        const openDemandeType = localStorage.getItem('openDemandeType');
        if (openDemandeType) {
          console.log("Demande en attente détectée, ouverture automatique de la modal:", openDemandeType);
          // Forcer l'ouverture de la modal
          setIsDemandeModalOpen(true);

          // Pour déboguer
          console.log("État de la modal après tentative d'ouverture:", isDemandeModalOpen);
        }

        // Ne pas supprimer la demande en attente si elle n'a pas été traitée correctement
      }, 1000); // Attendre 1 seconde pour être sûr que tout est bien chargé
    }
  }, []);

  // Function for level 2 attachment (postpaid only)
  const handleLevel2Attachment = async (data: { index?: number; montant?: number }) => {
    try {
      setIsLoading(true);

      // Get the authentication token
      const token_login =
        localStorage.getItem("token_login") ||
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        (sessionStorage.getItem("authData")
          ? JSON.parse(sessionStorage.getItem("authData") || "{}").token
          : null);

      if (!token_login) {
        throw new Error("Aucun token d'authentification trouvé");
      }

      // Get client ID
      let clientId: string | null = null;
      const userStr = localStorage.getItem("user");

      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          clientId = userObj._id;
        } catch (e) {
          console.error("Erreur lors du parsing de l'utilisateur:", e);
        }
      }

      // If clientId not found in localStorage, check other sources
      if (!clientId && user && user._id) {
        clientId = user._id;
      }

      // As a last resort, try to extract from token
      if (!clientId) {
        const decodedToken = decodeToken(token_login);
        if (decodedToken && decodedToken._id) {
          clientId = decodedToken._id;
        }
      }

      // Check if we have a clientId
      if (!clientId) {
        throw new Error("Impossible de récupérer l'ID client");
      }

      // Check if we have the selected item with identifiant
      if (!selectedItem.item || !selectedItem.item.identifiant) {
        throw new Error("Aucun compteur sélectionné");
      }

      // Create request body based on selectedItem.type
      let requestBody;
      if (selectedItem.type === "postpaid") {
        // Pour les compteurs postpayé: besoin de index
        requestBody = {
          identifiant: selectedItem.item.identifiant,
          index: data.index,
          clientId,
        };
      } else {
        // Pour les compteurs prépayé: besoin de montant
        requestBody = {
          identifiant: selectedItem.item.identifiant,
          montant: data.montant,
          clientId,
        };
      }

      // API endpoint for level 2 attachment
      const endpoint = `${API_URL}/v3/rattachement/${selectedItem.type === "postpaid" ? "postpaye" : "prepaye"}/niveau/2`;

      // Make the request
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token_login}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message ||
          `Erreur lors du rattachement niveau 2: ${response.status}`
        );
      }

      // If level 2 attachment is successful
      if (
        responseData &&
        responseData.message === "Action éffectuée avec succès"
      ) {
        // Show success message
        showToastMessage(
          `Rattachement niveau 2 ${selectedItem.type === "postpaid" ? "postpayé" : "prépayé"} effectué avec succès`,
          "success"
        );

        // Close the modal
        setIsLevel2ModalOpen(false);

        // Refresh item details to update the UI
        if (selectedItem.item._id) {
          fetchItemDetails(selectedItem.item._id);
        }

        return true;
      } else {
        throw new Error(
          responseData.message || "Erreur lors du rattachement niveau 2"
        );
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      showToastMessage(errorMessage, "error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Effet pour surveiller l'état de la modal et vérifier qu'elle est bien ouverte
  useEffect(() => {
    if (isDemandeModalOpen) {
      console.log("Modal de demande ouverte avec succès");
      // La modal est maintenant ouverte, on peut nettoyer les données
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pendingDemandeMode');
        // Ne pas supprimer openDemandeType tout de suite car ModalDEmande en a besoin
        // pour savoir quel type de demande afficher
      }
    }
  }, [isDemandeModalOpen]);

  // Effet immédiat pour forcer l'ouverture de la modal si nécessaire
  useEffect(() => {
    // Script qui s'exécute immédiatement
    const forceOpenModalIfNeeded = () => {
      if (typeof window !== 'undefined') {
        // Vérifier les paramètres URL
        const urlParams = new URLSearchParams(window.location.search);
        const shouldOpenModal = urlParams.get('openModal') === 'true';

        // Vérifier le localStorage
        const openDemandeType = localStorage.getItem('openDemandeType');

        if (openDemandeType || shouldOpenModal) {
          console.log("Tentative immédiate d'ouverture de modal:",
            openDemandeType ? openDemandeType : "via paramètre URL");
          setIsDemandeModalOpen(true);

          // Nettoyer l'URL si nécessaire
          if (shouldOpenModal && window.history.replaceState) {
            window.history.replaceState({}, document.title, "/dashboard");
          }
        }
      }
    };

    // Exécuter immédiatement
    forceOpenModalIfNeeded();

    // Puis réessayer plusieurs fois avec un délai croissant
    const timers = [
      setTimeout(forceOpenModalIfNeeded, 500),
      setTimeout(forceOpenModalIfNeeded, 1500),
      setTimeout(forceOpenModalIfNeeded, 3000)
    ];

    // Nettoyage des timers
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <>
      {/* Modal pour afficher la facture en grand (zoom possible) */}
      {selectedFacture.isOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Header modal : titre + boutons zoom & close */}
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">{selectedFacture.title}</h3>
              <div className="flex items-center space-x-4">
                {/* Contrôles de zoom */}
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-2 py-1">
                  <button
                    onClick={() =>
                      setZoomLevel((prev) => Math.max(1, prev - 0.25))
                    }
                    className="text-gray-600 hover:text-gray-900 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200"
                    title="Zoom out"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span className="text-sm font-medium">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() =>
                      setZoomLevel((prev) => Math.min(3, prev + 0.25))
                    }
                    className="text-gray-600 hover:text-gray-900 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200"
                    title="Zoom in"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>

                {/* Bouton reset zoom */}
                <button
                  onClick={() => {
                    setZoomLevel(1);
                    setPosition({ x: 0, y: 0 });
                  }}
                  className="text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg p-2"
                  title="Réinitialiser le zoom"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </button>

                {/* Bouton close modal */}
                <button
                  onClick={() =>
                    setSelectedFacture((prev) => ({ ...prev, isOpen: false }))
                  }
                  className="text-gray-500 hover:text-gray-700"
                  title="Fermer"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenu modal : image + détails */}
            <div
              className="overflow-hidden flex-grow relative bg-gray-50"
              style={{
                cursor:
                  zoomLevel > 1
                    ? isDragging
                      ? "grabbing"
                      : "grab"
                    : "default",
              }}
            >
              <div
                className="relative w-full h-[500px]"
                onMouseDown={(e) => {
                  if (zoomLevel > 1) {
                    e.preventDefault();
                    setIsDragging(true);
                    const rect = e.currentTarget.getBoundingClientRect();
                    const offsetX = e.clientX - rect.left;
                    const offsetY = e.clientY - rect.top;
                    setStartPosition({
                      x: offsetX - position.x,
                      y: offsetY - position.y,
                    });
                  }
                }}
                onMouseMove={(e) => {
                  if (isDragging && zoomLevel > 1) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const offsetX = e.clientX - rect.left;
                    const offsetY = e.clientY - rect.top;

                    const newX = offsetX - startPosition.x;
                    const newY = offsetY - startPosition.y;

                    // Limites de déplacement (éviter de trop déborder)
                    const maxOffset = 200 * (zoomLevel - 1);
                    const boundedX = Math.max(
                      -maxOffset,
                      Math.min(maxOffset, newX)
                    );
                    const boundedY = Math.max(
                      -maxOffset,
                      Math.min(maxOffset, newY)
                    );

                    setPosition({ x: boundedX, y: boundedY });
                  }
                }}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
              >
                <div
                  style={{
                    transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel
                      }px, ${position.y / zoomLevel}px)`,
                    transformOrigin: "center",
                    transition: isDragging ? "none" : "transform 0.2s ease-out",
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <Image
                    src={selectedFacture.image}
                    alt={selectedFacture.title}
                    fill
                    style={{ objectFit: "contain" }}
                    className="p-2"
                    quality={100}
                    priority
                    draggable="false"
                  />
                </div>
              </div>
              <div className="p-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-medium">
                    {selectedFacture.montant}
                  </p>
                  <span
                    className={`text-sm px-2 py-1 rounded-full flex items-center ${selectedFacture.isPaid
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    <span
                      className={`h-2 w-2 ${selectedFacture.isPaid ? "bg-green-600" : "bg-red-600"
                        } rounded-full mr-1`}
                    ></span>
                    {selectedFacture.isPaid ? "Payée" : "Non payée"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {selectedFacture.consommation}
                </p>
                <button className="bg-primary text-white py-2 px-4 rounded-lg font-medium w-full text-center hover:bg-primary/90 transition-all duration-200">
                  Télécharger la facture
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles globaux + hover */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8f9fa;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.15);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.25);
        }

        .dashboard-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .dashboard-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .gradient-bg {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
      `}</style>

      <div className="flex overflow-hidden bg-gradient-to-br from-white to-gray-50">
        <aside className=" ">
          <Sidebar />
        </aside>

        <div className="flex-1 w-full ml-0 lg:ml-[374px] min-h-screen transition-all duration-300">
          <header className="sticky  pl-12 lg:pl-0 px-1 bg-white shadow-sm">
            <Navbar />
          </header>

          <main className="sm:px-5 pt-4 sm:pt-6 pr-2 sm:pr-3 lg:pr-6 overflow-hidden max-w-[2280px] mx-auto">
            <div className="h-[calc(100vh-80px)] overflow-y-auto pb-6 pr-1 custom-scrollbar">
              {/* Bloc de bienvenue */}
              <div className="mb-6 sm:mb-8 to-transparent py-4 rounded-xl">
                <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold">
                  Bienvenue,{" "}
                  <span className="text-rouge">
                    {mounted
                      ? user
                        ? `${user.lastname || ""} ${user.firstname || ""}`
                        : urlUserData
                          ? `${urlUserData.lastname || ""} ${urlUserData.firstname || ""
                          }`
                          : "Utilisateur"
                      : "Utilisateur"}
                  </span>
                </h1>
              </div>

              {/* Section compteurs prépayés / postpayés + cartes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-10 items-start">
                <div className="h-[201px]">
                  <MeterSection
                    title="Mes postpayés"
                    iconFill="#EE761A"
                    items={compteursPostpaid}
                    emptyText="Aucun compteur postpayé "
                    buttonText="Rattacher un identifiant "
                    onButtonClick={() => openRattachementModal("postpaid")}
                    itemType="postpaid"
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    isLoading={isLoadingPostpaid}
                  />
                </div>

                <div className="h-[201px]">
                  <MeterSection
                    title="Mes prépayés"
                    iconFill="#1F7A70"
                    items={compteursPrepaid}
                    emptyText="Aucun compteur prépayé"
                    buttonText="Rattacher un n° compteur"
                    onButtonClick={() => openRattachementModal("prepaid")}
                    itemType="prepaid"
                    selectedItem={selectedItem}
                    setSelectedItem={setSelectedItem}
                    isLoading={isLoadingPrepaid}
                  />
                </div>

                <div className="h-[201px]">
                  {/* Carte 1 : "Un service d'électricité à demander ?" */}
                  <div className="flex flex-col h-full">
                    <div className="flex items-center mb-3 h-[42px]">
                      <p className="text-lg font-medium text-noir">
                        Un service d'électricité à demander ?
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-[20px] shadow-sm w-full h-[159px] flex flex-col">
                      <div className="mb-1">
                        <span className="text-xs text-[#727272]">
                          Branchement, réabonnement, mutation…
                          <br />
                          Faites votre demande en toute simplicité
                        </span>
                      </div>

                      <div className="mt-auto">
                        <button
                          onClick={() => setIsReclModalOpen(true)}
                          className="flex items-center justify-center gap-2 bg-vert rounded-xl py-2 px-3 w-full hover:bg-[#16625A] transition-all duration-300 relative z-[5]"
                        >
                          <div className="text-white">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <span className="font-bold text-white text-xs">
                            Faire une réclamation
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-[201px]">
                  {/* Carte 2 : "Un problème rencontrée ?" */}
                  <div className="flex flex-col h-full">
                    <div className="flex items-center mb-3 h-[42px]">
                      <p className="text-lg font-medium text-noir">
                        Un problème rencontrée ?
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-[20px] shadow-sm w-full h-[159px] flex flex-col">
                      <div className="mb-1">
                        <span className="text-xs text-[#727272]">
                          Faites-nous part de votre réclamation, nous sommes à
                          votre écoute !
                        </span>
                      </div>

                      <div className="mt-auto">
                        <button
                          onClick={() => setIsDemandeModalOpen(true)}
                          className="flex items-center justify-center gap-2 bg-rouge rounded-xl py-2 px-3 w-full hover:bg-[#D43631] transition-all duration-300 relative z-[5]"
                        >
                          <div className="text-white">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <span className="font-bold text-white text-xs">
                            Effectuer une demande
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Détails du compteur et factures */}
              {selectedItem.item ? (
                <div className="flex flex-col gap-[20px] mb-[50px] overflow-hidden" style={{ position: 'static', zIndex: 'auto' }}>
                  {" "}
                  <h1 className="text-xl font-semibold">
                    Détail compte -{" "}
                    <span
                      className="font-bold"
                      style={{
                        color:
                          selectedItem.type === "prepaid"
                            ? "#1F7A70"
                            : selectedItem.type === "postpaid"
                              ? "#EE761A"
                              : "#1F7A70",
                      }}
                    >
                      {selectedItem.item
                        ? ` ${selectedItem.item.identifiant}`
                        : ""}
                    </span>
                  </h1>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 rounded-xl transition-all duration-300 overflow-hidden max-w-full">
                    {/* Solde à régler - Ne s'affiche que lorsque les deux requêtes sont terminées */}
                    {itemDetails &&
                      !isLoadingDetails &&
                      (!isLoadingInvoice) ? (
                      <div className="lg:col-span-5 dashboard-card max-w-full">
                        <div className="dashboard-header">
                          <p className="text-base font-semibold text-gray-800 ml-4 mt-2">
                            Solde à régler
                          </p>
                          {(isLoadingDetails || isLoadingInvoice) && (
                            <div className="dashboard-pill">
                              Chargement...
                            </div>
                          )}
                        </div>
                        <div className="p-5 overflow-hidden">{/* Contenu reste le même */}
                          <div className="flex items-center justify-between mb-5 flex-wrap">
                            <div className="flex items-center">
                              <div className="flex items-center">
                                <div className="relative">
                                  {isMontantHidden ? (
                                    <div className="dashboard-highlight animate-fadeIn">
                                      <p className="text-xs font-medium text-gray-500 mb-1">Solde total</p>
                                      <h2 className="text-3xl sm:text-5xl font-bold gradient-orange-text">
                                        ••••••
                                      </h2>
                                    </div>
                                  ) : (
                                    <div className="p-3 border-l-4 border-[#FF6B00] pl-5 bg-orange-50/50 rounded-r-lg">
                                      <p className="text-xs font-medium text-gray-500 mb-1">Solde total</p>
                                      <h2 className="text-3xl sm:text-5xl font-bold text-[#FF6B00] flex items-baseline">
                                        {lastInvoice?.solde ||
                                          itemDetails?.solde ||
                                          "0"}
                                        <span className="text-sm ml-2 font-medium text-gray-600">
                                          FCFA
                                        </span>
                                      </h2>
                                    </div>
                                  )}
                                </div>

                                {/* Bouton pour masquer/afficher le montant */}
                                <div
                                  className="ml-3 bg-orange-100 hover:bg-orange-200 rounded-full p-2.5 cursor-pointer transition-all shadow-sm flex items-center justify-center"
                                  onClick={() =>
                                    setIsMontantHidden(!isMontantHidden)
                                  }
                                  title={
                                    isMontantHidden
                                      ? "Afficher le montant"
                                      : "Masquer le montant"
                                  }
                                >
                                  <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="#FF6B00"
                                  >
                                    {isMontantHidden ? (
                                      /* Icône œil barré */
                                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                                    ) : (
                                      /* Icône œil "normal" */
                                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                                    )}
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-gray-50/70 rounded-lg mb-5 border border-gray-100 hover:bg-gray-50/90 transition-all">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <span className="dashboard-pill flex items-center">
                                  {itemDetails?.type === "postpaye" ? (
                                    <>
                                      <svg className="w-3 h-3 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                      </svg>
                                      Postpayé
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                      </svg>
                                      Prépayé
                                    </>
                                  )}
                                </span>
                                <div className="flex items-center ml-3">
                                  <svg
                                    className="w-3.5 h-3.5 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                    ></path>
                                  </svg>
                                  <span className="text-xs text-gray-600 ml-1 font-medium">
                                    {itemDetails?.label || ""}
                                  </span>
                                </div>
                              </div>
                              <div className="dashboard-pill flex items-center">
                                <svg
                                  className="w-3.5 h-3.5 mr-1 text-orange-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="font-medium">
                                  {lastInvoice
                                    ? `Échéance: ${new Date(
                                      lastInvoice.dateLimite
                                    ).toLocaleDateString()}`
                                    : `Rattaché le: ${new Date(
                                      itemDetails?.linkedAt
                                    ).toLocaleDateString()}`}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Informations du compteur */}
                          <div className="grid grid-cols-2 gap-4 text-sm overflow-x-hidden">
                            <div className="dashboard-grid-item overflow-hidden">
                              <p className="text-gray-500 text-xs mb-1">
                                Exploitation
                              </p>
                              <p className="font-medium truncate">
                                {lastInvoice?.libelleExploitation || ""}
                              </p>
                            </div>
                            <div className="dashboard-grid-item overflow-hidden">
                              <p className="text-gray-500 text-xs mb-1">
                                Identifiant
                              </p>
                              <p className="font-medium truncate">
                                {itemDetails?.identifiant || ""}
                              </p>
                            </div>
                            <div className="dashboard-grid-item overflow-hidden">
                              <p className="text-gray-500 text-xs mb-1">
                                Puissance
                              </p>
                              <p className="font-medium truncate">
                                {lastInvoice?.reglageDisja || ""}
                              </p>
                            </div>
                            <div className="dashboard-highlight overflow-hidden" style={{ zIndex: 5, position: 'relative' }}>
                              <p className="text-xs font-medium text-gray-500 mb-1 flex items-center">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1 flex-shrink-0">
                                  <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Montant à régler
                              </p>
                              <p className="font-bold text-lg gradient-orange-text truncate">
                                {lastInvoice?.montantTotalARegler || "0"} <span className="text-sm font-medium text-gray-600">FCFA</span>
                              </p>
                            </div>
                            <div className="dashboard-grid-item overflow-hidden">
                              <p className="text-gray-500 text-xs mb-1">
                                Statut
                              </p>
                              <p className="font-medium truncate">
                                {itemDetails?.status === "active" ? (
                                  <span className="dashboard-badge badge-active">active</span>
                                ) : (
                                  itemDetails?.status || "active"
                                )}
                              </p>
                            </div>
                            <div className="dashboard-grid-item overflow-hidden">
                              <p className="text-gray-500 text-xs mb-1">Type</p>
                              <p className="font-medium truncate">
                                {itemDetails?.type === "postpaye"
                                  ? "Postpayé"
                                  : "Prépayé"}
                              </p>
                            </div>
                            <div className="dashboard-grid-item overflow-hidden">
                              <p className="text-gray-500 text-xs mb-1">
                                Niveau
                              </p>
                              <p className="font-medium truncate">
                                {itemDetails?.level || ""}
                              </p>
                            </div>
                            <div className="dashboard-grid-item overflow-hidden">
                              <p className="text-gray-500 text-xs mb-1">
                                Statut de rattachement
                              </p>
                              <p className="font-medium truncate">
                                {itemDetails?.statutRattachement || ""}
                              </p>
                            </div>
                            <div className="dashboard-grid-item overflow-hidden">
                              <p className="text-gray-500 text-xs mb-1">
                                Libellé
                              </p>
                              <p className="font-medium truncate">
                                {itemDetails?.label || ""}
                              </p>
                            </div>
                            <div className="dashboard-grid-item overflow-hidden">
                              <p className="text-gray-500 text-xs mb-1">
                                Date facture
                              </p>
                              <p className="font-medium truncate">
                                {lastInvoice?.dateFacture
                                  ? new Date(
                                    lastInvoice.dateFacture
                                  ).toLocaleDateString()
                                  : ""}
                              </p>
                            </div>
                            <div className="dashboard-grid-item col-span-2 overflow-hidden">
                              <p className="text-gray-500 text-xs mb-1">
                                Période de consommation
                              </p>
                              <p className="font-medium truncate">
                                {lastInvoice?.dateDebutConso
                                  ? `${new Date(
                                    lastInvoice.dateDebutConso
                                  ).toLocaleDateString()} - ${new Date(
                                    lastInvoice.dateFinConso
                                  ).toLocaleDateString()}`
                                  : ""}
                              </p>
                            </div>
                            <div className="dashboard-grid-item col-span-2 overflow-hidden">
                              <p className="text-gray-500 text-xs mb-1">Slug</p>
                              <p className="font-medium truncate">
                                {itemDetails?.slug || ""}
                              </p>
                            </div>
                            <div className="dashboard-grid-item col-span-2 overflow-hidden">
                              <p className="text-gray-500 text-xs mb-1">
                                Date de création
                              </p>
                              <p className="font-medium truncate">
                                {itemDetails?.createdAt
                                  ? new Date(
                                    itemDetails.createdAt
                                  ).toLocaleDateString()
                                  : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : isLoadingDetails || isLoadingInvoice ? (
                      <div className="lg:col-span-5 dashboard-card p-8 flex justify-center items-center">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 border-t-4 border-orange-500 rounded-full animate-spin mb-4"></div>
                          <p className="text-gray-600">
                            Chargement des détails...
                          </p>
                        </div>
                      </div>
                    ) : null}

                    {/* Conteneur pour les composants de droite */}
                    <div className="lg:col-span-7 relative overflow-hidden max-w-full">
                      <div className="relative">
                        {/* Blur overlay */}
                        {itemDetails &&
                          itemDetails.level !== 2 ? (
                          <div className="absolute inset-0 bg-white/50 backdrop-blur-md rounded-xl flex flex-col items-center justify-center" style={{ zIndex: 5 }}>
                            <p className="text-[#151515] text-[20px] font-semibold mb-4">
                              Faites un pas de plus vers plus de sérénité et de
                              contrôle !
                            </p>
                            <button
                              className="text-white font-semibold py-3 px-8 rounded-full flex items-center gap-2 hover:shadow-lg transition-all duration-300 bg-gradient-postpaid"
                              style={{ zIndex: 5 }}
                              onClick={() => setIsLevel2ModalOpen(true)}
                            >
                              <svg
                                width="17"
                                height="21"
                                viewBox="0 0 17 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="animate-bounce"
                                style={{ zIndex: 5 }}
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M5.5 5.50012C5.4988 4.76908 5.76457 4.06275 6.24739 3.51384C6.73021 2.96492 7.39684 2.61119 8.12206 2.5191C8.84728 2.427 9.58117 2.60288 10.1859 3.01369C10.7906 3.42451 11.2244 4.04198 11.406 4.75012C11.4769 5.00176 11.6435 5.21564 11.8701 5.34594C12.0968 5.47624 12.3655 5.5126 12.6186 5.44722C12.8717 5.38185 13.0892 5.21994 13.2244 4.99619C13.3596 4.77243 13.4018 4.50462 13.342 4.25012C13.0352 3.07419 12.3108 2.05016 11.3042 1.36935C10.2975 0.688529 9.07736 0.397496 7.87176 0.550616C6.66616 0.703735 5.55754 1.29053 4.75301 2.20139C3.94848 3.11224 3.50307 4.28484 3.5 5.50012V7.50012H1.5C1.23478 7.50012 0.98043 7.60548 0.792893 7.79301C0.605357 7.98055 0.5 8.2349 0.5 8.50012L0.5 17.5001C0.5 18.2958 0.816071 19.0588 1.37868 19.6214C1.94129 20.184 2.70435 20.5001 3.5 20.5001H13.5C14.2956 20.5001 15.0587 20.184 15.6213 19.6214C16.1839 19.0588 16.5 18.2958 16.5 17.5001V8.50012C16.5 8.2349 16.3946 7.98055 16.2071 7.79301C16.0196 7.60548 15.7652 7.50012 15.5 7.50012H5.5V5.50012ZM9.5 14.0001C9.5 13.6023 9.65804 13.2208 9.93934 12.9395C10.2206 12.6582 10.6022 12.5001 11 12.5001H11.01C11.4078 12.5001 11.7894 12.6582 12.0707 12.9395C12.352 13.2208 12.51 13.6023 12.51 14.0001V14.0101C12.51 14.4079 12.352 14.7895 12.0707 15.0708C11.7894 15.3521 11.4078 15.5101 11.01 15.5101H11C10.6022 15.5101 10.2206 15.3521 9.93934 15.0708C9.65804 14.7895 9.5 14.4079 9.5 14.0101V14.0001Z"
                                  fill="white"
                                />
                              </svg>
                              Débloquer mes avantages
                            </button>
                          </div>
                        ) : null}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative overflow-hidden">
                          {/* Historique de consommation */}
                          <div className="dashboard-card transition-all duration-300">
                            <div className="dashboard-header">
                              <p className="text-base font-semibold text-gray-800 ml-6 mt-2">
                                Historique de consommation
                              </p>
                              {isLoadingInvoice && (
                                <div className="dashboard-pill">
                                  Chargement...
                                </div>
                              )}
                            </div>
                            <div className="p-5">
                              <ConsumptionBarChart lastInvoice={lastInvoice} />
                            </div>
                          </div>

                          {/* Ma consommation */}
                          <div className="dashboard-card transition-all duration-300">
                            <div className="dashboard-header">
                              <p className="text-base font-semibold text-gray-800 ml-6 mt-2">
                                Ma consommation
                              </p>
                              {isLoadingDetails && (
                                <div className="dashboard-pill">
                                  Chargement...
                                </div>
                              )}
                            </div>
                            <div className="p-5">
                              {/* Grand titre kWh */}
                              <div className="text-center mb-6">
                                <h2 className="text-4xl sm:text-5xl font-bold gradient-green-text inline-flex items-center">
                                  {lastInvoice?.kwhEnregistre ||
                                    itemDetails?.consommation?.actuelle ||
                                    "428"}
                                  <span className="text-lg ml-2 text-vert font-medium">
                                    kWh
                                  </span>
                                </h2>
                              </div>

                              {/* Barres de progression */}
                              <div className="space-y-3 mb-6">
                                {/* Ma conso - barre jaune */}
                                <div className="bg-gray-100 h-3 rounded-full overflow-hidden mb-1">
                                  <div
                                    className="bg-jaune h-3 rounded-full animate-fadeIn"
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        ((lastInvoice?.kwhEnregistre ||
                                          itemDetails?.consommation?.actuelle ||
                                          428) /
                                          (itemDetails?.consommation
                                            ?.similaire || 347)) *
                                        100
                                      )}%`,
                                    }}
                                  ></div>
                                </div>

                                {/* Foyer similaire - barre verte */}
                                <div className="bg-gray-100 h-3 rounded-full overflow-hidden">
                                  <div className="bg-vert h-3 rounded-full w-full"></div>
                                </div>
                              </div>

                              {/* Informations détaillées */}
                              <div className="grid grid-cols-2 gap-4">
                                {/* Colonne gauche - Ma consommation */}
                                <div className="space-y-1">
                                  <div className="flex items-center">
                                    <div className="bg-jaune rounded-sm w-[6px] h-5 mr-2"></div>
                                    <span className="text-sm font-semibold text-noir">
                                      {lastInvoice?.kwhEnregistre ||
                                        itemDetails?.consommation?.actuelle ||
                                        "428"}{" "}
                                      <span className="font-medium">kWh</span>
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 ml-8">
                                    Ma conso
                                  </p>

                                  {lastInvoice?.dateDebutConso && lastInvoice?.dateFinConso && (
                                    <p className="text-xs text-gray-600 ml-8">
                                      {`${new Date(lastInvoice.dateDebutConso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })} - 
                                      ${new Date(lastInvoice.dateFinConso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`}
                                    </p>
                                  )}
                                </div>

                                {/* Colonne droite - Index et foyers similaires */}
                                <div className="space-y-1">
                                  <div className="flex items-center">
                                    <div className="bg-vert rounded-sm w-[6px] h-5 mr-2"></div>
                                    <span className="text-sm font-semibold text-noir">
                                      {itemDetails?.consommation?.similaire || "347"}{" "}
                                      <span className="font-medium">kWh</span>
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 ml-8">
                                    Foyer similaires
                                  </p>

                                  {lastInvoice?.indexAncien && lastInvoice?.indexNvl && (
                                    <p className="text-xs text-gray-600 ml-8">
                                      Index {lastInvoice.indexAncien} → {lastInvoice.indexNvl}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Factures - S'affiche uniquement pour les compteurs postpayés avec les données chargées */}
                      {selectedItem.type === "postpaid" && (
                        <Factures
                          lastInvoice={lastInvoice}
                          isLoading={isLoadingInvoice}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center px-8 py-10 gap-5 mb-8 bg-gradient-to-r from-[#F7942E]/20 to-amber-50 rounded-xl shadow-sm border border-orange-100 relative overflow-hidden">
                  {/* Decorative bubbles */}
                  <div className="absolute top-6 left-8 w-16 h-16 rounded-full bg-[#F7942E]/10 animate-float"></div>
                  <div className="absolute bottom-8 right-10 w-12 h-12 rounded-full bg-[#F7942E]/15 animate-float-delayed"></div>
                  <div className="absolute top-1/3 right-8 w-8 h-8 rounded-full bg-[#F7942E]/15 animate-float-slow"></div>
                  <div className="absolute bottom-10 left-12 w-10 h-10 rounded-full bg-[#F7942E]/10 animate-float-slow"></div>
                  <div className="absolute top-1/2 left-1/3 w-5 h-5 rounded-full bg-[#F7942E]/20 animate-float"></div>
                  <div className="absolute top-1/4 right-1/4 w-7 h-7 rounded-full bg-[#F7942E]/10 animate-float-delayed"></div>

                  <div className="relative z-10">
                    <Image
                      src="/compteur/compteurgif.gif"
                      alt="Aucun compteur sélectionné"
                      width={160}
                      height={160}
                      className="object-contain transition-transform duration-300 hover:scale-110 hover:rotate-3 mb-4"
                    />
                  </div>

                  <div className="relative z-10 backdrop-blur-sm bg-white/30 px-6 py-5 rounded-xl">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">Aucun compteur sélectionné</h3>
                      <p className="text-gray-600">
                        Sélectionnez un compteur existant ou rattachez-en un nouveau<br />
                        pour accéder à ses informations détaillées.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {isDemandeModalOpen && (
        <ModalDEmande onClose={() => setIsDemandeModalOpen(false)} />
      )}

      {/* Level 2 Attachment Modal */}
      <Modal
        isOpen={isLevel2ModalOpen}
        onClose={() => setIsLevel2ModalOpen(false)}
        title="Saisir votre index de compteur"
        size="md"
        hasCloseBtn={true}
        scrollbarWidth="none"
        className="overflow-auto"
      >
        <div
          className="overflow-y-auto"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          <Level2Form
            onSubmit={handleLevel2Attachment}
            onCancel={() => setIsLevel2ModalOpen(false)}
            isLoading={isLoading}
            itemType={selectedItem.type || "postpaid"}
          />
        </div>
      </Modal>

      <Modal
        isOpen={isRattachementModalOpen}
        onClose={() => setIsRattachementModalOpen(false)}
        title={
          rattachementType === "postpaid"
            ? "Rattacher un identifiant"
            : "Rattacher un compteur"
        }
        size="lg"
        hasCloseBtn={true}
        scrollbarWidth="none"
        className="overflow-auto"
      >
        <div className="overflow-y-auto"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {/* Header decorative element with dynamic color */}
          <div className="flex items-center mb-6 p-1">
            <div className={`h-1 w-1/3 bg-gradient-to-r ${rattachementType === "postpaid"
              ? "from-[#F7942E]/60 to-[#F7942E]/20"
              : "from-[#56C1B5]/60 to-[#56C1B5]/20"
              } rounded-full`}></div>
            <div className={`mx-2 h-6 w-6 rounded-full ${rattachementType === "postpaid"
              ? "bg-[#F7942E]/10"
              : "bg-[#56C1B5]/10"
              } flex items-center justify-center`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 5L21 5M21 5L21 13M21 5L13 13" stroke={rattachementType === "postpaid" ? "#F7942E" : "#56C1B5"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11 3H7.8C5.11984 3 3.77976 3 2.76972 3.49873C1.8805 3.9382 1.1382 4.8805 0.698732 5.76972C0.2 6.77976 0.2 8.11984 0.2 10.8V16.2C0.2 18.8802 0.2 20.2202 0.698732 21.2303C1.1382 22.1195 1.8805 23.0618 2.76972 23.5013C3.77976 24 5.11984 24 7.8 24H13.2C15.8802 24 17.2202 24 18.2303 23.5013C19.1195 23.0618 20.0618 22.1195 20.5013 21.2303C21 20.2202 21 18.8802 21 16.2V13" stroke={rattachementType === "postpaid" ? "#F7942E" : "#56C1B5"} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className={`h-1 flex-grow bg-gradient-to-r ${rattachementType === "postpaid"
              ? "from-[#F7942E]/20"
              : "from-[#56C1B5]/20"
              } to-transparent rounded-full`}></div>
          </div>

          {/* Type icon */}
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${rattachementType === "postpaid"
              ? "bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200"
              : "bg-gradient-to-br from-green-50 to-green-100 border border-green-200"
              }`}>
              {rattachementType === "postpaid" ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 5H3C1.89543 5 1 5.89543 1 7V17C1 18.1046 1.89543 19 3 19H21C22.1046 19 23 18.1046 23 17V7C23 5.89543 22.1046 5 21 5Z" stroke="#F7942E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M1 10H23" stroke="#F7942E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15.5H7.5C6.10444 15.5 5.40665 15.5 4.83886 15.6722C3.56045 16.06 2.56004 17.0605 2.17224 18.3389C2 18.9067 2 19.6044 2 21M19 21V15M16 18H22M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z" stroke="#56C1B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>

          {/* Description text */}
          <div className="mb-6 px-1 text-center">
            <h4 className={`text-base font-medium mb-2 ${rattachementType === "postpaid"
              ? "text-[#F7942E]"
              : "text-[#56C1B5]"
              }`}>
              {rattachementType === "postpaid"
                ? "Accès à vos informations de facturation"
                : "Suivi en temps réel de votre consommation"
              }
            </h4>
            <p className="text-gray-600 text-sm">
              {rattachementType === "postpaid"
                ? "Rattachez un identifiant à votre compte pour accéder à vos factures, historiques et services."
                : "Rattachez un compteur à votre compte pour suivre votre consommation et optimiser votre utilisation."
              }
            </p>
          </div>

          {/* Form container with subtle background */}
          <div className={`bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border ${rattachementType === "postpaid"
            ? "border-orange-100/30"
            : "border-green-100/30"
            } shadow-sm`}>
            {rattachementType === "postpaid" ? (
              <RattacherCompteurForm
                onSubmit={handleRattachementSubmit}
                onCancel={() => setIsRattachementModalOpen(false)}
                colorTheme="orange"
              />
            ) : (
              <RattacherIdentifiantForm
                onSubmit={handleRattachementSubmit}
                onCancel={() => setIsRattachementModalOpen(false)}
                colorTheme="green"
              />
            )}
          </div>

          {/* Footer note */}
          <div className="mt-4 px-1">
            <p className="text-xs text-gray-500 italic flex items-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1.5">
                <path d="M13 16H12V12H11M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke={rattachementType === "postpaid" ? "#F7942E" : "#56C1B5"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Assurez-vous de saisir les informations correctes pour faciliter le rattachement.
            </p>
          </div>
        </div>
      </Modal>

      {/* Modales existantes conservées pour compatibilité, mais masquées */}
      <div style={{ display: "none" }}>
        <Modal
          isOpen={isCompteurModalOpen}
          onClose={() => setIsCompteurModalOpen(false)}
          title="Rattacher un identifiant"
          size="lg"
          hasCloseBtn={true}
          scrollbarWidth="none"
          className="overflow-auto"
        >
          <div
            className="overflow-y-auto"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            <RattacherCompteurForm
              onSubmit={handleCompteurSubmit}
              onCancel={() => setIsCompteurModalOpen(false)}
            />
          </div>
        </Modal>

        <Modal
          isOpen={isIdentifiantModalOpen}
          onClose={() => setIsIdentifiantModalOpen(false)}
          title="Rattacher un compteur"
          size="lg"
          hasCloseBtn={true}
          scrollbarWidth="none"
          className="overflow-auto"
        >
          <div
            className="overflow-y-auto"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            <RattacherIdentifiantForm
              onSubmit={handleIdentifiantSubmit}
              onCancel={() => setIsIdentifiantModalOpen(false)}
            />
          </div>
        </Modal>
      </div>

      {/* Modal "En cours de développement" pour les réclamations */}
      {isReclModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
            onClick={() => setIsReclModalOpen(false)}
          ></div>

          <div className="relative w-[600px] bg-gradient-to-b from-[#F8F9F9] to-[#E0F2FE] h-full shadow-2xl overflow-auto flex flex-col rounded-l-3xl transform transition-all duration-500 animate-slideInRight">
            {/* HEADER */}
            <div className="flex items-center justify-between p-6 border-b border-blue-100 bg-white/80 backdrop-blur-sm">
              <h2 className="text-2xl font-semibold text-gray-800 text-center flex-1">
                Faire une réclamation
              </h2>
              {/* Bouton de fermeture */}
              <button
                type="button"
                onClick={() => setIsReclModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full shadow-md cursor-pointer hover:bg-gray-100/80 transition-all duration-300 hover:scale-110"
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

            {/* CONTENU */}
            <div className="flex flex-col items-center justify-center flex-1 p-8 relative overflow-hidden">
              {/* Background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-[#F7942E]/10 animate-gradientShift"></div>

              {/* Illustration en SVG - Améliorée */}
              <div className="w-80 h-80 mb-8 relative hover:scale-105 transition-transform duration-300 z-10">
                <div className="absolute inset-0 bg-[#F7942E]/10 rounded-full animate-pulse-slow"></div>
                <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
                  {/* Fond */}
                  <defs>
                    <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="#F8FAFC" />
                      <stop offset="100%" stopColor="#E0F2FE" />
                    </radialGradient>
                  </defs>
                  <circle cx="200" cy="200" r="130" fill="url(#bgGradient)" />
                  <circle cx="200" cy="200" r="110" fill="#E0F2FE" />

                  {/* Engrenage 1 */}
                  <g transform="translate(170, 170)" className="animate-spin" style={{ animationDuration: '15s' }}>
                    <circle cx="0" cy="0" r="38" fill="#4ECDC4" opacity="0.2" />
                    <path fill="#4ECDC4" d="M38,10.8c-1.5-2.8-3.4-5.4-5.6-7.6l2.9-10.4l-11.2-6.4l-7.4,7.8c-3.1-0.8-6.3-1.1-9.5-0.8l-5.8-9.5 l-12.1,3.1l0.4,11.7c-2.3,1.9-4.3,4.2-5.9,6.8L-28-2l-8.5,9l5.8,10.2c-0.8,3.1-1,6.3-0.7,9.5l-11.1,6.4l3.1,12.1L-28,46 c1.8,2.3,4,4.3,6.5,5.9l-2.9,10.4l11.2,6.4l7.9-8.3c3,0.8,6,1,9.1,0.7l6.4,11.1l12.1-3.1l-0.9-11.7c2.3-1.9,4.3-4.1,5.9-6.6l10.7,2.5 l8.5-9l-5.8-10.2c0.8-3,1-6.1,0.7-9.2l11.1-6.4l-3.1-12.1L38,10.8z M41.8,62.3c-16.7,4.3-33.8-5.8-38.2-22.6C-0.7,23-9.5,5.9,7.2,1.6C24-2.8,41,7.4,45.4,24.2C49.8,41,58.5,58,41.8,62.3z" />
                  </g>

                  {/* Engrenage 2 */}
                  <g transform="translate(230, 220)" className="animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }}>
                    <circle cx="0" cy="0" r="28" fill="#EC4F48" opacity="0.2" />
                    <path fill="#EC4F48" opacity="0.8" d="M28.5,8.1c-1.1-2.1-2.6-4-4.2-5.7l2.2-7.8l-8.4-4.8l-5.6,5.9c-2.3-0.6-4.7-0.8-7.1-0.6l-4.4-7.1l-9.1,2.3 l0.3,8.8c-1.7,1.4-3.2,3.2-4.4,5.1l-8-1.5l-6.4,6.8l4.4,7.7c-0.6,2.3-0.8,4.7-0.5,7.1l-8.3,4.8l2.3,9.1l8.8-0.7 c1.4,1.7,3,3.2,4.9,4.4l-2.2,7.8l8.4,4.8l5.9-6.2c2.3,0.6,4.5,0.8,6.8,0.5l4.8,8.3l9.1-2.3l-0.7-8.8c1.7-1.4,3.2-3.1,4.4-5l8,1.9 l6.4-6.8l-4.4-7.7c0.6-2.3,0.8-4.6,0.5-6.9l8.3-4.8l-2.3-9.1L28.5,8.1z M2.4,33.4c-9.9,2.5-20-3.4-22.6-13.3S-16.8,0.1-6.9-2.5 S13.1,0.9,15.7,10.8S12.3,30.9,2.4,33.4z" />
                  </g>

                  {/* Engrenage 3 - Petit engrenage */}
                  <g transform="translate(190, 260)" className="animate-spin" style={{ animationDuration: '7s' }}>
                    <circle cx="0" cy="0" r="15" fill="#FFA755" opacity="0.2" />
                    <path fill="#FFA755" opacity="0.7" d="M15,4c-0.6-1-1.3-2-2.1-2.8l1.1-3.9l-4.2-2.4l-2.8,2.9c-1.2-0.3-2.4-0.4-3.6-0.3l-2.2-3.6l-4.5,1.2l0.1,4.4 c-0.9,0.7-1.6,1.6-2.2,2.6l-4-0.8l-3.2,3.4l2.2,3.8c-0.3,1.2-0.4,2.4-0.3,3.6l-4.2,2.4l1.2,4.5l4.4-0.3c0.7,0.9,1.5,1.6,2.5,2.2 l-1.1,3.9l4.2,2.4l3-3.1c1.1,0.3,2.3,0.4,3.4,0.3l2.4,4.2l4.5-1.2l-0.3-4.4c0.9-0.7,1.6-1.5,2.2-2.5l4,0.9l3.2-3.4l-2.2-3.8 c0.3-1.1,0.4-2.3,0.3-3.5l4.2-2.4l-1.2-4.5L15,4z M1.2,16.7c-5,1.3-10-1.7-11.3-6.6c-1.3-5,1.7-10,6.6-11.3s10,1.7,11.3,6.6 C9.1,10.3,6.1,15.4,1.2,16.7z" />
                  </g>

                  {/* Engrenage 4 - Nouveau petit engrenage supplémentaire */}
                  <g transform="translate(130, 210)" className="animate-spin" style={{ animationDuration: '12s' }}>
                    <circle cx="0" cy="0" r="13" fill="#38BDF8" opacity="0.2" />
                    <path fill="#38BDF8" opacity="0.6" d="M13,3.5c-0.5-0.9-1.1-1.7-1.8-2.4l0.9-3.3l-3.6-2l-2.4,2.5c-1-0.3-2-0.3-3-0.2l-1.9-3l-3.9,1l0.1,3.7 c-0.7,0.6-1.4,1.3-1.9,2.2l-3.4-0.7l-2.7,2.8l1.9,3.2c-0.3,1-0.3,2-0.2,3l-3.5,2l1,3.9l3.7-0.3c0.6,0.7,1.3,1.4,2.1,1.9l-0.9,3.3 l3.6,2l2.5-2.6c0.9,0.3,1.9,0.3,2.9,0.2l2,3.5l3.9-1l-0.3-3.7c0.7-0.6,1.4-1.3,1.9-2.1l3.4,0.8l2.7-2.8l-1.9-3.2 c0.2-1,0.3-1.9,0.2-2.9l3.5-2l-1-3.9L13,3.5z M1,14.2c-4.2,1.1-8.5-1.4-9.6-5.7c-1.1-4.2,1.4-8.5,5.7-9.6s8.5,1.4,9.6,5.7 C7.8,8.8,5.2,13.1,1,14.2z" />
                  </g>

                  {/* Panneau de construction - Amélioré */}
                  <g transform="translate(115, 160)" className="animate-bounce-gentle">
                    <rect x="0" y="0" width="170" height="80" rx="12" fill="white" filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.1))" />
                    <rect x="3" y="3" width="164" height="74" rx="9" fill="none" stroke="#EC4F48" strokeWidth="5" />
                    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#333333" />
                      <stop offset="100%" stopColor="#555555" />
                    </linearGradient>
                    <text x="85" y="30" textAnchor="middle" fontWeight="bold" fontSize="17" fill="url(#textGradient)">EN COURS DE</text>
                    <text x="85" y="55" textAnchor="middle" fontWeight="bold" fontSize="17" className="animate-pulse-slow" fill="url(#textGradient)">DÉVELOPPEMENT</text>

                    {/* Icône de construction - Améliorée avec animation */}
                    <g transform="translate(20, -30) scale(0.8)" className="animate-rockConstruction">
                      <path fill="#FFA755" d="M36,34.5v-8.7l-6.8,3.8C29.4,30.6,29.6,31.6,30,32.5c0.9,2.1,3.3,3,5.4,2.1C35.6,34.5,35.8,34.5,36,34.5z" />
                      <path fill="#FFA755" d="M44.1,11.3C43.7,10.5,43,10,42,10H12c-1,0-1.7,0.5-2.1,1.3c-0.4,0.8-0.3,1.7,0.3,2.4l7.5,10.1v8
                      c0,0.5,0.2,1,0.5,1.4l8,10c0.5,0.6,1.2,0.9,2,0.9h0c0.8,0,1.5-0.3,2-0.9l8-10c0.3-0.4,0.5-0.9,0.5-1.4v-8l7.5-10.1
                      C44.4,13,44.5,12,44.1,11.3z M32,28c0,0.6-0.4,1-1,1h-8c-0.6,0-1-0.4-1-1v-7c0-0.6,0.4-1,1-1h8c0.6,0,1,0.4,1,1V28z"/>
                    </g>
                  </g>
                </svg>
              </div>

              <div className="text-center max-w-lg bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-blue-50 z-10 animate-fadeInUp">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-6">
                  Module de réclamation en construction
                </h3>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  Notre équipe technique travaille actuellement sur cette fonctionnalité.
                  Elle sera disponible très prochainement pour vous permettre de soumettre vos réclamations.
                </p>
                <button
                  onClick={() => setIsReclModalOpen(false)}
                  className="bg-gradient-to-r from-[#EC4F48] to-[#BB2E29] text-white py-3 px-10 rounded-xl font-semibold hover:brightness-110 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 active:shadow-md"
                >
                  Compris
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
