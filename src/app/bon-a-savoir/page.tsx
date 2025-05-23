"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
}

const compteurSlides: Slide[] = [
  {
    id: 1,
    title: "Qu'est ce qu'un compteur électrique?",
    description:
      "Les compteurs nouvelle génération offrent aux clients un meilleur contrôle de leur consommation, une facturation flexible (paiement ou prépaiement) et une utilisation simplifiée grâce à un écran et un pavé numérique.",
    image: "/compteur/compteur4.png",
  },
  {
    id: 2,
    title: "Comment lire votre compteur?",
    description:
      "L'écran affiche alternativement l'index de consommation et la puissance utilisée, navigation simple via le pavé numérique.",
    image: "/compteur/compteur4.png",
  },
  {
    id: 3,
    title: "Prépaiement vs Postpaiement",
    description:
      "Choisissez entre recharger votre compteur à l'avance ou payer après consommation selon vos préférences et habitudes.",
    image: "/compteur/compteur4.png",
  },
];

const disjoncteurSlides: Slide[] = [
  {
    id: 1,
    title: "Qu'est-ce qu'un disjoncteur?",
    description:
      "Le disjoncteur est un dispositif de protection qui coupe automatiquement le courant en cas de surcharge ou de court-circuit, protégeant ainsi votre installation électrique.",
    image: "/bonasavoir/disjoncteur.png",
  },
  {
    id: 2,
    title: "Types de disjoncteurs",
    description:
      "Il existe différents types de disjoncteurs : différentiels, magnétothermiques, et divisionnaires, chacun ayant un rôle spécifique dans la protection de votre installation.",
    image: "/bonasavoir/disjoncteur.png",
  },
  {
    id: 3,
    title: "Fonctionnement du disjoncteur",
    description:
      "Le disjoncteur surveille en permanence l'intensité du courant et déclenche automatiquement en cas d'anomalie pour prévenir les risques d'incendie.",
    image: "/bonasavoir/disjoncteur.png",
  },
];

const tableauComptageSlides: Slide[] = [
  {
    id: 1,
    title: "Tableau de comptage principal",
    description: "",
    image: "/bonasavoir/coffret à fusible.png",
  },
  {
    id: 2,
    title: "Tableau divisionnaire",
    description: "",
    image: "/bonasavoir/disjoncteur.png",
  },
  {
    id: 3,
    title: "Tableau de protection",
    description: "",
    image: "/compteur/compteur4.png",
  },
];

const slidesByCategory: Record<string, Slide[]> = {
  "Nos compteurs": compteurSlides,
  "Votre disjoncteur": disjoncteurSlides,
  "Tableau de comptage": tableauComptageSlides,
};

