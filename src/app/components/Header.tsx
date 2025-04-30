"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import UserSolo from "./icons/UserSolo";
import AssistanceIcon from "./icons/AssistanceIcon";
import Ecostore from "./icons/EcoStore";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";

import Column from "./Column";
import { TAB_CONTENT } from "../utils/headerData";

// Styles pour assurer que la position sticky fonctionne correctement
// sans causer de saut de page quand le header devient sticky
const headerStyles = `
  .sticky-header-container {
    position: relative;
    z-index: 9999;
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
  const [activeSubmenuPath, setActiveSubmenuPath] = useState<string | null>(null);

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
          if (path === link.href || path.startsWith(link.href + '/')) {
            return tab;
          }
        }
      }
    }

    // Si aucun sous-menu ne correspond, utilise la détection par parties du chemin
    if (path.includes('/simulateur-facture') || path.includes('/simulateur-puissance') || path.includes('/mes-demandes')) {
      return "particulier";
    } else if (path.includes('/business') || path.includes('/pro') || path.includes('/entreprise')) {
      return "business";
    } else if (path.includes('/institution') || path.includes('/administration') || path.includes('/collectivite')) {
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

  // Nouvelle fonction pour sauvegarder l'onglet actif
  const saveActiveTab = useCallback((tab: TabType) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('lastActiveTab', tab);
    }
  }, []);

  // Nouvelle fonction pour récupérer l'onglet précédemment actif
  const getSavedActiveTab = useCallback((): TabType | null => {
    if (typeof window !== 'undefined') {
      const savedTab = sessionStorage.getItem('lastActiveTab') as TabType | null;
      return savedTab;
    }
    return null;
  }, []);

  /* ──────────────────────────  Effects  ────────────────────────── */

  // Initialisation et changement de page
  useEffect(() => {
    // Déterminer l'onglet actif en fonction du chemin ou récupérer celui sauvegardé
    const tabFromPath = getTabFromPath(pathname);
    const savedTab = getSavedActiveTab();

    // Priorité à l'onglet enregistré s'il existe, sinon utiliser celui détecté par l'URL
    const finalTab = savedTab || tabFromPath;

    // Ne mettre à jour l'onglet actif que s'il est défini
    if (finalTab) {
      setActiveTab(finalTab);
    }

    // Déterminer le sous-menu actif
    const activeSubmenu = findActiveSubmenu(pathname);
    setActiveSubmenuPath(activeSubmenu);

    // Log pour le débogage
    console.log(`Page changed: ${pathname} → Saved Tab: ${savedTab} → Path Tab: ${tabFromPath} → Final Tab: ${finalTab} → Active submenu: ${activeSubmenu}`);

    // Si un sous-menu est actif, ouvrir le menu correspondant automatiquement sur desktop
    if (activeSubmenu && finalTab && !isMobile) {
      setIsMenuOpen(true);
    }

    // Sur mobile, nous ne gardons pas le menu ouvert automatiquement
    if (isMobile) {
      setIsMenuOpen(false);
    }
  }, [pathname, isMobile, getSavedActiveTab]);

  // Détecter scroll + mobile
  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 0);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* ──────────────────────────  Handlers  ────────────────────────── */

  // Gestion du clic sur un onglet
  const handleTabClick = (tab: TabType) => {
    console.log(`Tab clicked: ${tab}, current active: ${activeTab}, menu open: ${isMenuOpen}`);

    if (hoverTimeout) clearTimeout(hoverTimeout);

    // Si on clique sur l'onglet actif, on bascule juste l'état du menu
    if (tab === activeTab) {
      setIsMenuOpen(!isMenuOpen);
    }
    // Sinon, on active le nouvel onglet et on ouvre le menu
    else {
      setActiveTab(tab);
      saveActiveTab(tab);
      setIsMenuOpen(true);
    }
  };

  // Gestion du survol d'un onglet
  const handleTabHover = (tab: TabType | null) => {
    if (isMobile) return;
    if (hoverTimeout) clearTimeout(hoverTimeout);

    // Si la souris quitte la zone, fermer le menu après un délai
    if (!tab) {
      setHoverTimeout(setTimeout(() => {
        setIsMenuOpen(false);
      }, 300));
    }
    // Sinon, ouvrir le menu sans changer l'onglet actif
    else if (activeTab) {
      setIsMenuOpen(true);
    }
  };

  /* ──────────────────────────  Render  ────────────────────────── */

  return (
    <>
      {/* Styles globaux pour le header */}
      <style jsx global>{headerStyles}</style>

      <div className="px-2 sm:px-4 md:px-6 lg:px-[40px] xl:px-[80px] pt-2 sm:pt-4 md:pt-6 sticky-header-container">
        <motion.header
          className={`bg-[#F5F5F5] w-full rounded-[10px] sm:rounded-[20px] md:rounded-[40px] overflow-hidden shadow-sm transition-all duration-300 ease-in-out ${hasScrolled
            ? "fixed top-0 left-0 right-0 z-[9999] rounded-none shadow-lg"
            : ""
            }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ─────────────  Bandeau supérieur  ───────────── */}
          <div className="py-2 sm:py-3 md:py-5">
            <div className="px-3 sm:px-6 md:px-8 lg:px-12 xl:px-20 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              {/* Logo + Tabs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6 lg:gap-12 w-full sm:w-auto">
                <Link href="/" className="flex items-center group">
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
                  {(["particulier", "business", "institution"] as const).map(
                    (tab) => (
                      <button
                        key={tab}
                        className={`relative text-sm xs:text-base sm:text-lg md:text-xl text-noir hover:text-orange transition-all duration-300 ${activeTab === tab ? "font-semibold" : ""
                          }`}
                        onClick={() => handleTabClick(tab)}
                        onMouseEnter={() => handleTabHover(tab)}
                      >
                        {tab === "particulier"
                          ? "Particulier"
                          : tab === "business"
                            ? "Business"
                            : "Institution"}
                        {activeTab === tab && (
                          <motion.div
                            layoutId="underline"
                            className="absolute left-0 right-0 -bottom-1 sm:-bottom-2 md:-bottom-3 mx-auto h-[4px] sm:h-[6px] md:h-[10px] w-full bg-orange shadow-sm rounded-full"
                            style={{ opacity: 1 }}
                          />
                        )}
                      </button>
                    )
                  )}
                </nav>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-0 w-full sm:w-auto justify-center sm:justify-end shrink-0">
                <Link
                  href="/solutions-eco"
                  className="bg-[#F5F5F5] border border-vert hover:bg-white font-semibold text-vert min-w-[80px] xs:min-w-[120px] sm:min-w-[120px] md:min-w-[120px] lg:min-w-[160px] max-w-[140px] xs:max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[233px] h-[35px] sm:h-[45px] md:h-[55px] px-2 xs:px-3 sm:px-4 md:px-6 lg:px-10 py-[8px] sm:py-[10px] md:py-[15px] rounded-[20px] sm:rounded-[30px] md:rounded-[40px] transition-all duration-300 text-[10px] xs:text-xs sm:text-sm flex items-center justify-center gap-[6px] sm:gap-[10px] hover:scale-105 hover:shadow-lg truncate"
                >
                  <Ecostore />
                  <span>Ecostore</span>
                </Link>

                <Link
                  href={isAuthenticated ? "/dashboard" : "/login"}
                  className={`
                    ${isAuthenticated && user && user.firstname && user.lastname
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
                    ${isAuthenticated && user && user.firstname && user.lastname
                      ? "shadow-md shadow-orange/30"
                      : ""
                    }
                  `}
                >
                  {isAuthenticated && user && user.firstname && user.lastname ? (
                    <>
                      <div className="relative group shrink-0">
                        <div className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold ring-2 ring-white/50 group-hover:ring-white/80 transition-all">
                          {user.firstname.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-2 w-2 sm:h-3 sm:w-3 bg-green-400 rounded-full border-[1px] sm:border-2 border-white"></div>
                      </div>
                      <div className="flex flex-col items-start leading-tight">
                        <span className="font-bold text-[9px] xs:text-[10px] sm:text-xs">{user.firstname}</span>
                        <span className="font-medium text-[8px] xs:text-[9px] sm:text-[11px] opacity-90">{user.lastname}</span>
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
                  <p className="text-base sm:text-lg md:text-xl font-semibold text-noir">
                    {activeTab === "particulier"
                      ? "Vous êtes particulier professionnel ou particulier domicile"
                      : activeTab === "business"
                        ? "Vous êtes domestique HT ou professionnel HT?"
                        : "Vous êtes une administration?"}
                  </p>
                </div>

                {/* Grille de colonnes */}
                <div className="bg-[#f1f1f1] flex flex-col md:flex-row items-start gap-4 sm:gap-6 md:gap-8 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-sm">
                  {activeTab && TAB_CONTENT[activeTab].map((col, idx) => (
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
                      className={`border-2 p-2 sm:p-3 md:p-5 gap-2 sm:gap-4 md:gap-8 ${pathname === "/mes-demandes" ? "border-orange bg-orange/5" : "border-white"} rounded-[20px] sm:rounded-[30px] md:rounded-[50px] w-full flex max-w-md justify-center items-center hover:bg-gray-100 transition-all duration-300 hover:shadow-md cursor-pointer`}
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
