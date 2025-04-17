"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import UserSolo from "./icons/UserSolo";
import AssistanceIcon from "./icons/AssistanceIcon";
import Ecostore from "./icons/EcoStore";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

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
  // État pour stocker le sous-menu actif
  const [activeSubmenuPath, setActiveSubmenuPath] = useState<string | null>(null);

  /* ──────────────────────────  Fonctions utilitaires  ────────────────────────── */

  // Détermine l'onglet actif en fonction du chemin
  const getTabFromPath = (path: string | null): TabType | null => {
    if (!path) return null;

    if (path.includes('/simulateur-facture') || path.includes('/simulateur-puissance')) {
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

  /* ──────────────────────────  Effects  ────────────────────────── */

  // Initialisation et changement de page
  useEffect(() => {
    // Déterminer l'onglet actif en fonction du chemin
    const tabFromPath = getTabFromPath(pathname);
    setActiveTab(tabFromPath);

    // Déterminer le sous-menu actif
    const activeSubmenu = findActiveSubmenu(pathname);
    setActiveSubmenuPath(activeSubmenu);

    // Log pour le débogage
    console.log(`Page changed: ${pathname} → Tab: ${tabFromPath} → Active submenu: ${activeSubmenu}`);

    // Si un sous-menu est actif, ouvrir le menu correspondant automatiquement sur desktop
    if (activeSubmenu && tabFromPath && !isMobile) {
      setActiveTab(tabFromPath);
      setIsMenuOpen(true);
    }

    // Sur mobile, nous ne gardons pas le menu ouvert automatiquement
    if (isMobile) {
      setIsMenuOpen(false);
    }
  }, [pathname, isMobile]);

  // Détecter scroll + mobile
  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 0);
    const handleResize = () => setIsMobile(window.innerWidth < 768);

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
    // Sinon, activer l'onglet survolé et ouvrir le menu
    else {
      setActiveTab(tab);
      setIsMenuOpen(true);
    }
  };

  /* ──────────────────────────  Render  ────────────────────────── */

  return (
    <>
      {/* Styles globaux pour le header */}
      <style jsx global>{headerStyles}</style>

      <div className="px-4 sm:px-6 md:px-[40px] lg:px-[80px] pt-4 sm:pt-6 sticky-header-container">
        <motion.header
          className={`bg-[#F5F5F5] w-full rounded-[20px] sm:rounded-[40px] overflow-hidden shadow-sm transition-all duration-300 ease-in-out ${hasScrolled
            ? "fixed top-0 left-0 right-0 z-[9999] rounded-none sm:rounded-none shadow-lg"
            : ""
            }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ─────────────  Bandeau supérieur  ───────────── */}
          <div className="py-3 sm:py-5">
            <div className="px-4 sm:px-8 md:px-12 lg:px-20 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
              {/* Logo + Tabs */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:space-x-6 md:space-x-12 w-full sm:w-auto">
                <Link href="/" className="flex items-center group">
                  <Image
                    src="/logo.png"
                    alt="Ma CIE en ligne"
                    width={180}
                    height={60}
                    className="w-[140px] sm:w-[160px] md:w-[180px] h-auto transition-transform duration-300 group-hover:scale-105"
                    priority
                  />
                </Link>

                <nav
                  className="relative flex items-center space-x-4 sm:space-x-6 md:space-x-8 mt-2 sm:mt-0"
                  onMouseLeave={() => handleTabHover(null)}
                >
                  {(["particulier", "business", "institution"] as const).map(
                    (tab) => (
                      <button
                        key={tab}
                        className={`relative text-base sm:text-lg md:text-xl text-noir hover:text-orange transition-all duration-300 ${activeTab === tab ? "font-semibold" : ""
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
                            className="absolute left-0 right-0 -bottom-2 sm:-bottom-3 mx-auto h-[6px] sm:h-[10px] w-full bg-orange shadow-sm rounded-full"
                            style={{ opacity: 1 }}
                          />
                        )}
                      </button>
                    )
                  )}
                </nav>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-4">
                <Link
                  href="/solutions-eco"
                  className="bg-[#F5F5F5] border border-vert hover:bg-white font-semibold text-vert w-full sm:w-[180px] md:w-[233px] h-[45px] sm:h-[55px] px-4 sm:px-6 md:px-10 py-[10px] sm:py-[15px] rounded-[30px] sm:rounded-[40px] transition-all duration-300 text-xs sm:text-sm flex items-center justify-center gap-[10px] hover:scale-105 hover:shadow-lg"
                >
                  <Ecostore />
                  <span>Ecostore</span>
                </Link>

                <Link
                  href="/login"
                  className="bg-orange hover:bg-noir font-semibold text-white w-full sm:w-[180px] md:w-[233px] h-[45px] sm:h-[55px] px-4 sm:px-6 md:px-10 py-[10px] sm:py-[15px] rounded-[30px] sm:rounded-[40px] transition-all duration-300 text-xs sm:text-sm flex items-center justify-center gap-[10px] hover:scale-105 hover:shadow-lg"
                >
                  <UserSolo />
                  <span>Mon compte</span>
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
                className="w-full px-4 sm:px-8 md:px-12 lg:px-20 py-4 sm:py-6 md:py-8"
                onMouseEnter={() => hoverTimeout && clearTimeout(hoverTimeout)}
                onMouseLeave={() => handleTabHover(null)}
              >
                {/* Fermeture mobile */}
                {isMobile && (
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-300"
                    aria-label="Fermer le menu"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
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
                <div className="w-full mb-6">
                  <p className="text-xl font-semibold text-noir ">
                    {activeTab === "particulier"
                      ? "Vous êtes particulier professionnel ou particulier domicile"
                      : activeTab === "business"
                        ? "Vous êtes domestique HT ou professionnel HT?"
                        : "Vous êtes une administration?"}
                  </p>
                </div>

                {/* Grille de colonnes */}
                <div className="bg-[#f1f1f1] flex flex-col md:flex-row items-start gap-8 p-6 rounded-xl shadow-sm">
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
                      className={`border-2 p-3 sm:p-5 gap-4 sm:gap-8 ${pathname === "/mes-demandes" ? "border-orange bg-orange/5" : "border-white"} rounded-[30px] sm:rounded-[50px] w-full flex max-w-md justify-center items-center hover:bg-gray-100 transition-all duration-300 hover:shadow-md cursor-pointer`}
                      onClick={() => (window.location.href = "/mes-demandes")}
                    >
                      <div>
                        <Image
                          src="/profile.png"
                          alt="profile"
                          width={80}
                          height={15}
                          className="w-[50px] sm:w-[80px] h-auto transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <div className="flex flex-col gap-1 sm:gap-2">
                        <p className="font-bold text-base sm:text-xl">
                          Mes demandes
                        </p>
                        <p className="text-xs sm:text-sm">
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
