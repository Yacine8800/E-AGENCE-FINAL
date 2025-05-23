"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Ecostore from "./icons/EcoStore";
import UserSolo from "./icons/UserSolo";

import { TAB_CONTENT } from "../utils/headerData";
import Column from "./Column";

// Styles pour assurer que la position sticky fonctionne correctement
// sans causer de saut de page quand le header devient sticky
const headerStyles = `
  .sticky-header-container {
    position: relative;
    z-index: 9999;
  }
  
  /* Styles spécifiques pour tablette (640px - 1023px) */
  @media (min-width: 640px) and (max-width: 1023px) {
    /* Forcer une disposition appropriée du header en mode tablette */
    .tablet-header-container {
      display: flex;
      flex-direction: column;
      padding: 8px;
    }
    
    /* Rangée du logo */
    .tablet-logo-row {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-bottom: 8px;
    }
    
    /* Conteneur du logo */
    .tablet-logo-container {
      display: block !important;
      width: 100px !important;
      height: auto !important;
    }
    
    /* Rangée de navigation */
    .tablet-nav-row {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-bottom: 8px;
    }
    
    /* Rangée des boutons d'action */
    .tablet-cta-row {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
  
  /* Styles spécifiques pour tablette en mode paysage */
  @media (min-width: 640px) and (max-width: 1023px) and (orientation: landscape) {
    .tablet-header-container {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 8px 16px;
    }
    
    .tablet-logo-row {
      width: auto;
      margin-bottom: 0;
      margin-right: 12px;
    }
    
    .tablet-logo-container {
      width: 90px !important;
    }
    
    .tablet-nav-row {
      width: auto;
      margin-bottom: 0;
      flex-grow: 1;
    }
    
    .tablet-cta-row {
      width: auto;
      margin-left: 16px;
    }
  }
  
  /* Styles spécifiques pour petite tablette (640px - 767px) */
  @media (min-width: 640px) and (max-width: 767px) {
    .tablet-logo-container {
      width: 90px !important;
    }
    
    .tablet-nav-row button {
      font-size: 14px !important;
    }
  }
`;

