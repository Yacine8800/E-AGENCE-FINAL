"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ElectricityEffect = () => {
  const [_isScrolling, setIsScrolling] = useState(false);
  const [_scrollVelocity, setScrollVelocity] = useState(0);
  const [showEffect, setShowEffect] = useState(false);
  const [_lastScrollTop, setLastScrollTop] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
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

    let scrollTimeout: NodeJS.Timeout;
    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();

    const handleScroll = () => {
      const currentTime = Date.now();
      const timeDelta = currentTime - lastScrollTime;
      const scrollDelta = Math.abs(window.scrollY - lastScrollY);

      // Calculer la vitesse de défilement
      const velocity = timeDelta > 0 ? scrollDelta / timeDelta : 0;
      setScrollVelocity(velocity * 100); // Ajuster pour une échelle plus visible

      // Détecter si le défilement est assez rapide pour déclencher l'effet
      if (velocity > 0.3) {
        // Seuil de vitesse pour déclencher l'effet
        setIsScrolling(true);

        // Positionner l'effet aléatoirement le long de la barre de défilement
        const viewportHeight = window.innerHeight;
        const xPosition = window.innerWidth - Math.random() * 80 - 20; // Côté droit
        const yPosition = Math.random() * viewportHeight;

        setPosition({ x: xPosition, y: yPosition });

        // Montrer l'effet avec une faible probabilité
        if (Math.random() < 0.2) {
          setShowEffect(true);

          // Cacher l'effet après une courte durée
          setTimeout(() => {
            setShowEffect(false);
          }, 300);
        }
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 100);

      lastScrollY = window.scrollY;
      lastScrollTime = currentTime;

      // Mettre à jour lastScrollTop pour la direction
      setLastScrollTop(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isMobile]);

  // Don't render on mobile
  if (isMobile) return null;

  return (
    <AnimatePresence>
      {showEffect && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "fixed",
            top: position.y,
            right: position.x,
            zIndex: 60,
            pointerEvents: "none",
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
              stroke="#47B5B0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            />
            <motion.path
              d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
              fill="#47B5B0"
              initial={{ fillOpacity: 0 }}
              animate={{ fillOpacity: 0.7 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            />
          </svg>

          {/* Effet de lueur */}
          <motion.div
            className="absolute inset-0 bg-[#47B5B0] blur-xl rounded-full"
            style={{ opacity: 0.4 }}
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ElectricityEffect;
