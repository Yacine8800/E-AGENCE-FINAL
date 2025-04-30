"use client";

import { useState, useEffect, useCallback, KeyboardEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface CompteurSlide {
  id: number;
  title: string;
  description: string;
  image: string;
}

const compteurSlides: CompteurSlide[] = [
  {
    id: 1,
    title: "Qu'est ce qu'un compteur électrique?",
    description: "Les compteurs nouvelle génération offrent aux clients un meilleur contrôle de leur consommation, une facturation flexible (paiement ou prépaiement) et une utilisation simplifiée grâce à un écran et un pavé numérique.",
    image: "/compteur/compteur4.png"
  },
  {
    id: 2,
    title: "Comment lire votre compteur?",
    description: "L'écran affiche alternativement l'index de consommation et la puissance utilisée, navigation simple via le pavé numérique.",
    image: "/compteur/compteur4.png"
  },
  {
    id: 3,
    title: "Prépaiement vs Postpaiement",
    description: "Choisissez entre recharger votre compteur à l'avance ou payer après consommation selon vos préférences et habitudes.",
    image: "/compteur/compteur4.png"
  },
  {
    id: 4,
    title: "Entretien de votre compteur",
    description: "Gardez votre compteur accessible et protégé, contactez nos services en cas de dysfonctionnement, aucun entretien spécifique requis.",
    image: "/compteur/compteur4.png"
  },
  {
    id: 5,
    title: "Sécurité et votre compteur",
    description: "Ne jamais modifier ou réparer votre compteur vous-même, les compteurs sont équipés de systèmes de sécurité intégrés.",
    image: "/compteur/compteur4.png"
  }
];

export default function BonASavoirPage() {
  const [activeMenu, setActiveMenu] = useState<string>("Nos compteurs");
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);

  // Liste des éléments du menu
  const menuItems = [
    "Nos compteurs",
    "Votre disjoncteur",
    "Tableau de comptage"
  ];

  // Optimiser les fonctions de navigation avec useCallback
  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev === compteurSlides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev === 0 ? compteurSlides.length - 1 : prev - 1));
  }, []);

  const goToSlide = useCallback((index: number) => {
    setActiveSlide(index);
    // Pause autoplay temporarily when manually navigating
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 6000);
  }, []);

  const handleMenuClick = useCallback((item: string) => {
    setActiveMenu(item);
    setActiveSlide(0); // Reset slide position when changing menu
  }, []);

  // Défilement automatique
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [activeSlide, autoPlay, nextSlide]);

  // Navigation au clavier
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key >= '1' && e.key <= '5') {
      const index = parseInt(e.key) - 1;
      if (index >= 0 && index < compteurSlides.length) {
        goToSlide(index);
      }
    }
  }, [nextSlide, prevSlide, goToSlide]);

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
  }, [activeSlide]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 -mt-[100px] sm:px-6 md:px-8 lg:px-10 xl:px-12 -mb-[100px]"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Bon à savoir"
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
            Bon à savoir
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange to-transparent"
            ></motion.div>
          </motion.h1>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 mt-8 sm:mt-10">
            {/* Left sidebar navigation - Maintenant avec style risques électriques */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full lg:w-72 flex-shrink-0"
            >
              <nav className="space-y-1" aria-label="Menu">
                {menuItems.map((item) => (
                  <motion.button
                    key={item}
                    onClick={() => handleMenuClick(item)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center w-full text-left p-3 border-l-4 transition-all duration-300 ${activeMenu === item
                      ? "border-l-orange bg-white shadow-sm font-medium text-gray-900"
                      : "border-l-transparent hover:bg-white/70 text-gray-700"
                      }`}
                    aria-pressed={activeMenu === item}
                    aria-label={item}
                    tabIndex={0}
                  >
                    {activeMenu === item ? (
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
                      {item}
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
                  key={activeMenu + '-' + activeSlide}
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
                    <div className="relative">

                      <Image
                        src={compteurSlides[activeSlide].image}
                        alt={`Compteur - ${compteurSlides[activeSlide].title}`}
                        width={500}
                        height={500}
                        priority
                        quality={90}
                        className="object-contain w-full h-auto drop-shadow-lg transition-all duration-300"
                        onError={(e) => {
                          const imgElement = e.target as HTMLImageElement;
                          imgElement.src = "/compteur/compteur4.png";
                        }}
                        onLoad={handleImageLoad}
                      />
                    </div>
                  </motion.div>

                  {/* Content Section */}
                  <div className="w-full lg:w-1/2 flex flex-col justify-center">
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="text-2xl sm:text-3xl font-bold text-black mb-4 sm:mb-5"
                    >
                      {compteurSlides[activeSlide].title}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-[600px]"
                    >
                      {compteurSlides[activeSlide].description}
                    </motion.p>

                    {/* Navigation dots */}
                    <div className="flex items-center justify-start mt-8 sm:mt-10 gap-2" role="tablist">
                      {compteurSlides.map((_, index) => (
                        <motion.button
                          key={index}
                          onClick={() => goToSlide(index)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`h-3 rounded-full transition-all duration-300 ${activeSlide === index
                            ? "bg-orange w-8"
                            : "bg-gray-300 w-3 hover:bg-gray-400"
                            }`}
                          aria-label={`Slide ${index + 1}`}
                          aria-selected={activeSlide === index}
                          role="tab"
                          tabIndex={0}
                        />
                      ))}
                    </div>

                    {/* Indicateur de progression du défilement automatique */}
                    {autoPlay && (
                      <motion.div
                        key={`progress-${activeSlide}`}
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
