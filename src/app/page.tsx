"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Ecostore from "./components/icons/EcoStore";

const VideoCarousel = dynamic(() => import("./components/VideoCarousel"), {
  ssr: false,
});

interface ServiceItem {
  title: string;
  description: string;
  image: string;
  className?: string;
  featured?: true;
}

const services: ServiceItem[] = [
  {
    title: "Postpayé",
    description: "Paiement après consommation avec facturation mensuelle.",
    image: "/compteur/compteur1.png",
  },
  {
    title: "Prépayé",
    description: "Rechargez à l'avance pour contrôler votre consommation.",
    image: "/compteur/compteur3.png",
    featured: true,
  },
  {
    title: "PEPT",
    description: "Programme d'Électrification Pour Tous, accès facilité.",
    image: "/compteur/compteur2.png",
  },
];

export default function Home() {
  // État local pour gérer le mode (sombre/claire)
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSection, setActiveSection] = useState("froid");
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Gestion du défilement tactile
  const handleMouseDown = (e) => {
    if (!isMobile || !carouselRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !carouselRef.current) return;
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Vitesse du défilement
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleOpenChatbot = () => {
    // Vérifier si la fonction globale existe
    if (typeof window !== "undefined") {
      // Vérifier si la fonction globale d'envoi de message est disponible
      if (typeof (window as any).__sendMessageToBot === "function") {
        console.log("Utilisation de la fonction globale __sendMessageToBot");
        const messageToSend =
          "Je souhaite des informations concernant le service.";
        // Appeler directement la fonction exposée par FloatingBot
        (window as any).__sendMessageToBot(messageToSend);
      } else {
        // Fallback: utiliser l'événement personnalisé avec le message dans detail
        console.log(
          "Fonction globale non disponible, utilisation de l'événement personnalisé"
        );
        const event = new CustomEvent("open-floating-bot-chat", {
          detail: {
            message: "Je souhaite des informations concernant le service.",
          },
        });
        document.dispatchEvent(event);
      }
    }
  };

  const router = useRouter();

  // Fonction pour inverser l'état au clic
  function toggleDarkMode() {
    setIsDarkMode((prev) => !prev);
  }

  // Fonction pour passer à la slide suivante
  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev === 3 ? 0 : prev + 1));
  }, []);

  // Fonction pour passer à la slide précédente
  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev === 0 ? 3 : prev - 1));
  }, []);

  // Gestion du défilement automatique avec un intervalle plus long
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isPaused) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000); // Augmenter l'intervalle de 3000ms à 5000ms pour donner plus de temps pour voir le contenu
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPaused, nextSlide]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    // Vérifier si l'utilisateur préfère le mode sombre
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (prefersDarkMode) {
      toggleDarkMode();
    }
  }, []);

  const CarouselIcon = ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* SVG paths pour l'icône */}
      <path
        d="M8 2V5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 2V5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 9.09H20.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.6947 13.7H15.7037"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.6947 16.7H15.7037"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.9955 13.7H12.0045"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.9955 16.7H12.0045"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.29431 13.7H8.30329"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.29431 16.7H8.30329"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Composant SimulationIcon pour le nouvel écran de simulation
  const SimulationIcon = ({ className }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 12H16.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.5V16.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="overflow-x-hidden w-full">
      <div className="py-4 sm:py-8">
        <VideoCarousel />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12 sm:space-y-16 mb-4 sm:mb-6">
        {/* Section 1 - Titre avec animation améliorée */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center px-2 sm:px-0"
        >
          <motion.div
            className="relative inline-block"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 sm:mb-6 relative z-10">
              Nos Offres d&apos;abonnement
            </h2>
            <motion.svg
              className="absolute -bottom-0 left-0 w-full"
              viewBox="0 0 200 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: isVisible ? 1 : 0,
                opacity: isVisible ? 1 : 0,
              }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
            >
              <motion.path
                d="M1 5.5C47.3333 2.16667 146.667 2.16667 199 5.5"
                stroke={"#47B5B0"}
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isVisible ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
              />
            </motion.svg>
          </motion.div>
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
            Sélectionnez le profil qui reflète vos habitudes de consommation
          </p>
        </motion.section>

        {/* Section 2 - Carrousel/Grid avec plus d'espace */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mb-10 sm:mb-12 relative"
        >
          {/* Indicateur de défilement sur mobile */}
          {isMobile && (
            <div className="flex justify-center space-x-1 mb-4">
              <div className="h-1 w-16 bg-gray-300 rounded-full">
                <motion.div
                  className="h-full bg-black rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              </div>
              <span className="text-xs text-gray-500">Faites défiler</span>
            </div>
          )}

          <div
            ref={carouselRef}
            className={`
             
              ${
                isMobile
                  ? "flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-6 gap-6"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }
              gap-y-16 gap-x-8 sm:gap-x-12 lg:gap-x-16 mx-auto px-4 sm:px-6
            `}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={(e) => handleMouseDown(e.touches[0])}
            onTouchEnd={handleMouseUp}
            onTouchMove={(e) => handleMouseMove(e.touches[0])}
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                className={`
                  group rounded-2xl overflow-hidden text-center 
                  cursor-pointer relative bg-transparent
                  transition-all duration-300
                  
                  ${
                    isMobile
                      ? "flex-shrink-0 w-[85vw] max-w-[340px] snap-center"
                      : ""
                  }
                  ${service.className || ""}
                `}
                initial={{ opacity: 0.6, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.1,
                  delay: isMobile ? 0 : index * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -5 }}
              >
                {/* Image plus grande et respirante */}
                <div className="relative w-full h-[30rem] aspect-[4/3] mx-auto rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-all duration-700 group-hover:scale-105"
                    priority
                  />

                  {/* Overlay subtil au survol */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <motion.button
                    className="
                      absolute bottom-4 left-1/2 transform -translate-x-1/2 
                      bg-white hover:bg-black text-black hover:text-white 
                      py-2.5 px-6 rounded-full 
                      opacity-0 group-hover:opacity-100 shadow-xl
                      text-xs sm:text-sm font-medium transition-all duration-300 ease-in-out 
                      w-auto min-w-[120px] flex items-center justify-center gap-1.5
                    "
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Découvrir</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    >
                      <path
                        d="M5 12H19M19 12L12 5M19 12L12 19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.button>
                </div>

                {/* Texte plus aéré et épuré */}
                <div className="px-2 py-5 text-center">
                  <h3 className="text-lg sm:text-xl font-semibold text-black mb-2">
                    {service.title}
                  </h3>
                  {/* {service.description && (
                    <motion.p
                      className="mt-2 text-gray-700 text-sm sm:text-base max-w-[95%] mx-auto line-clamp-2 group-hover:line-clamp-none"
                      initial={{ opacity: 0.7 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {service.description}
                    </motion.p>
                  )} */}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Ombres de défilement pour mobile */}
          {isMobile && (
            <>
              <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            </>
          )}
        </motion.section>
      </div>
      {/* Section 2 : Bannière arrondie + image main */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        className="relative py-8 sm:py-12 px-3 sm:px-4 overflow-hidden mb-6 sm:mb-9"
      >
        <div
          className="
          bg-gray-100 
          rounded-[16px] sm:rounded-[24px] md:rounded-[80px] 
          w-[90%] md:w-[90%] lg:w-[90%] 
          mx-auto 
          h-auto md:h-[380px] 
          flex flex-col md:flex-row 
          items-center 
          gap-4 sm:gap-8 
          p-4 sm:p-6 md:p-8 
          relative 
          mt-[60px] sm:mt-[85px]
        "
        >
          {/* Zone de l'image */}
          <div className="w-full md:w-1/2 h-full relative">
            <Image
              src="/main.png"
              alt="Main"
              width={400}
              height={500}
              className="
              absolute 
              -bottom-6 sm:-bottom-8 
              left-1/2 
              -translate-x-1/2 
              z-10 
              h-auto
              max-w-[120px] 
              sm:max-w-[150px]     
              md:max-w-[300px]    
              lg:max-w-full       
            "
            />
          </div>

          {/* Zone du texte et des boutons de téléchargement */}
          <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left space-y-2 sm:space-y-3 md:space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <Image
                src="/qrcode/qrcode.png"
                alt="Code QR"
                width={180}
                height={180}
                className="object-contain"
              />
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
                Votre agence
                <br />à portée de main
              </h2>
            </div>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700">
              Franchissez le pas, <strong>téléchargez</strong> maintenant
              l&apos;application mobile
            </p>

            <div className="mt-2 sm:mt-3 md:mt-4 flex flex-wrap justify-center md:justify-start items-center gap-2 sm:gap-4">
              <Image
                src="/storepng/appstore.png"
                alt="App Store"
                width={120}
                height={40}
                className="cursor-pointer w-[120px] sm:w-[150px]"
              />
              <Image
                src="/storepng/googleplay.png"
                alt="Google Play"
                width={120}
                height={40}
                className="cursor-pointer w-[120px] sm:w-[150px]"
              />
              <Image
                src="/storepng/appgallery.png"
                alt="AppGallery"
                width={120}
                height={40}
                className="cursor-pointer w-[120px] sm:w-[150px]"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 3 : Besoin d'assistance ? */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        viewport={{ once: true }}
        className="
        relative  
        min-h-[500px] 
        sm:min-h-[600px] 
        md:min-h-[700px] 
        lg:min-h-[800px] 
        flex 
        items-center 
        overflow-hidden 
        py-8 sm:py-12 
        px-3 sm:px-4
      "
      >
        {/* SVG de fond, hauteur réduite */}
        <div className="absolute inset-0 -z-10">
          <svg
            viewBox="0 0 1440 500"
            preserveAspectRatio="none"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="gradientOrange" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F9B234" />
                <stop offset="100%" stopColor="#F47D02" />
              </linearGradient>
            </defs>
            <path
              fill="url(#gradientOrange)"
              d="
              M0,0 
              H520
              C520,0 550,0 580,0 
              C600,0 620,40 640,40
              H800
              C820,40 840,0 860,0
              C890,0 920,0 920,0
              H1440
              V500 
              H0 
              Z
            "
            />
          </svg>
        </div>

        {/* Contenu au premier plan - Version modernisée avec actions contextuelles */}
        <div className="relative w-full max-w-6xl mx-auto text-center px-2 sm:px-0">
          {/* Titre avec animation de soulignement */}
          <div className="relative inline-block mb-2">
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-6 sm:mt-8 md:mt-12 lg:mt-16 mb-4 sm:mb-6"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Besoin d&apos;assistance ?
            </motion.h2>
            {/* <motion.div
              className="absolute -bottom-1 left-0 right-0 h-1.5 bg-white opacity-60 rounded-full"
              initial={{ width: 0, x: "50%" }}
              whileInView={{ width: "100%", x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
            /> */}
          </div>

          {/* Sous-titre amélioré */}
          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-white mb-6 sm:mb-8 md:mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Des services disponibles{" "}
            <motion.span
              className="inline-block font-semibold text-black bg-white bg-opacity-30 backdrop-blur-sm px-2 py-0.5 rounded-lg mx-1"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              24h/24
            </motion.span>
            et{" "}
            <motion.span
              className="inline-block font-semibold text-black bg-white bg-opacity-30 backdrop-blur-sm px-2 py-0.5 rounded-lg mx-1"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              7j/7
            </motion.span>
          </motion.p>

          {/* Grille responsive pour les 3 cartes - Actions contextuelles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full max-w-4xl mx-auto px-2 sm:px-4">
            {/* Carte 1 - Service téléphonique - Action contextuelle d'appel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="
        group
        bg-white 
        rounded-xl sm:rounded-2xl  
        shadow-md 
        hover:shadow-xl 
        transition-all 
        duration-300 
        flex 
        flex-col 
        items-center 
        justify-between 
        relative 
        transform-gpu 
        min-h-[200px] sm:min-h-[240px]
        p-5 sm:p-6
        overflow-hidden
      "
            >
              {/* Barre d'accent supérieure */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

              {/* Indicateur visuel en arrière-plan */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-amber-100 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300" />

              {/* En-tête de la carte */}
              <div className="w-full text-center">
                <motion.img
                  src="assistance/centre.png"
                  alt="179"
                  className="w-14 h-14 sm:w-18 sm:h-18 object-contain mb-4 mx-auto"
                  whileHover={{
                    scale: 1.2,
                    rotateZ: [0, -10, 10, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    times: [0, 0.3, 0.6, 1],
                  }}
                />

                <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-1">
                  Service Clientèle
                </h3>

                <p className="text-gray-700 text-sm">
                  Support direct avec nos conseillers
                </p>
              </div>

              {/* Statut du service */}
              <div className="flex items-center gap-2 my-2">
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                  Conseiller à votre écoute
                </span>
              </div>

              {/* Action contextuelle */}
              <a
                href="tel:179"
                className="
          mt-2
          py-3 
          px-5
          w-full
          flex 
          items-center 
          justify-center 
          gap-2 
          bg-amber-500 
          hover:bg-amber-600
          text-white 
          font-medium 
          rounded-lg
          transition-all 
          duration-200
          transform
          translate-y-0
          hover:-translate-y-1
          focus:outline-none
          focus:ring-2
          focus:ring-amber-500
          focus:ring-opacity-50
        "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>Appeler le 179</span>
              </a>

              <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500 transform origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </motion.div>

            {/* Carte 2 - Réseaux sociaux - Actions contextuelles de messagerie */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="
        group
        bg-white 
        rounded-xl sm:rounded-2xl 
        shadow-md 
        hover:shadow-xl 
        transition-all 
        duration-300 
        flex 
        flex-col 
        items-center
        justify-between
        relative 
        transform-gpu 
        min-h-[200px] sm:min-h-[240px]
        p-5 sm:p-6
        overflow-hidden
        border border-white border-opacity-70
      "
            >
              {/* Barre d'accent supérieure */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-green-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

              {/* En-tête de la carte */}
              <div className="w-full text-center">
                <div className="flex items-center justify-center gap-3 sm:gap-5 mb-4">
                  <motion.div
                    className="relative"
                    whileHover={{
                      scale: 1.2,
                      rotateZ: [0, -8, 8, 0],
                    }}
                    transition={{
                      duration: 0.4,
                      times: [0, 0.3, 0.6, 1],
                    }}
                  >
                    <div className="absolute inset-0 bg-green-300 opacity-0 group-hover:opacity-30 blur-md rounded-full scale-150 transition-opacity duration-500" />
                    <motion.img
                      src="assistance/wha.png"
                      alt="WhatsApp"
                      className="w-10 h-10 sm:w-12 sm:h-12 relative z-10"
                    />
                  </motion.div>
                </div>

                <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-1">
                  Réseaux Sociaux
                </h3>

                <p className="text-gray-700 text-sm">
                  Support via messagerie instantanée
                </p>
              </div>

              <div className="flex items-center gap-2 my-2">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                  Communication directe
                </span>
              </div>

              {/* Actions contextuelles */}
              <div className="flex flex-col sm:flex-row gap-2 w-full mt-2">
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
          mt-2
          py-3 
          px-5
          w-full
          flex 
          items-center 
          justify-center 
          gap-2 
          bg-green-500 
          hover:bg-green-600
          text-white 
          font-medium 
          rounded-lg
          transition-all 
          duration-200
          transform
          translate-y-0
          hover:-translate-y-1
          focus:outline-none
          focus:ring-2
          focus:ring-green-500
          focus:ring-opacity-50
        "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>

              <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 transform origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </motion.div>

            {/* Carte 3 - Chatbot - Action contextuelle de chat */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="
        group
        bg-white 
        rounded-xl sm:rounded-2xl 
        shadow-md 
        hover:shadow-xl 
        transition-all 
        duration-300 
        flex 
        flex-col 
        items-center 
        justify-between
        relative 
        transform-gpu 
        min-h-[200px] sm:min-h-[240px]
        p-5 sm:p-6
        overflow-hidden
      "
            >
              {/* Barre d'accent supérieure */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-green-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

              {/* Indicateur visuel en arrière-plan */}
              <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-green-100 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300" />

              {/* En-tête de la carte */}
              <div className="w-full text-center">
                <motion.div className="relative mb-4">
                  <motion.div className="absolute inset-0 bg-green-300 opacity-0 group-hover:opacity-30 blur-md rounded-full scale-150 transition-opacity duration-500" />
                  <motion.img
                    src="assistance/bot.png"
                    alt="ClemBot"
                    className="w-14 h-14 sm:w-18 sm:h-18 object-contain relative z-10 mx-auto"
                    whileHover={{
                      scale: 1.2,
                      rotate: [0, -5, 5, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      times: [0, 0.3, 0.6, 1],
                    }}
                  />
                </motion.div>

                <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-1">
                  Assistant Virtuel
                </h3>

                <p className="text-gray-700 text-sm">
                  Intelligence artificielle à votre service
                </p>
              </div>

              <div className="flex items-center gap-2 my-2">
                <span className="bg-[#dd67433b] text-[#dd6743] text-xs px-2 py-0.5 rounded-full">
                  Intelligence artificielle
                </span>
              </div>

              {/* Action contextuelle */}
              <button
                onClick={handleOpenChatbot}
                className="
                      mt-2
                      py-3
                      px-5
                      w-full
                      flex 
                      items-center 
                      justify-center 
                      gap-2 
                      bg-[#dd6743]
                      hover:bg-[#dd6743] 
                      text-white 
                      font-medium 
                      rounded-lg
                      transition-all 
                      duration-200
                      transform
                      translate-y-0
                      hover:-translate-y-1
                      focus:outline-none
                      focus:ring-2
                      focus:ring-green-500
                    "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span>Démarrer le chat</span>
              </button>

              <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 transform origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 4 : Chat-Bot + téléphone avec switch */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 20 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative py-8 sm:py-12 lg:py-24 px-3 sm:px-4 overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
          }}
          className={`
      w-[95%] sm:w-[92%] lg:w-[90%]
      mx-auto 
      border-2 
      border-gray-400/30 
      bg-[#1C1C1C]
      rounded-[30px] sm:rounded-[40px] 
      p-4 sm:p-5 md:p-8 
      backdrop-blur-sm 
      transition-all 
      duration-500 
      relative 
      cursor-pointer 
      transform-gpu 
      h-auto md:h-[600px] lg:h-[700px] 
      mb-12 sm:mb-16 md:mb-20 
      hover:border-opacity-50
    `}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-y-6 sm:gap-y-8 gap-x-4 sm:gap-x-6 lg:gap-x-20 mx-auto max-w-5xl w-full h-full">
            {/* Colonne gauche : ClemBot + Textes + Bouton */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-3 sm:space-y-4 md:space-y-6 px-2 sm:px-4">
              <div className="flex flex-col space-y-3 sm:space-y-4 group w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
                  {/* Image du bot - taille réduite pour tablette */}
                  <Image
                    src="/assistance/bot.png"
                    width={90}
                    height={90}
                    alt="ClemBot"
                    className="w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] md:w-[110px] md:h-[110px] object-contain transition-transform duration-500 hover:scale-105"
                  />

                  {/* Conteneur de texte - police réduite pour tablette */}
                  <div className="flex flex-col items-center sm:items-start">
                    <h3
                      className="
                  text-xl sm:text-xl md:text-3xl font-bold 
                  flex items-center flex-wrap justify-center sm:justify-start
                  transition-colors duration-300 
                  text-[#F47D02]
                "
                    >
                      Le tout
                      <span
                        className="
                    ml-1 sm:ml-1 px-2 sm:px-2 py-0.5 
                    rounded-lg 
                    text-white
                    transition-all duration-300 
                    hover:shadow-lg 
                    bg-[#EC4F48]
                  "
                      >
                        nouveau
                      </span>
                    </h3>
                    <h2
                      className="
                  mt-1 sm:mt-1 md:mt-2 
                  text-2xl sm:text-3xl md:text-5xl font-bold 
                  transition-colors duration-300 
                  text-[#F47D02]
                "
                    >
                      Chat-Bot
                    </h2>
                  </div>
                </div>
              </div>

              {/* Paragraphes - taille de texte réduite et espacement optimisé */}
              <div className="max-w-md sm:max-w-sm md:max-w-xl mx-auto md:mx-0">
                <p className="text-sm sm:text-sm md:text-base text-white">
                  Découvrez <strong>Clem&apos;Bot</strong>, votre assistant
                  intelligent
                  <strong> disponible 24/7</strong> !
                </p>
                <p className="text-sm sm:text-sm md:text-base text-white mt-2">
                  <strong>Besoin d&apos;aide ?</strong> Clem&apos;Bot répond à
                  vos questions et vous guide dans toutes vos démarches.
                </p>
              </div>

              {/* Bouton - taille réduite sur tablette */}
              <div className="w-full flex justify-center sm:justify-center md:justify-start pt-1 sm:pt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="
              px-5 sm:px-6 py-2.5 sm:py-3 md:py-3.5
              rounded-xl font-medium text-sm 
              flex items-center gap-2
              hover:shadow-lg 
              transform hover:-translate-y-0.5 
              transition-all duration-300
              bg-white text-black
            "
                >
                  Essayer Clem&apos;bot
                  <svg
                    width="20"
                    height="18"
                    viewBox="0 0 22 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  >
                    <path
                      d="M8.39583 6.37484H8.40625M13.6042 6.37484H13.6146M17.25 1.1665C18.0788 1.1665 18.8737 1.49574 19.4597 2.0818C20.0458 2.66785 20.375 3.4627 20.375 4.2915V12.6248C20.375 13.4536 20.0458 14.2485 19.4597 14.8345C18.8737 15.4206 18.0788 15.7498 17.25 15.7498H12.0417L6.83333 18.8748V15.7498H4.75C3.9212 15.7498 3.12634 15.4206 2.54029 14.8345C1.95424 14.2485 1.625 13.4536 1.625 12.6248V4.2915C1.625 3.4627 1.95424 2.66785 2.54029 2.0818C3.12634 1.49574 3.9212 1.1665 4.75 1.1665H17.25Z"
                      stroke="black"
                      strokeWidth="2.08333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.39844 10.5415C8.73789 10.888 9.14307 11.1632 9.59024 11.3511C10.0374 11.539 10.5176 11.6358 11.0026 11.6358C11.4876 11.6358 11.9678 11.539 12.415 11.3511C12.8621 11.1632 13.2673 10.888 13.6068 10.5415"
                      stroke="black"
                      strokeWidth="2.08333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Colonne droite : Téléphone - taille réduite pour tablette */}
            <div className="flex-1 w-full flex justify-center mt-2 sm:mt-3 md:mt-0">
              <div className="relative flex flex-col items-center">
                {/* Conteneur du téléphone avec dimensions réduites */}
                <div className="relative w-[230px] sm:w-[280px] md:w-[380px] lg:w-[430px] h-[320px] sm:h-[400px] md:h-[500px] mt-0">
                  {/* Image du téléphone avec position ajustée */}
                  <Image
                    src="/telephone/phoneNoir.png"
                    alt="Phone Interface"
                    fill
                    className="object-contain sm:mt-[30px] md:mt-[60px] lg:mt-[80px]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Section 5 : Simulateur de facture */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        className="
        relative 
        w-[90%] md:w-[90%] 
        rounded-[40px] 
        py-16 sm:py-24 md:py-32 
        px-4 sm:px-6 md:px-8 
        bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF] 
        overflow-hidden 
        mx-auto 
        mb-20 sm:mb-32 md:mb-40
      "
      >
        {/* Cercle décoratif en haut à droite */}
        <div
          className="
          absolute 
          top-0 
          right-0 
          w-[300px] h-[300px] 
          sm:w-[400px] sm:h-[400px] 
          md:w-[600px] md:h-[600px] 
          bg-gradient-to-br from-[#47B5B0]/10 to-transparent 
          rounded-full 
          blur-3xl 
          transform translate-x-1/2 -translate-y-1/2
        "
        />

        {/* Cercle décoratif en bas à gauche */}
        <div
          className="
          absolute 
          bottom-0 
          left-0 
          w-[200px] h-[200px] 
          sm:w-[300px] sm:h-[300px] 
          md:w-[400px] md:h-[400px] 
          bg-gradient-to-tr from-[#47B5B0]/5 to-transparent 
          rounded-full 
          blur-2xl 
          transform -translate-x-1/2 translate-y-1/2
        "
        />

        {/* Conteneur principal flex */}
        <div
          className="
          max-w-7xl 
          mx-auto 
          flex 
          flex-col md:flex-row 
          items-center 
          justify-between 
          gap-8 sm:gap-10 md:gap-16 
          relative
        "
        >
          {/* Colonne de gauche */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2 space-y-8"
          >
            <div className="space-y-6 max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-8"
              >
                <h2
                  className="
                  text-3xl 
                  sm:text-4xl 
                  md:text-5xl 
                  lg:text-6xl 
                  font-bold 
                  text-[#191818] 
                  text-center
                  sm:text-start
                  leading-tight 
                  tracking-tight
                "
                >
                  Maîtriser ma <br />
                  <span className="text-[#47B5B0]">consommation</span>
                </h2>
                {/* Texte mis à jour pour être plus cohérent avec l'objectif de la section */}
                <p
                  className="
                  text-sm 
                  sm:text-base 
                  md:text-lg 
                  lg:text-xl 
                  text-center
                  sm:text-start
                  text-gray-600 
                  leading-relaxed
                "
                >
                  Suivez et optimisez votre consommation énergétique en temps
                  réel, simulez vos factures et votre puissance idéale, et
                  adoptez les meilleures pratiques pour économiser l'énergie au
                  quotidien.
                </p>
                <div className="flex items-center gap-4 justify-center sm:justify-normal">
                  {/* Texte du bouton changé de "Essayez notre simulateur" à "Rendez-vous sur l'ecostore" */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="
                    bg-[#191818] 
                    text-white 
                    px-6 sm:px-8 
                    py-3 sm:py-4 
                    rounded-xl 
                    hover:bg-opacity-90 
                    transition-all 
                    duration-300 
                    flex items-center 
                    justify-center 
                    gap-3 
                    group 
                    hover:transform 
                    hover:translate-y-[-2px] 
                    shadow-lg shadow-black/5
                  "
                    onClick={() => router.push("/solutions-eco")}
                  >
                    <span className="text-base sm:text-lg">
                      Rendez-vous sur l&apos;ecostore
                    </span>
                    <Ecostore className="text-white" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Images filigranes en arrière-plan (absolues) */}
          <motion.img
            src="/person/person1.png"
            alt="Person 1"
            className={`
            absolute
            right-0 top-0
            w-[300px] sm:w-[400px] md:w-[600px]
            h-auto object-contain
            transition-all duration-500
            ${
              activeSlide === 0
                ? "opacity-10 scale-100 rotate-0"
                : "opacity-0 scale-95 rotate-6"
            }
          `}
          />
          <motion.img
            src="/person/person2.png"
            alt="Person 2"
            className={`
            absolute
            right-0 top-0
            w-[300px] sm:w-[400px] md:w-[600px]
            h-auto object-contain
            transition-all duration-500
            ${
              activeSlide === 1
                ? "opacity-10 scale-100 rotate-0"
                : "opacity-0 scale-95 rotate-6"
            }
          `}
          />
          <motion.img
            src="/person/person1.png"
            alt="Person 3"
            className={`
            absolute
            right-0 top-0
            w-[300px] sm:w-[400px] md:w-[600px]
            h-auto object-contain
            transition-all duration-500
            ${
              activeSlide === 2
                ? "opacity-10 scale-100 rotate-0"
                : "opacity-0 scale-95 rotate-6"
            }
          `}
          />
          <motion.img
            src="/person/person2.png"
            alt="Person 4"
            className={`
            absolute
            right-0 top-0
            w-[300px] sm:w-[400px] md:w-[600px]
            h-auto object-contain
            transition-all duration-500
            ${
              activeSlide === 3
                ? "opacity-10 scale-100 rotate-0"
                : "opacity-0 scale-95 rotate-6"
            }
          `}
          />

          {/* Colonne de droite + contenu dynamique */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex items-center justify-center min-h-[400px]"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`prev-${activeSlide}`}
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 0.3, x: -250 }}
                exit={{ opacity: 0, x: -280 }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut",
                  type: "tween",
                }}
                style={{ willChange: "transform" }}
                className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:block"
              >
                <div className="bg-gradient-to-r from-[#1D1E20] to-[#2D2E30] backdrop-blur-lg p-6 rounded-2xl shadow-xl w-[280px] h-[10rem] border border-[#47B5B0]/10">
                  <h3 className="text-lg font-semibold mb-3 text-white/90">
                    {activeSlide === 0
                      ? "Adopter les bons gestes"
                      : activeSlide === 1
                      ? "Maîtriser ma consommation"
                      : activeSlide === 2
                      ? "Effectuer des simulations"
                      : "Réaliser des économies"}
                  </h3>
                  <p className="text-sm text-white/60">
                    {activeSlide === 0
                      ? "Changez vos réflexes, économisez votre énergie"
                      : activeSlide === 1
                      ? "Suivez votre consommation en temps réel"
                      : activeSlide === 2
                      ? "Simulez votre facture et votre puissance idéale"
                      : "Réduisez votre consommation efficacement"}
                  </p>
                </div>
              </motion.div>

              {activeSlide === 0 && (
                <motion.div
                  key="slide0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    type: "tween",
                  }}
                  style={{ willChange: "transform" }}
                  className="
                  bg-gradient-to-br 
                  from-white/90 to-white/70 
                  backdrop-blur-lg 
                  p-6 sm:p-8 
                  rounded-3xl 
                  shadow-2xl 
                  w-[90%] sm:w-[350px] md:w-[400px]
                  border border-white/20 
                  z-20 mx-auto
                "
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-[#47B5B0]/10 rounded-xl">
                      <CarouselIcon className="w-8 h-8 text-[#47B5B0]" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#191818]">
                      Suivre ma conso
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-8">
                    Consulter, analyser et comparer ma consommation.
                  </p>
                  <div className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="
                      flex items-center gap-3 
                      p-4 
                      hover:bg-[#47B5B0]/5 
                      rounded-xl 
                      transition-all 
                      duration-300 
                      cursor-pointer 
                      group
                    "
                    >
                      <span className="text-[#47B5B0] font-medium">
                        Depuis votre compte web
                      </span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="
                      flex items-center gap-3 
                      p-4 
                      hover:bg-[#47B5B0]/5 
                      rounded-xl 
                      transition-all 
                      duration-300 
                      cursor-pointer 
                      group
                    "
                    >
                      <span className="text-gray-600 group-hover:text-[#47B5B0] transition-colors duration=300">
                        Depuis l&apos;appli ma CIE en ligne
                      </span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="
                      flex items-center gap-3 
                      p-4 
                      hover:bg-[#47B5B0]/5 
                      rounded-xl 
                      transition-all 
                      duration-300 
                      cursor-pointer 
                      group
                    "
                    >
                      <span className="text-gray-600 group-hover:text-[#47B5B0] transition-colors duration=300">
                        Par E-mail
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {activeSlide === 1 && (
                // Carte redessinée: "Simuler ma facture" -> "Effectuer des simulations"
                <motion.div
                  key="slide1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    type: "tween",
                  }}
                  style={{ willChange: "transform" }}
                  className="
                  bg-gradient-to-br 
                  from-white/90 to-white/70 
                  backdrop-blur-lg 
                  p-6 sm:p-8 
                  rounded-3xl 
                  shadow-2xl 
                  w-[90%] sm:w-[350px] md:w-[400px]
                  border border-white/20 
                  z-20 mx-auto
                "
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-[#47B5B0]/10 rounded-xl">
                      <SimulationIcon className="w-8 h-8 text-[#47B5B0]" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#191818]">
                      Effectuer des simulations
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Estimez votre facture et déterminez votre puissance idéale
                    pour une gestion optimale.
                  </p>
                  <div className="space-y-4 mb-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="
                      w-full 
                      bg-[#47B5B0]/10
                      hover:bg-[#47B5B0]/20
                      text-[#47B5B0]
                      font-medium
                      px-6 py-4 
                      rounded-xl 
                      transition-all 
                      duration-300 
                      flex items-center 
                      justify-between
                    "
                      onClick={() => {
                        router.push("/simulateur-facture");
                      }}
                    >
                      <span>Simuler ma facture</span>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="transition-transform duration-300"
                      >
                        <path
                          d="M9 18L15 12L9 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="
                      w-full 
                      bg-[#47B5B0]/10
                      hover:bg-[#47B5B0]/20
                      text-[#47B5B0]
                      font-medium
                      px-6 py-4 
                      rounded-xl 
                      transition-all 
                      duration-300 
                      flex items-center 
                      justify-between
                    "
                      onClick={() => {
                        router.push("/simulateur-puissance");
                      }}
                    >
                      <span>Simuler ma puissance</span>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="transition-transform duration-300"
                      >
                        <path
                          d="M9 18L15 12L9 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {activeSlide === 2 && (
                <motion.div
                  key="slide2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    type: "tween",
                  }}
                  style={{ willChange: "transform" }}
                  className="
                  bg-gradient-to-br
                  from-white/90 to-white/70 
                  backdrop-blur-lg 
                  p-8 
                  rounded-3xl 
                  shadow-2xl 
                  w-[300px] sm:w-[400px]
                  border border-white/20 
                  z-20 mx-auto
                "
                >
                  {/* Contenu de la slide 2 */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-[#47B5B0]/10 rounded-xl">
                      <CarouselIcon className="w-8 h-8 text-[#47B5B0]" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#191818]">
                      RÉALISER LES ÉCONOMIES D&apos;ÉNERGIE
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-8">
                    Réduisez votre consommation en toute simplicité.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="
                    w-full 
                    bg-[#47B5B0] 
                    text-white 
                    px-6 py-4 
                    rounded-xl 
                    hover:bg-opacity-90 
                    transition-all 
                    duration-300 
                    flex items-center 
                    justify-center 
                    gap-3 
                    group
                  "
                    onClick={() => {
                      router.push("/decouvrir");
                    }}
                  >
                    <span>Découvrir</span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    >
                      <path
                        d="M4 12H20M20 12L14 6M20 12L14 18"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.button>
                </motion.div>
              )}
              {activeSlide === 3 && (
                <motion.div
                  key="slide3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    type: "tween",
                  }}
                  style={{ willChange: "transform" }}
                  className="
                  bg-gradient-to-br 
                  from-white/90 to-white/70 
                  backdrop-blur-lg 
                  p-8 
                  rounded-3xl 
                  shadow-2xl 
                  w-[300px] sm:w-[400px]
                  border border-white/20 
                  z-20 mx-auto
                "
                >
                  {/* Contenu de la slide 3 */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-[#47B5B0]/10 rounded-xl">
                      <CarouselIcon className="w-8 h-8 text-[#47B5B0]" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#191818]">
                      ADOPTER LES BONS GESTES
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-8">
                    Changez vos réflexes, économisez votre énergie.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="
                    w-full 
                    bg-[#47B5B0] 
                    text-white 
                    px-6 py-4 
                    rounded-xl 
                    hover:bg-opacity-90 
                    transition-all 
                    duration-300 
                    flex items-center 
                    justify-center 
                    gap-3 
                    group
                  "
                    onClick={() => {
                      router.push("/decouvrir-economie");
                    }}
                  >
                    <span>Découvrir</span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    >
                      <path
                        d="M4 12H20M20 12L14 6M20 12L14 18"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              key={`next-${activeSlide}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 0.3, x: 250 }}
              exit={{ opacity: 0, x: 280 }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
                type: "tween",
              }}
              style={{ willChange: "transform" }}
              className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block"
            >
              {/* Redesign de la carte de droite */}
              <div className="bg-gradient-to-r from-[#1D1E20] to-[#2D2E30] backdrop-blur-lg p-6 rounded-2xl shadow-xl w-[280px] h-[10rem] border border-[#47B5B0]/10">
                <h3 className="text-lg font-semibold mb-3 text-white/90">
                  {activeSlide === 0
                    ? "Effectuer des simulations"
                    : activeSlide === 1
                    ? "Réaliser des économies"
                    : activeSlide === 2
                    ? "Adopter les bons gestes"
                    : "Maîtriser ma consommation"}
                </h3>
                <p className="text-sm text-white/60">
                  {activeSlide === 0
                    ? "Simulez votre facture et votre puissance idéale"
                    : activeSlide === 1
                    ? "Réduisez votre consommation efficacement"
                    : activeSlide === 2
                    ? "Changez vos réflexes, économisez"
                    : "Suivez votre consommation en temps réel"}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Navigation du carrousel (pastilles) avec contrôles redessinés */}
        <div
          className="
          absolute 
          bottom-6 sm:bottom-8 md:bottom-12 
          left-1/2 
          transform -translate-x-1/2 
          flex 
          justify-center 
          items-center 
          gap-2 sm:gap-3 md:gap-4
          backdrop-blur-sm
          px-3 sm:px-5 md:px-7
          py-2 sm:py-3 md:py-4
          rounded-full
          transition-all duration-300
        "
        >
          {/* Bouton précédent */}
          <motion.button
            onClick={prevSlide}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-8 h-8 flex items-center justify-center text-[#47B5B0] hover:text-[#309590] transition-colors duration-200 rounded-full shadow-sm"
            aria-label="Slide précédente"
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>

          {/* Points de navigation redessinés */}
          {[0, 1, 2, 3].map((index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => setActiveSlide(index)}
              className={`
              h-3 sm:h-3.5
              rounded-full 
              transition-all 
              duration-300 
              ${
                activeSlide === index
                  ? "w-8 sm:w-10 bg-[#47B5B0] shadow-md"
                  : "w-3 sm:w-3.5 bg-gray-400/60 hover:bg-gray-400/80"
              }
            `}
              aria-label={`Aller à la slide ${index + 1}`}
            />
          ))}

          {/* Bouton suivant */}
          <motion.button
            onClick={nextSlide}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-8 h-8 flex items-center justify-center text-[#47B5B0] hover:text-[#309590] transition-colors duration-200 rounded-full shadow-sm"
            aria-label="Slide suivante"
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </div>
      </motion.section>

      {/* Section 9 */}
      {/* <div className="relative w-full max-w-[90%] mx-auto mb-[60px] sm:mb-[80px] md:mb-[100px]">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="
      w-full 
      p-4 sm:p-6 md:p-[50px] pb-[80px]
      bg-black 
      border-none
      rounded-t-[40px]
      rounded-br-[40px]
      rounded-bl-[40px]
      flex flex-col 
      gap-6 sm:gap-8 md:gap-[70px] 
      min-h-[600px] sm:min-h-[700px] md:min-h-[813px]
      relative
      overflow-hidden
    "
        >
          <div className="absolute bottom-0 left-0 right-0 w-full h-[120px] z-50">
            <svg
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="black"
                d="
            M0,120
            H520
            C580,120 600,60 640,60
            H800
            C840,60 860,120 920,120
            H1440
            V0
            H0
            Z
            "
              />
            </svg>
          </div>
          <div className="absolute -bottom-2 left-0 right-0 w-full h-[120px] z-40 bg-white"></div>
          <div className="text-center text-white z-[999]">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-1 sm:mb-2 md:mb-4">
              Notre réseau électrique
            </h2>
            <p className="text-base sm:text-lg md:text-xl">
              Quelques chiffres clés pour apprécier la qualité du réseau
            </p>
          </div>

          <div
            className="
            flex 
            flex-col 
            lg:flex-row 
            items-center 
            justify-between 
            -mt-[60px] sm:-mt-[80px] md:-mt-[180px]
            px-4 sm:px-8 md:px-16
            gap-8 lg:gap-0 
            z-10
          "
          >
            <div className="relative w-full max-w-[719px] h-[240px] sm:h-[320px] md:h-[500px] lg:h-[759px] z-0">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="
                w-full 
                h-full 
                rounded-[20px] 
                md:rounded-[40px] 
                object-cover
              "
              >
                <source src="/carte.mp4" type="video/mp4" />
              </video>
            </div>

            <div
              className="
              flex 
              flex-col md:flex-row 
              items-center 
              gap-6 sm:gap-8 md:gap-20
            "
            >
              <div className="text-center">
                <h3 className="text-4xl sm:text-5xl md:text-7xl text-white font-bold mb-2 md:mb-4">
                  268
                </h3>
                <p className="text-base sm:text-lg md:text-xl text-white">
                  Localités éclairées
                </p>
              </div>

              <div className="hidden md:block text-5xl text-white font-light">
                |
              </div>

              <div className="text-center">
                <h3 className="text-4xl sm:text-5xl md:text-7xl text-[#47B5B0] font-medium mb-2 md:mb-4">
                  80<span className="font-thin">%</span>
                </h3>
                <p className="text-base sm:text-lg md:text-xl text-white">
                  taux d&apos;électrification
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div> */}
    </div>
  );
}
