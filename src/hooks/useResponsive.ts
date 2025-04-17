
'use client'
import { useState, useEffect } from "react";

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(false); // Par défaut : desktop (évite l'erreur SSR)
  const [isTablet, setIsTablet] = useState(false); // Par défaut : desktop (évite l'erreur SSR)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 959);
        setIsTablet(window.innerWidth >= 960 && window.innerWidth <= 2500);
      };

      // Détection initiale
      handleResize();

      // Ajout de l'event listener
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return { isMobile, isTablet };
}
