

"use client";

import { useState, useEffect, useCallback, KeyboardEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface RisqueSection {
  id: number;
  title: string;
  description: string;
  image: string;
}

// Sections des risques électriques
const risqueSections: RisqueSection[] = [
  {
    id: 1,
    title: "Les ouvrages électriques",
    description: "Respectez les distances autour des lignes électriques : 5 m pour les lignes 15 à 33 kV, 15 m pour celles de 90 kV, 30 m pour les 225 kV. Tenez compte des objets manipulés (outils, perches...). Ne touchez jamais aux pylônes, poteaux ou câbles, même de loin.",
    image: "/compteur/compteur4.png"
  },
  {
    id: 2,
    title: "Installations électriques",
    description: "Avant de toucher un appareil, coupez toujours le courant. Évitez toute manipulation les mains ou pieds mouillés. En cas d'incendie électrique, n'utilisez jamais d'eau. Appelez le CIE et les pompiers après avoir coupé l'alimentation.",
    image: "/compteur/compteur4.png"
  },
  {
    id: 3,
    title: "Installations intérieurs",
    description: "Faites installer votre électricité par un pro, selon les normes. Vérifiez que votre tableau contient bien fusibles, disjoncteur et compteur. Avant toute réparation ou changement d'ampoule : coupez le courant.",
    image: "/compteur/compteur4.png"
  }
];

export default function RisquesElectriquesPage() {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);

  // Optimiser les fonctions de navigation avec useCallback
  const nextSection = useCallback(() => {
    setActiveSection((prev) => (prev === risqueSections.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSection = useCallback(() => {
    setActiveSection((prev) => (prev === 0 ? risqueSections.length - 1 : prev - 1));
  }, []);

  const goToSection = useCallback((index: number) => {
    setActiveSection(index);
    // Pause autoplay temporarily when manually navigating
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 6000);
  }, []);

  // Défilement automatique
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      nextSection();
    }, 6000);

    return () => clearInterval(interval);
  }, [activeSection, autoPlay, nextSection]);

  // Navigation au clavier
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      nextSection();
    } else if (e.key === 'ArrowLeft') {
      prevSection();
    } else if (e.key >= '1' && e.key <= '3') {
      const index = parseInt(e.key) - 1;
      if (index >= 0 && index < risqueSections.length) {
        goToSection(index);
      }
    }
  }, [nextSection, prevSection, goToSection]);

  // Signaler que l'image est chargée
  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  // Variantes pour les animations des slides
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState<number>(1);

  // Mise à jour de la direction pour les animations
  useEffect(() => {
    setDirection(1);
  }, [activeSection]);

  return (
    <div
      className="min-h-screen flex items-center justify-center mt-10 mb-10 px-4 lg:-mt-16 lg:-mb-16 sm:px-6 md:px-8 lg:px-10 xl:px-12"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Risques électriques"
    >
      <div className="w-[96%] bg-[#F3F3F3] rounded-[40px] py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          {/* Header animé */}
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold text-noir mb-6 sm:mb-8 md:mb-10 relative inline-block"
          >
            Risques électriques
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange to-transparent"
            ></motion.div>
          </motion.h1>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 mt-8 sm:mt-10">
            {/* Left sidebar navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full lg:w-72 flex-shrink-0"
            >
              <nav className="space-y-1" aria-label="Menu">
                {risqueSections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    onClick={() => goToSection(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center w-full text-left p-3 border-l-4 transition-all duration-300 ${activeSection === index
                      ? "border-l-orange bg-white shadow-sm font-medium text-gray-900"
                      : "border-l-transparent hover:bg-white/70 text-gray-700"
                      }`}
                    aria-pressed={activeSection === index}
                    aria-label={section.title}
                    tabIndex={0}
                  >
                    {activeSection === index ? (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mr-2 text-orange"
                      >
                        ▶
                      </motion.span>
                    ) : (
                      <span className="mr-2 opacity-0">▶</span>
                    )}
                    <span className="text-base sm:text-lg">
                      {section.title}
                    </span>
                  </motion.button>
                ))}
              </nav>

              {/* Contrôle du défilement automatique */}
              {/* <div className="mt-6 pl-3">
                <motion.button
                  onClick={() => setAutoPlay(!autoPlay)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <span className={`mr-2 ${autoPlay ? 'text-orange' : 'text-gray-400'}`}>
                    {autoPlay ? '⏸️' : '▶️'}
                  </span>
                  {autoPlay ? 'Défilement automatique actif' : 'Défilement automatique arrêté'}
                </motion.button>
              </div> */}
            </motion.div>

            {/* Main content area */}
            <div className="flex-1">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`section-${activeSection}`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 }
                  }}
                  className="flex flex-col lg:flex-row gap-8 lg:gap-12"
                >
                  {/* Image Section */}
                  <motion.div
                    className="w-full lg:w-1/2 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isLoaded ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image
                      src={risqueSections[activeSection].image}
                      alt={`Illustration - ${risqueSections[activeSection].title}`}
                      width={550}
                      height={550}
                      priority
                      quality={90}
                      className="object-contain w-full h-auto drop-shadow-lg transition-all duration-300"
                      onError={(e) => {
                        const imgElement = e.target as HTMLImageElement;
                        imgElement.src = "/compteur/compteur4.png";
                      }}
                      onLoad={handleImageLoad}
                    />
                  </motion.div>

                  {/* Content Section */}
                  <div className="w-full lg:w-1/2 flex flex-col justify-center">
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="text-2xl sm:text-3xl font-bold text-black mb-4 sm:mb-5"
                    >
                      {risqueSections[activeSection].title}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-[600px]"
                    >
                      {risqueSections[activeSection].description}
                    </motion.p>

                    {/* Navigation dots */}
                    <div className="flex items-center justify-start mt-8 sm:mt-10 gap-3 sm:gap-4" role="tablist">
                      {risqueSections.map((_, index) => (
                        <motion.button
                          key={index}
                          onClick={() => goToSection(index)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`h-2.5 rounded-full transition-all duration-300 ${activeSection === index
                            ? "bg-orange w-8 sm:w-10"
                            : "bg-gray-300 w-2.5 hover:bg-gray-400"
                            }`}
                          aria-label={`Section ${index + 1}`}
                          aria-selected={activeSection === index}
                          role="tab"
                          tabIndex={0}
                        />
                      ))}
                    </div>

                    {/* Indicateur de progression du défilement automatique */}
                    {autoPlay && (
                      <motion.div
                        key={`progress-${activeSection}`}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 6, ease: "linear" }}
                        className="h-0.5 bg-gradient-to-r from-orange to-amber-500 mt-4 rounded-full opacity-60"
                      />
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
