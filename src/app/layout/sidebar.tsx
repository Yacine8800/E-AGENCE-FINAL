"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, Pencil } from "lucide-react";

import Loader from "../components/animation/loader";
import { useAuth } from "@/src/hooks/useAuth";
import LogoutIcon from "../components/icons/LogoutIcon";
import AccountEditSheet from "./AccountEditSheet";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isIdUploaded, setIsIdUploaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'all' | 'phone' | 'email' | 'id'>('all');

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

  const completion =
    ((isPhoneVerified ? 1 : 0) +
      (isEmailVerified ? 1 : 0) +
      (isIdUploaded ? 1 : 0)) /
    3;
  const completionPercent = Math.round(completion * 100);

  // Classe commune pour le texte des boutons non vérifiés
  const buttonTextClass = "font-bold text-sm text-[#EC4F48] text-left";

  // Utilitaires pour localStorage
  const getAccountStatus = () => {
    if (typeof window === 'undefined') return {};
    try {
      return JSON.parse(localStorage.getItem('accountStatus') || '{}');
    } catch {
      return {};
    }
  };
  const setAccountStatus = (status: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accountStatus', JSON.stringify(status));
    }
  };

  // Initialisation des états depuis localStorage
  useEffect(() => {
    const status = getAccountStatus();
    setIsPhoneVerified(!!status.phoneVerified);
    setIsEmailVerified(!!status.emailVerified);
    setIsIdUploaded(!!status.idVerified);
  }, []);

  // Stocker les valeurs saisies
  const [savedValues, setSavedValues] = useState<{ phone?: string; email?: string; idFile?: string }>({});
  useEffect(() => {
    const status = getAccountStatus();
    setSavedValues({
      phone: status.phoneValue,
      email: status.emailValue,
      idFile: status.idFileValue,
    });
  }, [modalOpen]);

  // Gestion de la soumission du sheet
  const handleAccountEditSubmit = (data: { phone?: string; email?: string; idFile?: string }) => {
    const status = getAccountStatus();
    const newStatus = { ...status };

    if (modalMode === 'all') {
      // En mode 'all', on ne marque comme non vérifié que les champs modifiés
      if (data.phone && data.phone !== status.phoneValue) {
        newStatus.phoneValue = data.phone;
        newStatus.phoneVerified = false;
        setIsPhoneVerified(false);
      }
      if (data.email && data.email !== status.emailValue) {
        newStatus.emailValue = data.email;
        newStatus.emailVerified = false;
        setIsEmailVerified(false);
      }
      if (data.idFile && data.idFile !== status.idFileValue) {
        newStatus.idFileValue = data.idFile;
        newStatus.idVerified = false;
        setIsIdUploaded(false);
      }
    } else {
      // En mode spécifique, on vérifie le champ correspondant
      if (modalMode === 'phone') {
        newStatus.phoneValue = data.phone;
        newStatus.phoneVerified = true;
        setIsPhoneVerified(true);
      }
      if (modalMode === 'email') {
        newStatus.emailValue = data.email;
        newStatus.emailVerified = true;
        setIsEmailVerified(true);
      }
      if (modalMode === 'id') {
        newStatus.idFileValue = data.idFile;
        newStatus.idVerified = true;
        setIsIdUploaded(true);
      }
    }

    // Sauvegarder le nouveau statut
    setAccountStatus(newStatus);
    setModalOpen(false);
  };

  return (
    <>
      {/* Bouton hamburger (mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 lg:hidden bg-white p-2 rounded-full shadow-lg z-50 hover:bg-gray-100 transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <X size={24} className="text-gray-700" />
        ) : (
          <Menu size={24} className="text-gray-700" />
        )}
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
          z-40
          ${
            isOpen || !isMobile
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
        style={{ width: isMobile ? "80vw" : "320px", maxWidth: "320px" }}
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
              <div className="mb-1 relative flex items-center gap-2">
                <div className="bg-blue-200 rounded-full w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center relative">
                  <Image
                    src="/assets/personne.png"
                    alt="User"
                    width={64}
                    height={64}
                    className="rounded-full"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFMQJ+WCwgQQAAAABJRU5ErkJggg=="
                  />
                  {!(isPhoneVerified && isEmailVerified && isIdUploaded) && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full border-2 border-white z-50"></div>
                  )}
                  {(isPhoneVerified && isEmailVerified && isIdUploaded) && (
                    <span
                      className="absolute"
                      style={{
                        bottom: '-12px',
                        right: '-12px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M6.10232 0.73156L5.46763 1.1975C5.35581 1.2867 5.23734 1.36725 5.11326 1.43843C5.0297 1.48285 4.94212 1.51927 4.8517 1.54718C4.74951 1.57812 4.64357 1.59406 4.43076 1.62687L3.65263 1.74593C3.03857 1.83968 2.73107 1.8875 2.49013 2.03093C2.27451 2.1575 2.09545 2.3375 1.96795 2.55312C1.82451 2.79687 1.77763 3.10437 1.68295 3.71562L1.56388 4.49375C1.53107 4.70656 1.51513 4.81343 1.4842 4.91562C1.45607 5.00625 1.41982 5.09312 1.37545 5.17625C1.32482 5.27 1.26201 5.35718 1.13451 5.53062L0.668571 6.16531C0.301071 6.66593 0.117321 6.91625 0.0460715 7.18718C-0.0153572 7.42929 -0.0153572 7.68289 0.0460715 7.925C0.116384 8.19875 0.301071 8.45 0.668571 8.94687L1.13451 9.58156C1.26201 9.755 1.32576 9.84218 1.37545 9.93593C1.4192 10.0197 1.45545 10.1072 1.4842 10.1984C1.51513 10.2997 1.53107 10.4056 1.56388 10.6184L1.68295 11.3966C1.7767 12.0106 1.82451 12.3172 1.96795 12.5591C2.09451 12.7747 2.27451 12.9537 2.49013 13.0812C2.73388 13.2247 3.04138 13.2716 3.65263 13.3662L4.43076 13.4853C4.64357 13.5181 4.75045 13.535 4.8517 13.5659C4.94232 13.5934 5.02951 13.6297 5.11326 13.6747C5.20701 13.7244 5.2942 13.7872 5.46763 13.9156L6.10232 14.3816C6.60295 14.7491 6.85326 14.9328 7.1242 15.0041C7.36607 15.0669 7.62013 15.0669 7.86201 15.0041C8.13576 14.9328 8.38701 14.7491 8.88388 14.3816L9.51857 13.9156C9.69201 13.7881 9.77919 13.7244 9.87294 13.6747C9.95669 13.6297 10.0439 13.5934 10.1345 13.5659C10.2367 13.535 10.3426 13.5191 10.5554 13.4853L11.3336 13.3662C11.9476 13.2725 12.2542 13.2256 12.4961 13.0812C12.7117 12.9547 12.8917 12.7747 13.0183 12.5591C13.1617 12.3153 13.2086 12.0078 13.3033 11.3966L13.4223 10.6184C13.4551 10.4056 13.4711 10.2997 13.502 10.1975C13.5301 10.1069 13.5664 10.0197 13.6108 9.93593C13.6614 9.84218 13.7242 9.755 13.8517 9.58156L14.3176 8.94687C14.6851 8.44625 14.8689 8.19687 14.9401 7.925C15.0016 7.68289 15.0016 7.42929 14.9401 7.18718C14.8698 6.91343 14.6851 6.66218 14.3176 6.16531L13.8517 5.53062C13.7625 5.4188 13.6819 5.30033 13.6108 5.17625C13.5663 5.09268 13.5299 5.00511 13.502 4.91468C13.4648 4.7766 13.4381 4.63588 13.4223 4.49375L13.3033 3.71562C13.2095 3.10156 13.1617 2.79406 13.0183 2.55312C12.8904 2.33826 12.7109 2.15876 12.4961 2.03093C12.2523 1.8875 11.9448 1.84062 11.3336 1.74593L10.5554 1.62687C10.4133 1.61105 10.2726 1.58441 10.1345 1.54718C10.0439 1.51983 9.95625 1.4834 9.87294 1.43843C9.74886 1.36725 9.6304 1.2867 9.51857 1.1975L8.88388 0.73156C8.38326 0.36406 8.13295 0.18031 7.86201 0.10906C7.61991 0.0476311 7.3663 0.0476311 7.1242 0.10906C6.85045 0.18031 6.5992 0.36406 6.10232 0.73156ZM11.0992 5.80343C11.1535 5.73725 11.1939 5.66086 11.2181 5.57878C11.2423 5.4967 11.2499 5.4106 11.2403 5.32556C11.2306 5.24052 11.2041 5.15828 11.1621 5.08368C11.1202 5.00908 11.0637 4.94365 10.9961 4.89125C10.8584 4.78357 10.6842 4.7339 10.5105 4.75281C10.3368 4.77173 10.1773 4.85773 10.0661 4.9925L6.96295 8.79875L5.30357 7.52375C5.16802 7.41343 4.99474 7.36041 4.82067 7.37599C4.64659 7.39158 4.48549 7.47454 4.3717 7.60718C4.3161 7.67224 4.27411 7.74778 4.2482 7.82934C4.2223 7.91089 4.213 7.99682 4.22087 8.08203C4.22873 8.16724 4.2536 8.25001 4.294 8.32545C4.3344 8.40089 4.38951 8.46747 4.45607 8.52125L6.63107 10.2181C6.76842 10.3298 6.94438 10.3827 7.12056 10.3651C7.29673 10.3476 7.4588 10.261 7.57138 10.1244L11.0964 5.79312L11.0992 5.80343Z" fill="#009640"/>
                      </svg>
                    </span>
                  )}
                </div>
                {/* Icône crayon */}
                <button
                  className="bg-white rounded-full p-1 shadow hover:bg-gray-100 transition"
                  onClick={() => { setModalMode('all'); setModalOpen(true); }}
                  aria-label="Modifier le profil"
                >
                  <Pencil size={16} className="text-gray-500" />
                </button>
              </div>

              <h3 className="font-bold text-noir text-xs lg:text-sm mt-1 mb-2">
                {mounted
                  ? user
                    ? `${user.lastname || ""} ${user.firstname || ""}`
                    : "Utilisateur"
                  : "Utilisateur"}
              </h3>
              <p className="text-xs font-medium text-noir mb-1 flex items-center gap-1">
                {mounted
                  ? (isEmailVerified ? savedValues.email : user?.email) || "Email non disponible"
                  : "Email non disponible"}
                {isEmailVerified && (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8 15.5513C8.98491 15.5513 9.96018 15.3573 10.8701 14.9804C11.7801 14.6035 12.6069 14.051 13.3033 13.3546C13.9997 12.6581 14.5522 11.8313 14.9291 10.9214C15.306 10.0115 15.5 9.03618 15.5 8.05127C15.5 7.06636 15.306 6.09109 14.9291 5.18114C14.5522 4.2712 13.9997 3.44441 13.3033 2.74797C12.6069 2.05153 11.7801 1.49908 10.8701 1.12217C9.96018 0.745263 8.98491 0.55127 8 0.55127C6.01088 0.55127 4.10322 1.34145 2.6967 2.74797C1.29018 4.15449 0.5 6.06215 0.5 8.05127C0.5 10.0404 1.29018 11.948 2.6967 13.3546C4.10322 14.7611 6.01088 15.5513 8 15.5513ZM7.80667 11.0846L11.9733 6.0846L10.6933 5.01794L7.11 9.3171L5.25583 7.4621L4.0775 8.64044L6.5775 11.1404L7.2225 11.7854L7.80667 11.0846Z" fill="#2DAE9F"/>
                  </svg>
                )}
              </p>
              <p className="text-xs font-medium text-noir flex items-center gap-1">
                {mounted
                  ? (isPhoneVerified ? savedValues.phone : user?.contact) || "Contact non disponible"
                  : "Contact non disponible"}
                {isPhoneVerified && (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8 15.5513C8.98491 15.5513 9.96018 15.3573 10.8701 14.9804C11.7801 14.6035 12.6069 14.051 13.3033 13.3546C13.9997 12.6581 14.5522 11.8313 14.9291 10.9214C15.306 10.0115 15.5 9.03618 15.5 8.05127C15.5 7.06636 15.306 6.09109 14.9291 5.18114C14.5522 4.2712 13.9997 3.44441 13.3033 2.74797C12.6069 2.05153 11.7801 1.49908 10.8701 1.12217C9.96018 0.745263 8.98491 0.55127 8 0.55127C6.01088 0.55127 4.10322 1.34145 2.6967 2.74797C1.29018 4.15449 0.5 6.06215 0.5 8.05127C0.5 10.0404 1.29018 11.948 2.6967 13.3546C4.10322 14.7611 6.01088 15.5513 8 15.5513ZM7.80667 11.0846L11.9733 6.0846L10.6933 5.01794L7.11 9.3171L5.25583 7.4621L4.0775 8.64044L6.5775 11.1404L7.2225 11.7854L7.80667 11.0846Z" fill="#2DAE9F"/>
                  </svg>
                )}
              </p>
              {/* Affichage du texte Compte certifié si tout est vérifié */}
              {(isPhoneVerified && isEmailVerified && isIdUploaded) && (
                <>
                  <div className="my-3 border-t border-gray-200/70 w-full" />
                  <div className="text-[#009640] text-sm font-semibold w-full text-left">Compte certifié</div>
                </>
              )}
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
                  <span className="text-[9px] sm:text-[10px] font-bold text-[#27C3B2]">
                    {completionPercent}%
                  </span>
                </div>
                <div className="w-full flex justify-between items-center">
                  <div className="w-full mr-2 flex flex-row items-center h-1.5 bg-gray-200 rounded-full">
                    <div
                      className="h-1.5 bg-[#27C3B2] rounded-full"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {/* Vérification téléphone */}
                {isPhoneVerified ? (
                  <div className="flex items-center justify-between gap-2 rounded-[10px] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.6666 11.968V10.718H2.54492C2.04779 10.718 1.571 10.9154 1.21939 11.2669C0.867784 11.6183 0.670143 12.095 0.669922 12.5922V13.0738C0.669922 13.8172 0.936589 14.5372 1.41992 15.103C2.72409 16.6313 4.71326 17.3863 7.33409 17.3863C8.59353 17.3863 9.70464 17.2113 10.6674 16.8613V15.5113C9.76659 15.9263 8.65909 16.1363 7.33409 16.1363C5.05242 16.1363 3.41409 15.5138 2.36992 14.2913C2.07957 13.9518 1.91999 13.5198 1.91992 13.073V12.5922C1.91992 12.4264 1.98577 12.2674 2.10298 12.1502C2.22019 12.033 2.37916 11.9672 2.54492 11.9672L10.6666 11.968ZM7.33325 0.722168C7.88043 0.722168 8.42225 0.829942 8.92777 1.03934C9.43329 1.24873 9.89262 1.55565 10.2795 1.94256C10.6664 2.32947 10.9734 2.7888 11.1828 3.29432C11.3921 3.79984 11.4999 4.34166 11.4999 4.88883C11.4999 5.43601 11.3921 5.97783 11.1828 6.48335C10.9734 6.98887 10.6664 7.4482 10.2795 7.83511C9.89262 8.22202 9.43329 8.52894 8.92777 8.73833C8.42225 8.94773 7.88043 9.0555 7.33325 9.0555C6.22819 9.0555 5.16838 8.61651 4.38698 7.83511C3.60558 7.05371 3.16659 5.9939 3.16659 4.88883C3.16659 3.78377 3.60558 2.72396 4.38698 1.94256C5.16838 1.16115 6.22819 0.722168 7.33325 0.722168ZM7.33325 1.97217C6.95023 1.97217 6.57096 2.04761 6.2171 2.19419C5.86323 2.34076 5.5417 2.5556 5.27086 2.82644C5.00002 3.09728 4.78518 3.41881 4.63861 3.77267C4.49203 4.12654 4.41659 4.50581 4.41659 4.88883C4.41659 5.27186 4.49203 5.65113 4.63861 6.00499C4.78518 6.35886 5.00002 6.68039 5.27086 6.95123C5.5417 7.22207 5.86323 7.43691 6.2171 7.58348C6.57096 7.73006 6.95023 7.8055 7.33325 7.8055C8.1068 7.8055 8.84867 7.49821 9.39565 6.95123C9.94263 6.40425 10.2499 5.66238 10.2499 4.88883C10.2499 4.11529 9.94263 3.37342 9.39565 2.82644C8.84867 2.27946 8.1068 1.97217 7.33325 1.97217ZM16.7124 7.38467C17.5174 7.38467 18.1708 8.038 18.1708 8.843V16.7597C18.1708 17.1464 18.0171 17.5174 17.7436 17.7909C17.4701 18.0644 17.0992 18.218 16.7124 18.218H12.9583C12.5715 18.218 12.2005 18.0644 11.9271 17.7909C11.6536 17.5174 11.4999 17.1464 11.4999 16.7597V8.843C11.4999 8.038 12.1524 7.38467 12.9583 7.38467H16.7124ZM15.0441 14.8822H14.6274L14.5424 14.888C14.3855 14.9096 14.2427 14.9899 14.1428 15.1128C14.0429 15.2356 13.9933 15.3918 14.0041 15.5498C14.0149 15.7078 14.0852 15.8558 14.2009 15.9639C14.3166 16.072 14.4691 16.1321 14.6274 16.1322H15.0441L15.1291 16.1263C15.286 16.1048 15.4288 16.0244 15.5287 15.9016C15.6287 15.7787 15.6782 15.6226 15.6674 15.4646C15.6566 15.3066 15.5863 15.1586 15.4706 15.0505C15.3549 14.9424 15.2024 14.8822 15.0441 14.8822Z"
                          fill={isPhoneVerified ? "#2DAE9F" : "#EC4F48"}
                        />
                      </svg>
                      <span className="font-bold text-sm text-[#2DAE9F]">
                        N° téléphone vérifié
                      </span>
                    </div>
                    <span>
                      {/* Check SVG fourni par l'utilisateur */}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8 15.5513C8.98491 15.5513 9.96018 15.3573 10.8701 14.9804C11.7801 14.6035 12.6069 14.051 13.3033 13.3546C13.9997 12.6581 14.5522 11.8313 14.9291 10.9214C15.306 10.0115 15.5 9.03618 15.5 8.05127C15.5 7.06636 15.306 6.09109 14.9291 5.18114C14.5522 4.2712 13.9997 3.44441 13.3033 2.74797C12.6069 2.05153 11.7801 1.49908 10.8701 1.12217C9.96018 0.745263 8.98491 0.55127 8 0.55127C6.01088 0.55127 4.10322 1.34145 2.6967 2.74797C1.29018 4.15449 0.5 6.06215 0.5 8.05127C0.5 10.0404 1.29018 11.948 2.6967 13.3546C4.10322 14.7611 6.01088 15.5513 8 15.5513ZM7.80667 11.0846L11.9733 6.0846L10.6933 5.01794L7.11 9.3171L5.25583 7.4621L4.0775 8.64044L6.5775 11.1404L7.2225 11.7854L7.80667 11.0846Z"
                          fill="#2DAE9F"
                        />
                      </svg>
                    </span>
                  </div>
                ) : (
                  <button
                    className="flex items-center gap-3 w-full rounded-[16px] px-4 py-4 bg-[#F9F5F5] cursor-pointer transition"
                    style={{ border: "none" }}
                    onClick={() => { setModalMode('phone'); setModalOpen(true); }}
                    aria-label="Vérifier le téléphone"
                  >
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 19 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.6666 11.968V10.718H2.54492C2.04779 10.718 1.571 10.9154 1.21939 11.2669C0.867784 11.6183 0.670143 12.095 0.669922 12.5922V13.0738C0.669922 13.8172 0.936589 14.5372 1.41992 15.103C2.72409 16.6313 4.71326 17.3863 7.33409 17.3863C8.59353 17.3863 9.70464 17.2113 10.6674 16.8613V15.5113C9.76659 15.9263 8.65909 16.1363 7.33409 16.1363C5.05242 16.1363 3.41409 15.5138 2.36992 14.2913C2.07957 13.9518 1.91999 13.5198 1.91992 13.073V12.5922C1.91992 12.4264 1.98577 12.2674 2.10298 12.1502C2.22019 12.033 2.37916 11.9672 2.54492 11.9672L10.6666 11.968ZM7.33325 0.722168C7.88043 0.722168 8.42225 0.829942 8.92777 1.03934C9.43329 1.24873 9.89262 1.55565 10.2795 1.94256C10.6664 2.32947 10.9734 2.7888 11.1828 3.29432C11.3921 3.79984 11.4999 4.34166 11.4999 4.88883C11.4999 5.43601 11.3921 5.97783 11.1828 6.48335C10.9734 6.98887 10.6664 7.4482 10.2795 7.83511C9.89262 8.22202 9.43329 8.52894 8.92777 8.73833C8.42225 8.94773 7.88043 9.0555 7.33325 9.0555C6.22819 9.0555 5.16838 8.61651 4.38698 7.83511C3.60558 7.05371 3.16659 5.9939 3.16659 4.88883C3.16659 3.78377 3.60558 2.72396 4.38698 1.94256C5.16838 1.16115 6.22819 0.722168 7.33325 0.722168ZM7.33325 1.97217C6.95023 1.97217 6.57096 2.04761 6.2171 2.19419C5.86323 2.34076 5.5417 2.5556 5.27086 2.82644C5.00002 3.09728 4.78518 3.41881 4.63861 3.77267C4.49203 4.12654 4.41659 4.50581 4.41659 4.88883C4.41659 5.27186 4.49203 5.65113 4.63861 6.00499C4.78518 6.35886 5.00002 6.68039 5.27086 6.95123C5.5417 7.22207 5.86323 7.43691 6.2171 7.58348C6.57096 7.73006 6.95023 7.8055 7.33325 7.8055C8.1068 7.8055 8.84867 7.49821 9.39565 6.95123C9.94263 6.40425 10.2499 5.66238 10.2499 4.88883C10.2499 4.11529 9.94263 3.37342 9.39565 2.82644C8.84867 2.27946 8.1068 1.97217 7.33325 1.97217ZM16.7124 7.38467C17.5174 7.38467 18.1708 8.038 18.1708 8.843V16.7597C18.1708 17.1464 18.0171 17.5174 17.7436 17.7909C17.4701 18.0644 17.0992 18.218 16.7124 18.218H12.9583C12.5715 18.218 12.2005 18.0644 11.9271 17.7909C11.6536 17.5174 11.4999 17.1464 11.4999 16.7597V8.843C11.4999 8.038 12.1524 7.38467 12.9583 7.38467H16.7124ZM15.0441 14.8822H14.6274L14.5424 14.888C14.3855 14.9096 14.2427 14.9899 14.1428 15.1128C14.0429 15.2356 13.9933 15.3918 14.0041 15.5498C14.0149 15.7078 14.0852 15.8558 14.2009 15.9639C14.3166 16.072 14.4691 16.1321 14.6274 16.1322H15.0441L15.1291 16.1263C15.286 16.1048 15.4288 16.0244 15.5287 15.9016C15.6287 15.7787 15.6782 15.6226 15.6674 15.4646C15.6566 15.3066 15.5863 15.1586 15.4706 15.0505C15.3549 14.9424 15.2024 14.8822 15.0441 14.8822Z"
                        fill="#EC4F48"
                      />
                    </svg>
                    <span className="font-bold text-sm text-[#EC4F48] text-left">
                      N° téléphone non vérifié
                    </span>
                  </button>
                )}
                {/* Vérification email */}
                {isEmailVerified ? (
                  <div className="flex items-center justify-between gap-2 rounded-[10px] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="2.25"
                          y="4.5"
                          width="13.5"
                          height="9"
                          rx="2"
                          stroke="#2DAE9F"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M3.75 6L9 10.5L14.25 6"
                          stroke="#2DAE9F"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="font-bold text-sm text-[#2DAE9F]">
                        Email vérifié
                      </span>
                    </div>
                    <span>
                      {/* Check SVG fourni par l'utilisateur */}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8 15.5513C8.98491 15.5513 9.96018 15.3573 10.8701 14.9804C11.7801 14.6035 12.6069 14.051 13.3033 13.3546C13.9997 12.6581 14.5522 11.8313 14.9291 10.9214C15.306 10.0115 15.5 9.03618 15.5 8.05127C15.5 7.06636 15.306 6.09109 14.9291 5.18114C14.5522 4.2712 13.9997 3.44441 13.3033 2.74797C12.6069 2.05153 11.7801 1.49908 10.8701 1.12217C9.96018 0.745263 8.98491 0.55127 8 0.55127C6.01088 0.55127 4.10322 1.34145 2.6967 2.74797C1.29018 4.15449 0.5 6.06215 0.5 8.05127C0.5 10.0404 1.29018 11.948 2.6967 13.3546C4.10322 14.7611 6.01088 15.5513 8 15.5513ZM7.80667 11.0846L11.9733 6.0846L10.6933 5.01794L7.11 9.3171L5.25583 7.4621L4.0775 8.64044L6.5775 11.1404L7.2225 11.7854L7.80667 11.0846Z"
                          fill="#2DAE9F"
                        />
                      </svg>
                    </span>
                  </div>
                ) : (
                  <button
                    className="flex items-center gap-3 w-full rounded-[16px] px-4 py-4 bg-[#F9F5F5] cursor-pointer transition"
                    style={{ border: "none" }}
                    onClick={() => { setModalMode('email'); setModalOpen(true); }}
                    aria-label="Vérifier l'email"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="2.25"
                        y="4.5"
                        width="13.5"
                        height="9"
                        rx="2"
                        stroke="#EC4F48"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M3.75 6L9 10.5L14.25 6"
                        stroke="#EC4F48"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-bold text-sm text-[#EC4F48] text-left">
                      Email non vérifié
                    </span>
                  </button>
                )}
                {/* Enregistrement pièce d'identité */}
                {isIdUploaded ? (
                  <div className="flex items-center justify-between gap-2 rounded-[10px] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <svg
                        width="23"
                        height="21"
                        viewBox="0 0 23 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_6537_5454)">
                          <path
                            d="M20.625 6.30127V16.3013C20.625 16.645 20.3438 16.9263 20 16.9263H12.5C12.5 15.1997 11.1016 13.8013 9.375 13.8013H6.875C5.14844 13.8013 3.75 15.1997 3.75 16.9263H2.5C2.15625 16.9263 1.875 16.645 1.875 16.3013V6.30127H20.625ZM2.5 1.30127C1.12109 1.30127 0 2.42236 0 3.80127V16.3013C0 17.6802 1.12109 18.8013 2.5 18.8013H20C21.3789 18.8013 22.5 17.6802 22.5 16.3013V3.80127C22.5 2.42236 21.3789 1.30127 20 1.30127H2.5ZM10.625 10.0513C10.625 9.38823 10.3616 8.75234 9.89277 8.2835C9.42393 7.81466 8.78804 7.55127 8.125 7.55127C7.46196 7.55127 6.82607 7.81466 6.35723 8.2835C5.88839 8.75234 5.625 9.38823 5.625 10.0513C5.625 10.7143 5.88839 11.3502 6.35723 11.819C6.82607 12.2879 7.46196 12.5513 8.125 12.5513C8.78804 12.5513 9.42393 12.2879 9.89277 11.819C10.3616 11.3502 10.625 10.7143 10.625 10.0513ZM14.6875 8.17627C14.168 8.17627 13.75 8.59424 13.75 9.11377C13.75 9.6333 14.168 10.0513 14.6875 10.0513H17.8125C18.332 10.0513 18.75 9.6333 18.75 9.11377C18.75 8.59424 18.332 8.17627 17.8125 8.17627H14.6875ZM14.6875 11.9263C14.168 11.9263 13.75 12.3442 13.75 12.8638C13.75 13.3833 14.168 13.8013 14.6875 13.8013H17.8125C18.332 13.8013 18.75 13.3833 18.75 12.8638C18.75 12.3442 18.332 11.9263 17.8125 11.9263H14.6875Z"
                            fill="#2DAE9F"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_6537_5454">
                            <rect
                              width="22.5"
                              height="20"
                              fill="white"
                              transform="translate(0 0.0512695)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                      <span className="font-bold text-sm text-[#2DAE9F]">
                        Pièce d'identité enregistrée
                      </span>
                    </div>
                    <span>
                      {/* Check SVG fourni par l'utilisateur */}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8 15.5513C8.98491 15.5513 9.96018 15.3573 10.8701 14.9804C11.7801 14.6035 12.6069 14.051 13.3033 13.3546C13.9997 12.6581 14.5522 11.8313 14.9291 10.9214C15.306 10.0115 15.5 9.03618 15.5 8.05127C15.5 7.06636 15.306 6.09109 14.9291 5.18114C14.5522 4.2712 13.9997 3.44441 13.3033 2.74797C12.6069 2.05153 11.7801 1.49908 10.8701 1.12217C9.96018 0.745263 8.98491 0.55127 8 0.55127C6.01088 0.55127 4.10322 1.34145 2.6967 2.74797C1.29018 4.15449 0.5 6.06215 0.5 8.05127C0.5 10.0404 1.29018 11.948 2.6967 13.3546C4.10322 14.7611 6.01088 15.5513 8 15.5513ZM7.80667 11.0846L11.9733 6.0846L10.6933 5.01794L7.11 9.3171L5.25583 7.4621L4.0775 8.64044L6.5775 11.1404L7.2225 11.7854L7.80667 11.0846Z"
                          fill="#2DAE9F"
                        />
                      </svg>
                    </span>
                  </div>
                ) : (
                  <button
                    className="flex items-center gap-3 w-full rounded-[16px] px-4 py-4 bg-[#F9F5F5] cursor-pointer transition"
                    style={{ border: "none" }}
                    onClick={() => { setModalMode('id'); setModalOpen(true); }}
                    aria-label="Enregistrer ma pièce d'identité"
                  >
                    <svg
                      width="23"
                      height="21"
                      viewBox="0 0 23 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_6537_5454)">
                        <path
                          d="M20.625 6.30127V16.3013C20.625 16.645 20.3438 16.9263 20 16.9263H12.5C12.5 15.1997 11.1016 13.8013 9.375 13.8013H6.875C5.14844 13.8013 3.75 15.1997 3.75 16.9263H2.5C2.15625 16.9263 1.875 16.645 1.875 16.3013V6.30127H20.625ZM2.5 1.30127C1.12109 1.30127 0 2.42236 0 3.80127V16.3013C0 17.6802 1.12109 18.8013 2.5 18.8013H20C21.3789 18.8013 22.5 17.6802 22.5 16.3013V3.80127C22.5 2.42236 21.3789 1.30127 20 1.30127H2.5ZM10.625 10.0513C10.625 9.38823 10.3616 8.75234 9.89277 8.2835C9.42393 7.81466 8.78804 7.55127 8.125 7.55127C7.46196 7.55127 6.82607 7.81466 6.35723 8.2835C5.88839 8.75234 5.625 9.38823 5.625 10.0513C5.625 10.7143 5.88839 11.3502 6.35723 11.819C6.82607 12.2879 7.46196 12.5513 8.125 12.5513C8.78804 12.5513 9.42393 12.2879 9.89277 11.819C10.3616 11.3502 10.625 10.7143 10.625 10.0513ZM14.6875 8.17627C14.168 8.17627 13.75 8.59424 13.75 9.11377C13.75 9.6333 14.168 10.0513 14.6875 10.0513H17.8125C18.332 10.0513 18.75 9.6333 18.75 9.11377C18.75 8.59424 18.332 8.17627 17.8125 8.17627H14.6875ZM14.6875 11.9263C14.168 11.9263 13.75 12.3442 13.75 12.8638C13.75 13.3833 14.168 13.8013 14.6875 13.8013H17.8125C18.332 13.8013 18.75 13.3833 18.75 12.8638C18.75 12.3442 18.332 11.9263 17.8125 11.9263H14.6875Z"
                          fill="#EC4F48"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_6537_5454">
                          <rect
                            width="22.5"
                            height="20"
                            fill="white"
                            transform="translate(0 0.0512695)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    <span className="font-bold text-sm text-[#EC4F48] text-left">
                      Enregistrer ma pièce d'identité
                    </span>
                  </button>
                )}
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

      {/* Sheet d'édition du compte */}
      <AccountEditSheet 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        mode={modalMode} 
        initialValues={{ 
          phone: savedValues.phone ?? user?.contact ?? undefined, 
          email: savedValues.email ?? user?.email ?? undefined, 
          idFile: savedValues.idFile ?? undefined 
        }} 
        onSubmit={handleAccountEditSubmit}
        phoneVerified={isPhoneVerified}
        emailVerified={isEmailVerified}
        idVerified={isIdUploaded}
      />
    </>
  );
};

export default Sidebar;
