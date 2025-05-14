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

interface SlideCarouselProps {
  slides: CompteurSlide[];
}

export default function SlideCarousel({ slides }: SlideCarouselProps) {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const [direction, setDirection] = useState<number>(1);

  // Optimiser les fonctions de navigation avec useCallback
  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setDirection(1);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setDirection(-1);
  }, [slides.length]);

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > activeSlide ? 1 : -1);
      setActiveSlide(index);
      // Pause autoplay temporarily when manually navigating
      setAutoPlay(false);
      setTimeout(() => setAutoPlay(true), 6000);
    },
    [activeSlide]
  );

  // Écouter les changements de menu
  useEffect(() => {
    const handleMenuChange = (e: CustomEvent) => {
      // Utiliser l'événement si nécessaire
      console.log("Menu changé:", e.detail);
      setActiveSlide(0); // Réinitialiser à la première diapositive lors du changement de menu
    };

    document.addEventListener(
      "menu-changed",
      handleMenuChange as EventListener
    );

    return () => {
      document.removeEventListener(
        "menu-changed",
        handleMenuChange as EventListener
      );
    };
  }, []);

  // Défilement automatique
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [autoPlay, nextSlide]);

  // Navigation au clavier
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key >= "1" && e.key <= String(slides.length)) {
        const index = parseInt(e.key) - 1;
        if (index >= 0 && index < slides.length) {
          goToSlide(index);
        }
      }
    },
    [nextSlide, prevSlide, goToSlide, slides.length]
  );

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

  return (
    <div
      className="flex-1"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Carrousel de compteurs"
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={activeSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
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
                src={slides[activeSlide].image}
                alt={`Compteur - ${slides[activeSlide].title}`}
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
              {slides[activeSlide].title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-[600px]"
            >
              {slides[activeSlide].description}
            </motion.p>

            {/* Navigation dots */}
            <div
              className="flex items-center justify-start mt-8 sm:mt-10 gap-2"
              role="tablist"
            >
              {slides.map((_, index) => (
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
  );
}
