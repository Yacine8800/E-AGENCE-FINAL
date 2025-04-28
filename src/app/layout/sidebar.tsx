"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

import Loader from "../components/animation/loader";
import { useAuth } from "@/src/hooks/useAuth";
import LogoutIcon from "../components/icons/LogoutIcon";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hook d'auth
  const { logout: handleLogout, isLogoutLoading, user } = useAuth();

  // Éviter le problème d'hydratation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Détection mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <>
      {/* Bouton hamburger (mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 lg:hidden bg-white p-2 rounded-full shadow-lg"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Container principal */}
      <div
        className={`fixed 
          ${isMobile ? "top-0 bottom-0" : "lg:inset-y-6"} 
          left-0 
          lg:left-6
          flex 
          flex-col 
          gap-4 
          transition-all 
          duration-300 
          ease-in-out 
          bg-transparent
          ${isOpen || !isMobile
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
          }
        `}
        style={{ width: isMobile ? "100%" : "320px" }}
      >
        {/* Logo */}
        <div className="flex-none w-full bg-colorbaseSidebar px-4 lg:px-[30px] py-4 lg:py-[20px] rounded-none lg:rounded-[20px] flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="MailIE Logo"
            width={120}
            height={48}
            className="object-contain w-auto h-8 lg:h-auto"
          />
        </div>

        {/* Conteneur flex-col pour que le bouton "Déconnexion" soit en bas */}
        <div className="flex-1 flex flex-col bg-colorbaseSidebar p-4 lg:p-[20px] rounded-none lg:rounded-[20px] relative overflow-y-auto">
          <div className="absolute bottom-0 left-0 w-1/2 h-1/3 bg-colorsecondSidebar rounded-tr-[100px] blur-[40px] rounded-bl-[20px] opacity-70 z-0" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/4 bg-colorsecondSidebar rounded-tr-[80px] blur-[40px] rounded-bl-[20px] z-0" />
          <div className="absolute bottom-5 left-5 w-20 h-20 bg-colorsecondSidebar rounded-full blur-[40px] opacity-40 z-0" />

          {/* Profil utilisateur */}
          <div className="mb-4 bg-white rounded-[40px] lg:rounded-2xl p-3 lg:mb-6 pb-4 lg:pb-6 border-b border-gray-200/30 z-10 relative">
            <div className="flex flex-col items-center">
              <div className="mb-1">
                <div className="bg-blue-200 rounded-full w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center overflow-hidden relative">
                  <Image
                    src="/assets/personne.png"
                    alt="User"
                    width={64}
                    height={64}
                    className="rounded-full"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFMQJ+WCwgQQAAAABJRU5ErkJggg=="
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full border-2 border-white z-50"></div>
                </div>
              </div>

              <h3 className="font-bold text-noir text-xs lg:text-sm mt-1 mb-2">
                {mounted
                  ? user
                    ? `${user.lastname || ""} ${user.firstname || ""}`
                    : "Utilisateur"
                  : "Utilisateur"}
              </h3>
              <p className="text-xs font-medium text-noir mb-1">
                {mounted
                  ? user?.email || "Email non disponible"
                  : "Email non disponible"}
              </p>
              <p className="text-xs font-medium text-noir">
                {mounted
                  ? user?.contact || "Contact non disponible"
                  : "Contact non disponible"}
              </p>

            </div>
          </div>

          {/* Exemple de "Taux de complétion" ou autres sections */}
          <div className="mb-4 lg:mb-6 z-10 relative">
            <div className="bg-white p-[30px] rounded-[20px] shadow-sm w-full flex flex-col gap-[20px]">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[9px] sm:text-[14px] font-bold text-gray-600">
                    Taux de complétion de votre compte
                  </p>
                </div>
                <div className="w-full flex justify-between items-center">
                  <div className="w-full mr-2 flex flex-row items-center h-1.5 bg-gray-200 rounded-full">
                    <div
                      className="h-1.5 bg-[#27C3B2] rounded-full"
                      style={{ width: "30%" }}
                    />
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-bold text-[#27C3B2]">
                    30%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="mt-[500px] z-10">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="flex items-center justify-center gap-2 bg-white rounded-xl lg:rounded-2xl p-3 lg:p-4 w-full hover:bg-red-50 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="text-rouge z-10">
                <LogoutIcon className="w-4 h-4 lg:w-5 lg:h-5" color="#EC4F48" />
              </div>
              <span className="font-bold text-rouge text-xs lg:text-sm z-10">
                Déconnexion
              </span>
            </button>
          </div> */}
        </div>
      </div>

      {/* Modal de confirmation de déconnexion */}
      {/* {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full mx-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-yellow-500"></div>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <LogoutIcon className="w-6 h-6" color="#EC4F48" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-center mb-2">
              Confirmer la déconnexion
            </h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              Êtes-vous sûr de vouloir vous déconnecter de votre compte ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-xl text-sm font-medium"
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  setShowLogoutConfirm(false);
                  setIsLoading(true);
                  try {
                    await handleLogout();
                  } catch (error) {
                    console.error("Erreur lors de la déconnexion:", error);
                    window.location.href = "/";
                  }
                }}
                className="flex-1 py-2 px-4 bg-rouge text-white rounded-xl text-sm font-medium"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* Overlay (mobile) */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Loader pour la déconnexion */}
      {(isLoading || isLogoutLoading) && <Loader context="logout" />}
    </>
  );
};

export default Sidebar;
