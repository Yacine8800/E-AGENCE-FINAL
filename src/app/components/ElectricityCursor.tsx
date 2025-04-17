"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ElectricityCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isScrolling, setIsScrolling] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorVariant, setCursorVariant] = useState("default");
  const [showTrail, setShowTrail] = useState(false);
  const [trailPositions, setTrailPositions] = useState<
    { x: number; y: number }[]
  >([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if we're on a mobile device or small screen
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add listener for window resize
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    // Early return if mobile - don't set up cursor effects
    if (isMobile) return;
    
    let scrollTimeout: NodeJS.Timeout;
    let mousePositions: { x: number; y: number }[] = [];
    let lastMouseMove = Date.now();

    const handleMouseMove = (e: MouseEvent) => {
      const currentPosition = { x: e.clientX, y: e.clientY };
      setMousePosition(currentPosition);

      // Créer un effet de traînée quand le mouvement est rapide
      const now = Date.now();
      const timeDelta = now - lastMouseMove;
      lastMouseMove = now;

      if (timeDelta < 100) {
        // Si mouvement rapide
        // Ajouter la position actuelle au début du tableau
        mousePositions = [currentPosition, ...mousePositions.slice(0, 5)];
        setShowTrail(true);
        setTrailPositions(mousePositions);
      } else {
        if (showTrail) {
          setTimeout(() => setShowTrail(false), 300);
        }
      }

      // Détecter si le curseur est sur un élément cliquable
      const targetElement = e.target as HTMLElement;
      const isClickable =
        targetElement.tagName === "BUTTON" ||
        targetElement.tagName === "A" ||
        targetElement.closest("button") ||
        targetElement.closest("a") ||
        window.getComputedStyle(targetElement).cursor === "pointer";

      setIsHovering(!!isClickable);
      setCursorVariant(
        isClickable ? "hover" : isScrolling ? "scroll" : "default"
      );
    };

    const handleScroll = () => {
      setIsScrolling(true);
      setCursorVariant("scroll");

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
        setCursorVariant(isHovering ? "hover" : "default");
      }, 150);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      setCursorVariant("click");
    };

    const handleMouseUp = () => {
      setIsClicking(false);
      setCursorVariant(
        isHovering ? "hover" : isScrolling ? "scroll" : "default"
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      clearTimeout(scrollTimeout);
    };
  }, [isHovering, isScrolling, showTrail, isMobile]);

  // Variants pour les animations du curseur
  const cursorVariants = {
    default: {
      width: 30,
      height: 30,
      x: -15,
      y: -15,
      backgroundColor: "rgba(71, 181, 176, 0.2)",
      mixBlendMode: "normal" as const,
      borderWidth: 2,
    },
    hover: {
      width: 40,
      height: 40,
      x: -20,
      y: -20,
      backgroundColor: "rgba(71, 181, 176, 0.3)",
      borderWidth: 3,
    },
    scroll: {
      width: 40,
      height: 40,
      x: -20,
      y: -20,
      scale: [1, 1.2, 1],
      backgroundColor: "rgba(71, 181, 176, 0.35)",
      borderWidth: 3,
    },
    click: {
      width: 35,
      height: 35,
      x: -17.5,
      y: -17.5,
      scale: 0.9,
      backgroundColor: "rgba(71, 181, 176, 0.4)",
      borderWidth: 4,
    },
  };

  // Variants pour l'éclair
  const boltVariants = {
    default: {
      scale: 0.8,
      opacity: 0.8,
      rotate: 0,
    },
    hover: {
      scale: 1.1,
      opacity: 1,
      rotate: 0,
    },
    scroll: {
      scale: [0.9, 1.2, 0.9],
      opacity: 1,
      rotate: [0, 5, -5, 0],
    },
    click: {
      scale: 1.3,
      opacity: 1,
      rotate: 10,
    },
  };

  // Effet de halo électrique
  const glowVariants = {
    default: {
      opacity: 0.3,
      scale: 1.2,
    },
    hover: {
      opacity: 0.5,
      scale: 1.3,
    },
    scroll: {
      opacity: [0.3, 0.7, 0.3],
      scale: [1.2, 1.4, 1.2],
    },
    click: {
      opacity: 0.8,
      scale: 1.5,
    },
  };

  // If on mobile, don't render the cursor
  if (isMobile) return null;

  return (
    <>
      {/* Effet de traînée électrique */}
      <AnimatePresence>
        {showTrail &&
          trailPositions.map((pos, index) => (
            <motion.div
              key={`trail-${index}`}
              className="fixed pointer-events-none z-[10000]"
              initial={{
                opacity: 0.7 - index * 0.15,
                scale: 0.8 - index * 0.1,
              }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              style={{
                left: pos.x,
                top: pos.y,
                translateX: "-50%",
                translateY: "-50%",
              }}
              transition={{ duration: 0.3 }}
            >
              <svg
                width={20 - index * 2}
                height={20 - index * 2}
                viewBox="0 0 24 24"
                fill="none"
                className="text-[#47B5B0]"
              >
                <path
                  d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="rgba(71, 181, 176, 0.3)"
                />
              </svg>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Curseur personnalisé */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
        }}
      >
        {/* Halo extérieur */}
        <motion.div
          className="absolute rounded-full"
          variants={glowVariants}
          animate={cursorVariant}
          transition={{ duration: 0.3 }}
          style={{
            boxShadow: "0 0 15px rgba(71, 181, 176, 0.6)",
            backgroundColor: "rgba(71, 181, 176, 0.15)",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
          }}
        />

        {/* Cercle principal */}
        <motion.div
          className="rounded-full border border-[#47B5B0] flex items-center justify-center"
          variants={cursorVariants}
          animate={cursorVariant}
          transition={{ duration: 0.2 }}
        >
          {/* Icône d'éclair */}
          <motion.div
            variants={boltVariants}
            animate={cursorVariant}
            transition={{
              duration: 0.3,
              scale: { duration: 0.4, repeat: isScrolling ? Infinity : 0 },
              rotate: { duration: 0.4, repeat: isScrolling ? Infinity : 0 },
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#47B5B0"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Effet d'étincelle lors du clic */}
        <AnimatePresence>
          {isClicking && (
            <motion.div
              className="absolute"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 2 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                <path
                  d="M25 0L28 20H42L25 30L32 50L15 32L0 40L10 25L0 10L20 18L25 0Z"
                  fill="rgba(71, 181, 176, 0.6)"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Cache le curseur par défaut */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
};

export default ElectricityCursor;