const Header = () => {
  // Type d'onglet possible
  type TabType = "particulier" | "business" | "institution";

  // L'onglet visuellement actif et dont le menu est affiché
  const [activeTab, setActiveTab] = useState<TabType | null>(null);

  // État d'ouverture du menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  // État pour stocker le sous-menu actif
  const [activeSubmenuPath, setActiveSubmenuPath] = useState<string | null>(
    null
  );
  // État pour stocker l'onglet actif basé sur le chemin d'URL
  const [currentSectionTab, setCurrentSectionTab] = useState<TabType | null>(
    null
  );

  // Récupérer l'état d'authentification
  const { isAuthenticated, user } = useAuth();

  /* ──────────────────────────  Fonctions utilitaires  ────────────────────────── */

  // Détermine l'onglet actif en fonction du chemin
  const getTabFromPath = (path: string | null): TabType | null => {
    if (!path) return null;

    // Vérifie d'abord dans les sous-menus existants
    for (const tabKey in TAB_CONTENT) {
      const tab = tabKey as TabType;
      const columns = TAB_CONTENT[tab];

      // Pour chaque colonne de l'onglet
      for (const column of columns) {
        // Pour chaque lien dans la colonne
        for (const link of column.links) {
          if (path === link.href || path.startsWith(link.href + "/")) {
            return tab;
          }
        }
      }
    }

    // Si aucun sous-menu ne correspond, utilise la détection par parties du chemin
    if (
      path.includes("/simulateur-facture") ||
      path.includes("/simulateur-puissance") ||
      path.includes("/mes-demandes")
    ) {
      return "particulier";
    } else if (
      path.includes("/business") ||
      path.includes("/pro") ||
      path.includes("/entreprise")
    ) {
      return "business";
    } else if (
      path.includes("/institution") ||
      path.includes("/administration") ||
      path.includes("/collectivite")
    ) {
      return "institution";
    }

    return null;
  };

  // Vérifie si un chemin correspond à un sous-menu dans la structure TAB_CONTENT
  const findActiveSubmenu = (currentPath: string): string | null => {
    // Pour chaque type d'onglet (particulier, business, institution)
    for (const tabKey in TAB_CONTENT) {
      const tab = tabKey as TabType;
      const columns = TAB_CONTENT[tab];

      // Pour chaque colonne de l'onglet
      for (const column of columns) {
        // Pour chaque lien dans la colonne
        for (const link of column.links) {
          // Si le chemin exact correspond ou si le chemin actuel commence par le lien
          // (pour gérer les pages enfants comme /mes-demandes/123)
          if (currentPath === link.href || currentPath.startsWith(link.href)) {
            return link.href;
          }
        }
      }
    }
    return null;
  };

  /* ──────────────────────────  Effects  ────────────────────────── */

  // Initialisation et changement de page
  useEffect(() => {
    // Déterminer le sous-menu actif
    const activeSubmenu = findActiveSubmenu(pathname);
    setActiveSubmenuPath(activeSubmenu);

    // Déterminer l'onglet actif basé sur le chemin d'URL
    const tabFromPath = getTabFromPath(pathname);
    setCurrentSectionTab(tabFromPath);

    // Sur mobile, nous ne gardons pas le menu ouvert automatiquement
    if (isMobile) {
      setIsMenuOpen(false);
    }
  }, [pathname, isMobile]);

  // Détecter scroll + mobile + tablette
  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 0);
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const newIsMobile = windowWidth < 640;
      const newIsTablet = windowWidth >= 640 && windowWidth < 1024;
      const isLandscape = window.matchMedia("(orientation: landscape)").matches;

      setIsMobile(newIsMobile);
      setIsTablet(newIsTablet);

      // Sur changement de mode, réinitialiser le menu
      if (newIsTablet !== isTablet) {
        setIsMenuOpen(false);
        setActiveTab(null);
      }

      // Ajouter un attribut d'orientation au body pour les styles CSS
      if (isLandscape) {
        document.body.setAttribute("data-orientation", "landscape");
      } else {
        document.body.setAttribute("data-orientation", "portrait");
      }
    };

    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    // Écouter les changements d'orientation
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [isTablet]);

  /* ──────────────────────────  Handlers  ────────────────────────── */

  // Gestion du clic sur un onglet (sur mobile uniquement)
  const handleTabClick = (tab: TabType) => {
    if (isMobile || isTablet) {
      // Sur mobile ou tablette, on bascule juste l'état du menu
      if (tab === activeTab) {
        setIsMenuOpen(!isMenuOpen);
      } else {
        setActiveTab(tab);
        setIsMenuOpen(true);
      }
    }
  };

  // Gestion du survol d'un onglet
  const handleTabHover = (tab: TabType | null) => {
    if (isMobile || isTablet) return;
    if (hoverTimeout) clearTimeout(hoverTimeout);

    // Si la souris quitte la zone, fermer le menu après un délai
    if (!tab) {
      setHoverTimeout(
        setTimeout(() => {
          setIsMenuOpen(false);
          setActiveTab(null); // Réinitialiser l'onglet actif lorsque le menu se ferme
        }, 300)
      );
    }
    // Sinon, ouvrir le menu et définir l'onglet actif
    else {
      setActiveTab(tab);
      setIsMenuOpen(true);
    }
  };

  /* ──────────────────────────  Render  ────────────────────────── */

  return (
    <>
      {/* Styles globaux pour le header */}
      <style jsx global>
        {headerStyles}
      </style>

      <div
        className={`fixed w-full z-[9999] transition-all duration-200 ease-in-out ${
          hasScrolled || isMobile
            ? "top-0 px-0"
            : "top-6 px-2 sm:px-4 md:px-6 lg:px-[40px] xl:px-[80px]"
        }`}
      >
        <motion.header
          className={`bg-[#F5F5F5] w-full overflow-hidden transition-all duration-200 ease-in-out ${
            hasScrolled || isMobile
              ? "shadow rounded-tl-[0px] rounded-tr-[0px] rounded-bl-[40px] rounded-br-[40px]"
              : isMenuOpen
              ? "rounded-[10px] sm:rounded-[20px] md:rounded-[40px] shadow-lg"
              : "rounded-[10px] sm:rounded-[20px] md:rounded-[40px]"
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ─────────────  Bandeau supérieur  ───────────── */}
          <div className="py-2 sm:py-3 md:py-5">
            <div
              className={`
              px-3 sm:px-6 md:px-8 lg:px-12 xl:px-20 
              ${
                isTablet
                  ? "tablet-header-container"
                  : "flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4"
              }
            `}
            >
              {/* Modifications spécifiques pour tablette */}
              {isTablet ? (
                // Structure spéciale pour tablette
                <>
                  {/* Rangée du logo */}
                  <div className="tablet-logo-row">
                    <Link
                      href="/"
                      className="flex items-center group tablet-logo-container"
                    >
                      <Image
                        src="/logo.png"
                        alt="Ma CIE en ligne"
                        width={180}
                        height={60}
                        className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                        priority
                      />
                    </Link>
                  </div>

                  {/* Rangée de navigation */}
                  <div className="tablet-nav-row">
                    <nav
                      className="relative flex items-center space-x-4 justify-center"
                      onMouseLeave={() => handleTabHover(null)}
                    >
                      {(
                        ["particulier", "business", "institution"] as const
                      ).map((tab) => (
                        <button
                          key={tab}
                          className={`relative text-lg text-noir hover:text-orange transition-all duration-300 ${
                            activeTab === tab || currentSectionTab === tab
                              ? "font-semibold"
                              : ""
                          }`}
                          onClick={() => handleTabClick(tab)}
                          onMouseEnter={() => handleTabHover(tab)}
                        >
                          {tab === "particulier"
                            ? "Particulier"
                            : tab === "business"
                            ? "Business"
                            : "Institution"}
                          {(activeTab === tab ||
                            (!isMenuOpen && currentSectionTab === tab)) && (
                            <motion.div
                              layoutId="underline"
                              className="absolute left-0 right-0 -bottom-2 mx-auto h-[6px] w-full bg-orange shadow-sm rounded-full"
                              style={{ opacity: 1 }}
                            />
                          )}
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="tablet-cta-row">
                    <div className="flex items-center gap-3 justify-center">
                      <Link
                        href="/solutions-eco"
                        className="text-vert group flex items-center gap-[6px] sm:gap-[10px] font-medium text-[10px] xs:text-xs sm:text-sm transition-all duration-300"
                      >
                        <Ecostore
                          className={`transition-transform duration-300 ${
                            pathname === "/solutions-eco"
                              ? "scale-110"
                              : "group-hover:scale-110"
                          }`}
                        />
                        <span
                          className={`relative after:absolute after:h-[3px] after:bg-vert after:bottom-[-2px] after:left-0 after:transition-all after:duration-300 ${
                            pathname === "/solutions-eco"
                              ? "font-semibold after:w-full text-vert"
                              : "after:w-0 group-hover:after:w-full group-hover:text-vert"
                          }`}
                        >
                          Ecostore
                        </span>
                      </Link>

                      <Link
                        href={isAuthenticated ? "/dashboard" : "/login"}
                        className={`
                          ${
                            isAuthenticated &&
                            user &&
                            user.firstname &&
                            user.lastname
                              ? "bg-gradient-to-r from-[#F47D02] via-[#F9B234] to-[#F47D02] border-none text-white"
                              : "bg-orange text-white"
                          }
                          hover:bg-noir hover:text-white
                          font-semibold 
                          min-w-[120px]
                          max-w-[160px]
                          h-[45px]
                          px-4 
                          py-[10px]
                          rounded-[30px]
                          transition-all duration-300 
                          text-xs
                          flex items-center justify-center 
                          gap-[10px]
                          hover:scale-105 hover:shadow-lg
                          truncate shrink-0
                          ${
                            isAuthenticated &&
                            user &&
                            user.firstname &&
                            user.lastname
                              ? "shadow-md shadow-orange/30"
                              : ""
                          }
                        `}
                      >
                        {isAuthenticated &&
                        user &&
                        user.firstname &&
                        user.lastname ? (
                          <>
                            <div className="relative group shrink-0">
                              <div className="h-6 w-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold ring-2 ring-white/50 group-hover:ring-white/80 transition-all">
                                {user.firstname.charAt(0).toUpperCase()}
                              </div>
                              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="flex flex-col items-start leading-tight">
                              <span className="font-bold text-[10px]">
                                {user.firstname}
                              </span>
                              <span className="font-medium text-[9px] opacity-90">
                                {user.lastname}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <UserSolo />
                            <span>Mon compte</span>
                          </>
                        )}
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                // Structure normale pour desktop et mobile
                <>
                  {/* Logo + Tabs */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6 lg:gap-12 w-full sm:w-auto">
                    <Link href="/" className="flex items-center group shrink-0">
                      <Image
                        src="/logo.png"
                        alt="Ma CIE en ligne"
                        width={180}
                        height={60}
                        className="w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] h-auto transition-transform duration-300 group-hover:scale-105"
                        priority
                      />
                    </Link>

                    <nav
                      className="relative flex items-center space-x-2 xs:space-x-3 sm:space-x-4 md:space-x-6 lg:space-x-8 mt-2 sm:mt-0"
                      onMouseLeave={() => handleTabHover(null)}
                    >
                      {(
                        ["particulier", "business", "institution"] as const
                      ).map((tab) => (
                        <button
                          key={tab}
                          className={`relative text-sm xs:text-base sm:text-lg md:text-xl text-noir hover:text-orange transition-all duration-300 ${
                            activeTab === tab || currentSectionTab === tab
                              ? "font-semibold"
                              : ""
                          }`}
                          onClick={() => handleTabClick(tab)}
                          onMouseEnter={() => handleTabHover(tab)}
                        >
                          {tab === "particulier"
                            ? "Particulier"
                            : tab === "business"
                            ? "Business"
                            : "Institution"}
                          {(activeTab === tab ||
                            (!isMenuOpen && currentSectionTab === tab)) && (
                            <motion.div
                              layoutId="underline"
                              className="absolute left-0 right-0 -bottom-1 sm:-bottom-2 md:-bottom-3 mx-auto h-[4px] sm:h-[6px] md:h-[10px] w-full bg-orange shadow-sm rounded-full"
                              style={{ opacity: 1 }}
                            />
                          )}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-0 w-full sm:w-auto justify-center sm:justify-end shrink-0">
                    <Link
                      href="/solutions-eco"
                      className="text-vert group flex items-center gap-[6px] sm:gap-[10px] font-medium text-[10px] xs:text-xs sm:text-sm transition-all duration-300"
                    >
                      <Ecostore
                        className={`transition-transform duration-300 ${
                          pathname === "/solutions-eco" ||
                          pathname.startsWith("/solutions-eco/")
                            ? "scale-110"
                            : "group-hover:scale-110"
                        }`}
                      />
                      <span
                        className={`relative after:absolute after:h-[3px] after:bg-vert after:bottom-[-2px] after:left-0 after:transition-all after:duration-300 ${
                          pathname === "/solutions-eco" ||
                          pathname.startsWith("/solutions-eco/")
                            ? "font-semibold after:w-full text-vert"
                            : "after:w-0 group-hover:after:w-full group-hover:text-vert"
                        }`}
                      >
                        Ecostore
                      </span>
                    </Link>

                    <Link
                      href={isAuthenticated ? "/dashboard" : "/login"}
                      className={`
                        ${
                          isAuthenticated &&
                          user &&
                          user.firstname &&
                          user.lastname
                            ? "bg-gradient-to-r from-[#F47D02] via-[#F9B234] to-[#F47D02] border-none text-white"
                            : "bg-orange text-white"
                        }
                        hover:bg-noir hover:text-white
                        font-semibold 
                        min-w-[80px] xs:min-w-[120px] sm:min-w-[120px] md:min-w-[120px] lg:min-w-[160px]
                        max-w-[140px] xs:max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[233px]
                        h-[35px] sm:h-[45px] md:h-[55px]
                        px-2 xs:px-3 sm:px-4 md:px-6 lg:px-10 
                        py-[8px] sm:py-[10px] md:py-[15px]
                        rounded-[20px] sm:rounded-[30px] md:rounded-[40px]
                        transition-all duration-300 
                        text-[10px] xs:text-xs sm:text-sm
                        flex items-center justify-center 
                        gap-[6px] sm:gap-[10px]
                        hover:scale-105 hover:shadow-lg
                        truncate shrink-0
                        ${
                          isAuthenticated &&
                          user &&
                          user.firstname &&
                          user.lastname
                            ? "shadow-md shadow-orange/30"
                            : ""
                        }
                      `}
                    >
                      {isAuthenticated &&
                      user &&
                      user.firstname &&
                      user.lastname ? (
                        <>
                          <div className="relative group shrink-0">
                            <div className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold ring-2 ring-white/50 group-hover:ring-white/80 transition-all">
                              {user.firstname.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 bg-green-400 rounded-full border-[1px] sm:border-2 border-white"></div>
                          </div>
                          <div className="flex flex-col items-start leading-tight">
                            <span className="font-bold text-[9px] xs:text-[10px] sm:text-xs">
                              {user.firstname}
                            </span>
                            <span className="font-medium text-[8px] xs:text-[9px] sm:text-[11px] opacity-90">
                              {user.lastname}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <UserSolo />
                          <span>Mon compte</span>
                        </>
                      )}
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ─────────────  Contenu déroulant  ───────────── */}
          <AnimatePresence mode="sync">
            {isMenuOpen && activeTab && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-3 sm:py-4 md:py-6 lg:py-8"
                onMouseEnter={() => hoverTimeout && clearTimeout(hoverTimeout)}
                onMouseLeave={() => handleTabHover(null)}
              >
                {/* Fermeture mobile */}
                {(isMobile || isTablet) && (
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-300"
                    aria-label="Fermer le menu"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={isMobile ? "14" : "16"}
                      height={isMobile ? "14" : "16"}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}

                {/* Message spécifique selon l'onglet */}
                <div className="w-full mb-3 sm:mb-4 md:mb-6">
                  <p className="text-base sm:text-lg md:text-xl font-regular text-noir">
                    {activeTab === "particulier" ? (
                      <span>
                        Vous êtes particulier <strong> professionnel</strong> ou{" "}
                        <strong> domicile</strong>
                      </span>
                    ) : activeTab === "business" ? (
                      <span>
                        Vous êtes <strong>domicile HT</strong> ou{" "}
                        <strong>professionnel HT</strong>
                      </span>
                    ) : (
                      <span>
                        Vous êtes une <strong>administration</strong>
                      </span>
                    )}
                  </p>
                </div>

                {/* Grille de colonnes */}
                <div className="bg-[#f1f1f1] flex flex-col md:flex-row items-start gap-4 sm:gap-6 md:gap-8 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-sm">
                  {activeTab &&
                    TAB_CONTENT[activeTab].map((col, idx) => (
                      <Column
                        key={col.title}
                        {...col}
                        activeSubmenuPath={activeSubmenuPath}
                        showSeparator={idx < TAB_CONTENT[activeTab].length - 1}
                      />
                    ))}

                  {/* Bloc "Mes demandes" exclusif Particulier */}
                  {activeTab === "particulier" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className={`border-2 p-2 sm:p-3 md:p-5 gap-2 sm:gap-4 md:gap-8 ${
                        pathname === "/mes-demandes"
                          ? "border-orange bg-orange/5"
                          : "border-white"
                      } rounded-[20px] sm:rounded-[30px] md:rounded-[50px] w-full flex max-w-md justify-center items-center hover:bg-gray-100 transition-all duration-300 hover:shadow-md cursor-pointer`}
                      onClick={() => (window.location.href = "/mes-demandes")}
                    >
                      <div>
                        <Image
                          src="/profile.png"
                          alt="profile"
                          width={80}
                          height={15}
                          className="w-[40px] sm:w-[50px] md:w-[80px] h-auto transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5 sm:gap-1 md:gap-2">
                        <p className="font-bold text-sm sm:text-base md:text-xl">
                          Mes demandes
                        </p>
                        <p className="text-[10px] sm:text-xs md:text-sm">
                          Tout savoir sur mes demandes
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      </div>
    </>
  );
};

export default Header;