export default function BonASavoirPage() {
  const [activeMenu, setActiveMenu] = useState<string>("Nos compteurs");
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);

  // Liste des éléments du menu
  const menuItems = [
    "Nos compteurs",
    "Votre disjoncteur",
    "Tableau de comptage",
  ];

  // Optimiser les fonctions de navigation avec useCallback
  const nextSlide = useCallback(() => {
    const currentSlides = slidesByCategory[activeMenu];
    setActiveSlide((prev) =>
      prev === currentSlides.length - 1 ? 0 : prev + 1
    );
  }, [activeMenu]);

  const prevSlide = useCallback(() => {
    const currentSlides = slidesByCategory[activeMenu];
    setActiveSlide((prev) =>
      prev === 0 ? currentSlides.length - 1 : prev - 1
    );
  }, [activeMenu]);

  const goToSlide = useCallback((index: number) => {
    setActiveSlide(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 6000);
  }, []);

  const handleMenuClick = useCallback((item: string) => {
    setActiveMenu(item);
    setActiveSlide(0);
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
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key >= "1" && e.key <= "5") {
        const index = parseInt(e.key) - 1;
        if (index >= 0 && index < slidesByCategory[activeMenu].length) {
          goToSlide(index);
        }
      }
    },
    [nextSlide, prevSlide, goToSlide, activeMenu]
  );

  // Signaler que l'image est chargée
  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  // Variantes pour les animations des slides
  const slideVariants = {
    enter: (direction: number) => ({
      y: 20,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      y: -20,
      opacity: 0,
    }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const [direction, setDirection] = useState<number>(1);

  // Mise à jour de la direction pour les animations
  useEffect(() => {
    setDirection(1);
  }, [activeSlide]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12  "
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
            className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold text-noir sm:mb-8 md:mb-10 relative inline-block"
          >
            Bon à savoir
            <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange to-transparent"></div>
          </motion.h1>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 sm:mt-10">
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
                    className={`flex items-center w-full text-left p-3 border-l-4 transition-all duration-300 ${
                      activeMenu === item
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
                    <span className="text-base sm:text-lg">{item}</span>
                  </motion.button>
                ))}
              </nav>
            </motion.div>

            {/* Main content area */}
            <div className="flex-1">
              <div
                className={`flex ${
                  activeMenu === "Tableau de comptage"
                    ? "justify-center"
                    : "flex-col lg:flex-row gap-8 lg:gap-12"
                }`}
              >
                {/* Image Section - Fixe à gauche, sauf pour Tableau de comptage */}
                {activeMenu !== "Tableau de comptage" && (
                  <motion.div
                    className="w-full lg:w-1/2 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isLoaded ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative">
                      <img
                        src={slidesByCategory[activeMenu][0].image}
                        alt={`${activeMenu}`}
                        width={500}
                        height={500}
                        loading="eager"
                        className="object-contain w-full h-auto drop-shadow-lg transition-all duration-300"
                        onError={(e) => {
                          const imgElement =
                            e.currentTarget as HTMLImageElement;
                          imgElement.src = "/compteur/compteur4.png";
                        }}
                        onLoad={handleImageLoad}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Content Section - Défilant à droite ou grille centrée */}
                <div
                  className={`${
                    activeMenu === "Tableau de comptage"
                      ? "w-full max-w-5xl"
                      : "w-full lg:w-1/2"
                  }`}
                >
                  {activeMenu === "Tableau de comptage" ? (
                    // Affichage spécial pour le tableau de comptage
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4 place-items-center">
                      {tableauComptageSlides.map((slide, index) => (
                        <motion.div
                          key={slide.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.2 }}
                          className="flex flex-col items-center bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-xs"
                        >
                          <div className="relative w-full mb-4">
                            <img
                              src={slide.image}
                              alt={slide.title}
                              width={220}
                              height={220}
                              className="object-contain w-full h-auto drop-shadow-lg rounded-lg"
                              loading={index === 0 ? "eager" : "lazy"}
                              onError={(e) => {
                                const imgElement =
                                  e.currentTarget as HTMLImageElement;
                                if (slide.image !== "/compteur/compteur4.png") {
                                  imgElement.src = "/compteur/compteur4.png";
                                }
                              }}
                            />
                          </div>
                          <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                              {slide.title}
                            </h3>
                            <div className="w-16 h-1 bg-orange mx-auto rounded-full"></div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    // Carrousel normal pour les autres sections
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div
                        key={activeMenu + "-" + activeSlide}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          y: { type: "spring", stiffness: 300, damping: 30 },
                          opacity: { duration: 0.4 },
                        }}
                        className="flex flex-col justify-center h-full"
                      >
                        <motion.h2
                          variants={textVariants}
                          initial="hidden"
                          animate="visible"
                          className="text-2xl sm:text-3xl font-bold text-black mb-4 sm:mb-5"
                        >
                          {slidesByCategory[activeMenu][activeSlide].title}
                        </motion.h2>
                        <motion.p
                          variants={textVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.2 }}
                          className="text-base sm:text-lg text-gray-700 leading-relaxed"
                        >
                          {
                            slidesByCategory[activeMenu][activeSlide]
                              .description
                          }
                        </motion.p>

                        {/* Navigation dots */}
                        <motion.div
                          variants={textVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: 0.3 }}
                          className="flex items-center justify-start mt-8 sm:mt-10 gap-2"
                          role="tablist"
                        >
                          {slidesByCategory[activeMenu].map((_, index) => (
                            <motion.button
                              key={index}
                              onClick={() => goToSlide(index)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`h-3 rounded-full transition-all duration-300 ${
                                activeSlide === index
                                  ? "bg-orange w-8"
                                  : "bg-gray-300 w-3 hover:bg-gray-400"
                              }`}
                              aria-label={`Slide ${index + 1}`}
                              aria-selected={activeSlide === index}
                              role="tab"
                              tabIndex={0}
                            />
                          ))}
                        </motion.div>

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
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
