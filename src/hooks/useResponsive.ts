"use client";
import { useState, useEffect } from "react";

/**
 * Hook amélioré pour la détection responsive
 * @returns Un objet contenant diverses propriétés de détection responsive
 */
export function useResponsive() {
  // États pour les différentes tailles d'écran
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isTabletSmall, setIsTabletSmall] = useState(false);
  const [isTabletLarge, setIsTabletLarge] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isDesktopLarge, setIsDesktopLarge] = useState(false);

  // État pour l'orientation
  const [isLandscape, setIsLandscape] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  // État pour les breakpoints exacts
  const [breakpoint, setBreakpoint] = useState("unknown");

  // Dimensions de l'écran
  const [screenWidth, setScreenWidth] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Fonction pour mettre à jour tous les états responsives
      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Mettre à jour les dimensions
        setScreenWidth(width);
        setScreenHeight(height);

        // Déterminer le breakpoint principal et les états correspondants
        if (width < 640) {
          setIsMobile(true);
          setIsTablet(false);
          setIsTabletSmall(false);
          setIsTabletLarge(false);
          setIsDesktop(false);
          setIsDesktopLarge(false);
          setBreakpoint("mobile");
        } else if (width >= 640 && width < 768) {
          setIsMobile(false);
          setIsTablet(true);
          setIsTabletSmall(true);
          setIsTabletLarge(false);
          setIsDesktop(false);
          setIsDesktopLarge(false);
          setBreakpoint("tablet-sm");
        } else if (width >= 768 && width < 1024) {
          setIsMobile(false);
          setIsTablet(true);
          setIsTabletSmall(false);
          setIsTabletLarge(true);
          setIsDesktop(false);
          setIsDesktopLarge(false);
          setBreakpoint("tablet-md");
        } else if (width >= 1024 && width < 1280) {
          setIsMobile(false);
          setIsTablet(false);
          setIsTabletSmall(false);
          setIsTabletLarge(false);
          setIsDesktop(true);
          setIsDesktopLarge(false);
          setBreakpoint("desktop");
        } else {
          setIsMobile(false);
          setIsTablet(false);
          setIsTabletSmall(false);
          setIsTabletLarge(false);
          setIsDesktop(true);
          setIsDesktopLarge(true);
          setBreakpoint("desktop-lg");
        }

        // Déterminer l'orientation
        const isLandscapeMode =
          width > height ||
          window.matchMedia("(orientation: landscape)").matches;
        setIsLandscape(isLandscapeMode);
        setIsPortrait(!isLandscapeMode);

        // Appliquer les attributs de données au document pour permettre le ciblage CSS
        document.documentElement.setAttribute(
          "data-device-type",
          width < 640
            ? "mobile"
            : width >= 640 && width < 1024
            ? "tablet"
            : "desktop"
        );

        document.documentElement.setAttribute(
          "data-orientation",
          isLandscapeMode ? "landscape" : "portrait"
        );

        if (width >= 640 && width < 1024) {
          document.documentElement.setAttribute(
            "data-tablet-size",
            width < 768 ? "small" : "large"
          );
        } else {
          document.documentElement.removeAttribute("data-tablet-size");
        }
      };

      // Détection initiale
      handleResize();

      // Ajouter les écouteurs d'événements
      window.addEventListener("resize", handleResize);
      window.addEventListener("orientationchange", handleResize);

      // Fonction de nettoyage
      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize);
      };
    }
  }, []);

  // Pour la compatibilité avec le code existant
  const isDesktopOnly = isDesktop && !isTablet && !isMobile;

  return {
    // Propriétés de base
    isMobile,
    isTablet,
    isDesktop,
    isDesktopLarge,
    isDesktopOnly,

    // Propriétés avancées
    isTabletSmall,
    isTabletLarge,
    isLandscape,
    isPortrait,

    // Dimensions précises
    screenWidth,
    screenHeight,

    // Chaîne de breakpoint actuel
    breakpoint,

    // Fonctions utilitaires
    matchesBreakpoint: (bp) => breakpoint === bp,
    isAtLeast: (bp) => {
      const breakpoints = [
        "mobile",
        "tablet-sm",
        "tablet-md",
        "desktop",
        "desktop-lg",
      ];
      const currentIndex = breakpoints.indexOf(breakpoint);
      const targetIndex = breakpoints.indexOf(bp);
      return currentIndex >= targetIndex;
    },
    isAtMost: (bp) => {
      const breakpoints = [
        "mobile",
        "tablet-sm",
        "tablet-md",
        "desktop",
        "desktop-lg",
      ];
      const currentIndex = breakpoints.indexOf(breakpoint);
      const targetIndex = breakpoints.indexOf(bp);
      return currentIndex <= targetIndex;
    },
  };
}

/**
 * Hook utilitaire pour appliquer des styles conditionnels basés sur la taille d'écran
 * @param {object} options - Objet contenant les styles pour différents breakpoints
 * @returns {string} - Classes CSS à appliquer
 *
 * Exemple d'utilisation:
 * <div className={useResponsiveClasses({
 *   base: 'text-sm p-2',
 *   mobile: 'bg-red-100',
 *   tablet: 'bg-blue-100',
 *   desktop: 'bg-green-100'
 * })}>Contenu responsive</div>
 */
export function useResponsiveClasses(options) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  let classes = options.base || "";

  if (isMobile && options.mobile) {
    classes += " " + options.mobile;
  }

  if (isTablet && options.tablet) {
    classes += " " + options.tablet;
  }

  if (isDesktop && options.desktop) {
    classes += " " + options.desktop;
  }

  return classes.trim();
}

/**
 * Hook pour détecter les changements d'orientation
 * @returns {object} Objet avec des propriétés d'orientation
 */
export function useOrientation() {
  const { isLandscape, isPortrait } = useResponsive();

  return {
    isLandscape,
    isPortrait,
    orientation: isLandscape ? "landscape" : "portrait",
  };
}

/**
 * Hook pour détecter si l'écran est au moins d'une certaine taille
 * @param {string} breakpoint - Le breakpoint minimal ('mobile', 'tablet-sm', 'tablet-md', 'desktop', 'desktop-lg')
 * @returns {boolean} True si l'écran est au moins de la taille spécifiée
 */
export function useMinBreakpoint(breakpoint) {
  const { isAtLeast } = useResponsive();
  return isAtLeast(breakpoint);
}

/**
 * Hook pour détecter si l'écran est au plus d'une certaine taille
 * @param {string} breakpoint - Le breakpoint maximal ('mobile', 'tablet-sm', 'tablet-md', 'desktop', 'desktop-lg')
 * @returns {boolean} True si l'écran est au plus de la taille spécifiée
 */
export function useMaxBreakpoint(breakpoint) {
  const { isAtMost } = useResponsive();
  return isAtMost(breakpoint);
}

export default useResponsive;
