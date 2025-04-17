"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const EnergyScrollbar = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on a mobile device or small screen
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobile();

    // Add listener for window resize
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    // Early return if mobile
    if (isMobile) return;

    const calculateScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollable = documentHeight - windowHeight;

      if (scrollable > 0) {
        const percentage = (scrollTop / scrollable) * 100;
        setScrollPercentage(percentage);
        setIsVisible(scrollTop > 200); // Apparaît après avoir scrollé un peu
      }
    };

    window.addEventListener("scroll", calculateScroll);
    calculateScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", calculateScroll);
  }, [isMobile]);

  // Don't render on mobile
  if (isMobile) return null;

  return (
    <motion.div
      className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 h-64 flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Barre de progression */}
      <div className="h-full w-3 bg-white/10 backdrop-blur-sm rounded-full relative overflow-hidden border border-gray-200/20">
        <motion.div
          className="absolute bottom-0 w-full bg-gradient-to-t from-[#47B5B0] to-[#358e8a]"
          style={{ height: `${scrollPercentage}%` }}
          animate={{
            boxShadow: [
              "0 0 5px #47B5B0",
              "0 0 15px #47B5B0",
              "0 0 5px #47B5B0",
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Indicateurs de sections */}
        {[20, 40, 60, 80].map((position) => (
          <div
            key={position}
            className="absolute w-3 h-0.5 bg-white/30 right-0"
            style={{ bottom: `${position}%` }}
          />
        ))}
      </div>

      {/* Icônes d'électricité */}
      <motion.div
        className="absolute right-0 bottom-0 text-[#47B5B0] text-xs font-bold flex flex-col items-center"
        style={{ bottom: `${scrollPercentage}%` }}
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="rotate-90"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>

        {/* Pourcentage */}
        <div className="mt-1 text-[10px] bg-[#47B5B0] text-white px-1.5 py-0.5 rounded-full">
          {Math.round(scrollPercentage)}%
        </div>
      </motion.div>

      {/* Étiquette d'énergie */}
      <div className="absolute -left-16 top-0 text-xs font-medium text-[#47B5B0]">
        Énergie
      </div>
      <div className="absolute -left-16 bottom-0 text-xs font-medium text-[#47B5B0]">
        Économie
      </div>
    </motion.div>
  );
};

export default EnergyScrollbar;
