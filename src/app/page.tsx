"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CarouselIcon } from "./components/icons/CarouselIcon";

const VideoCarousel = dynamic(() => import("./components/VideoCarousel"), {
  ssr: false,
});

interface ServiceItem {
  title: string;
  description: string;
  image: string;
  className?: string;
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
    image: "/compteur/compteur2.png",
  },
  {
    title: "PEPT",
    description: "Programme d'Électrification Pour Tous, accès facilité.",
    image: "/compteur/compteur3.png",
  },
];

export default function Home() {
  // État local pour gérer le mode (sombre/claire)
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSection, setActiveSection] = useState("froid");

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
    // Vérifier si l'utilisateur préfère le mode sombre
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (prefersDarkMode) {
      toggleDarkMode();
    }
  }, []);

  return (
    <div className="overflow-x-hidden w-full">
      <div className="py-4 sm:py-8">
        <VideoCarousel />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12 sm:space-y-16 mb-4 sm:mb-6">
        {/* Section 1 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="text-center px-2 sm:px-0"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-4 sm:mb-6">
            Nos Offres d&apos;abonnement
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
            Sélectionnez le profil qui reflète vos habitudes de consommation
            pour une facture précise et un suivi optimisé de votre énergie.
          </p>
        </motion.section>

        {/* Section 2 */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mb-6 sm:mb-8"
        >
          {/* Grid responsive : 1 colonne sur mobile, 3 à partir de md */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-8 sm:gap-x-10 md:gap-x-12 mx-auto px-4 sm:px-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className={`
                group rounded-xl overflow-hidden text-center 
                cursor-pointer relative bg-transparent
                ${service.className || ""}
              `}
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Conteneur qui limite la taille de l'image et la rend responsive */}
                <div className="relative w-full h-[180px] sm:h-[200px] md:h-[220px] mx-auto rounded-lg overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                    priority
                  />

                  <button
                    className="
                    absolute bottom-3 left-1/2 transform -translate-x-1/2 
                    bg-black hover:bg-vert text-white py-1.5 px-3 rounded-full 
                    opacity-0 group-hover:opacity-100 shadow-lg 
                    text-xs sm:text-sm font-medium transition-all duration-300 ease-in-out 
                    w-28 sm:w-32 flex items-center justify-center gap-1
                  "
                  >
                    <span>Découvrir</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12H19M19 12L12 5M19 12L12 19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <h3 className="text-base sm:text-lg font-semibold mt-3 text-black">
                  {service.title}
                </h3>
                {service.description && (
                  <p className="mt-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 text-black text-xs max-w-[90%] mx-auto">
                    {service.description}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
              Votre agence à portée de main
            </h2>
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

        {/* Contenu au premier plan */}
        <div className="relative w-full max-w-6xl mx-auto text-center px-2 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-6 sm:mt-8 md:mt-12 lg:mt-16 mb-4 sm:mb-6 md:mb-10">
            Besoin d&apos;assistance ?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white mb-6 sm:mb-8 md:mb-16">
            Des services disponibles{" "}
            <span className="font-semibold text-black">24h/24</span> et{" "}
            <span className="font-semibold text-black">7j/7</span>
          </p>

          {/* Grille responsive pour les 3 cartes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full max-w-4xl mx-auto px-2 sm:px-4">
            {/* Carte 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                y: "-10%",
                height: "100%",
                scale: 1.02,
                transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
              }}
              className="
              bg-white 
              rounded-xl sm:rounded-2xl  
              shadow-md 
              hover:shadow-xl 
              transition-all 
              duration-300 
              flex 
              flex-col 
              items-center 
              justify-center 
              relative 
              cursor-pointer 
              transform-gpu 
              min-h-[160px] sm:min-h-[200px]
              p-3 sm:p-4
            "
            >
              <motion.img
                src="assistance/centre.png"
                alt="179"
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              />
              <p className="text-gray-800 font-medium text-sm sm:text-base">
                Appelez-nous au <span className="font-bold">179</span>
              </p>
            </motion.div>

            {/* Carte 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                y: "-15%",
                height: "100%",
                scale: 1.02,
                transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
              }}
              className="
              bg-white 
              rounded-xl sm:rounded-2xl 
              shadow-md 
              hover:shadow-xl 
              transition-all 
              duration-300 
              flex 
              flex-col 
              items-center 
              justify-center 
              relative 
              cursor-pointer 
              transform-gpu 
              min-h-[160px] sm:min-h-[200px]
              p-3 sm:p-4
            "
            >
              <div className="flex items-center gap-2 sm:gap-4">
                <motion.img
                  src="assistance/wha.png"
                  alt="WhatsApp"
                  className="w-8 h-8 sm:w-10 sm:h-10"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.img
                  src="assistance/fb.png"
                  alt="Facebook"
                  className="w-6 h-6 sm:w-8 sm:h-8"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <p className="text-gray-800 font-medium text-sm sm:text-base">
                Écrivez-nous sur nos
                <br />
                réseaux sociaux
              </p>
            </motion.div>

            {/* Carte 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                y: "-15%",
                height: "100%",
                scale: 1.02,
                transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
              }}
              className="
              bg-white 
              rounded-2xl 
              shadow-md 
              hover:shadow-xl 
              transition-all 
              duration-300 
              flex 
              flex-col 
              items-center 
              justify-center 
              relative 
              cursor-pointer 
              transform-gpu 
              min-h-[160px] sm:min-h-[200px]
              p-3 sm:p-4
            "
            >
              <motion.img
                src="assistance/bot.png"
                alt="ClemBot"
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              />
              <p className="text-gray-800 font-medium text-sm sm:text-base">
                Discutez avec <span className="font-bold">Clem&apos;Bot</span>
              </p>
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
          w-[90%] lg:w-[90%] 
          mx-auto 
          border-2 
          border-gray-400/30 
          ${isDarkMode ? "bg-[#1C1C1C]" : "bg-white"}
          rounded-[30px] sm:rounded-[40px] 
          p-4 sm:p-6 md:p-8 

          backdrop-blur-sm 
          transition-all 
          duration-500 
          flex flex-col md:flex-row 
          items-center 
          justify-between 
          relative 
          cursor-pointer 
          transform-gpu 
          h-auto md:h-[700px] lg:h-[800px] 
          mb-12 sm:mb-16 md:mb-20 
          hover:border-opacity-50
        `}
        >
          {/* Colonne gauche : ClemBot + Textes + Bouton */}
          <div className="flex flex-col items-start text-left w-full md:w-1/2 space-y-3 sm:space-y-5 md:space-y-6 px-2 sm:px-4">
            <div className="flex flex-col space-y-2 sm:space-y-4 group">
              <img
                src="assistance/bot.png"
                alt="ClemBot"
                className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] object-contain mb-1 sm:mb-2 transition-transform duration-500 hover:scale-105"
              />
              <div className="mt-0 sm:mt-2 md:mt-3">
                <h3
                  className={`
                  text-lg sm:text-xl md:text-2xl font-bold flex items-center flex-wrap 
                  transition-colors duration-300 
                  ${isDarkMode ? "text-[#F47D02]" : "text-[#474443]"}
                `}
                >
                  Le tout
                  <span
                    className={`
                    ml-1 sm:ml-2 px-2 sm:px-3 py-0.5 sm:py-1 
                    rounded-lg 
                    text-white
                    transition-all duration-300 
                    hover:shadow-lg 
                    ${isDarkMode ? "bg-[#EC4F48]" : "bg-[#F47D02]"}
                  `}
                  >
                    nouveau
                  </span>
                </h3>
                <h2
                  className={`
                  mt-2 
                  text-2xl sm:text-3xl font-bold 
                  transition-colors duration-300 
                  ${isDarkMode ? "text-[#F47D02]" : "text-[#474443]"}
                `}
                >
                  Chat-Bot
                </h2>
              </div>
            </div>

            <p
              className={`
              text-sm sm:text-base 
              transition-colors duration-300 
              ${isDarkMode ? "text-white" : "text-black"}
            `}
            >
              Découvrez <strong>Clem&apos;Bot</strong>, votre assistant
              intelligent
              <strong> disponible 24/7</strong> !
            </p>
            <p
              className={`
              text-sm sm:text-base 
              transition-colors duration-300
              ${isDarkMode ? "text-white" : "text-black"}
            `}
            >
              <strong>Besoin d&apos;aide ?</strong> Clem&apos;Bot répond à vos
              questions et vous guide dans toutes vos démarches.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
              px-6 py-3 
              rounded-xl font-medium 
              flex items-center gap-2 
              hover:shadow-lg 
              transform hover:-translate-y-0.5 
              transition-all duration-300
              ${isDarkMode ? "bg-white text-black" : "bg-[#191818] text-white"}
            `}
            >
              Essayer Clem&apos;bot
              <svg
                width="22"
                height="20"
                viewBox="0 0 22 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.39583 6.37484H8.40625M13.6042 6.37484H13.6146M17.25 1.1665C18.0788 1.1665 18.8737 1.49574 19.4597 2.0818C20.0458 2.66785 20.375 3.4627 20.375 4.2915V12.6248C20.375 13.4536 20.0458 14.2485 19.4597 14.8345C18.8737 15.4206 18.0788 15.7498 17.25 15.7498H12.0417L6.83333 18.8748V15.7498H4.75C3.9212 15.7498 3.12634 15.4206 2.54029 14.8345C1.95424 14.2485 1.625 13.4536 1.625 12.6248V4.2915C1.625 3.4627 1.95424 2.66785 2.54029 2.0818C3.12634 1.49574 3.9212 1.1665 4.75 1.1665H17.25Z"
                  stroke={isDarkMode ? "black" : "white"}
                  strokeWidth="2.08333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.39844 10.5415C8.73789 10.888 9.14307 11.1632 9.59024 11.3511C10.0374 11.539 10.5176 11.6358 11.0026 11.6358C11.4876 11.6358 11.9678 11.539 12.415 11.3511C12.8621 11.1632 13.2673 10.888 13.6068 10.5415"
                  stroke={isDarkMode ? "black" : "white"}
                  strokeWidth="2.08333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </div>

          {/* Colonne droite : Téléphone + Switch + Barres décoratives */}
          <div className="md:w-1/2 w-full flex justify-center mt-8 md:mt-0">
            <div className="relative flex flex-col items-center">
              {/* Conteneur du téléphone */}
              <div className="relative w-[300px] sm:w-[380px] md:w-[430px] h-[400px] sm:h-[500px] mt-10 sm:mt-20">
                <div
                  className="
                  absolute 
                  left-1/2 
                  -translate-x-1/2 
                  top-[-486px] 
                  sm:top-[-400px]
                  md:top-[-186px]
                  md:-left-[650px]
                  sm:-left-[600px]
                  z-50 
                  flex flex-col 
                  items-center 
                  transition-all 
                  duration-300
                "
                >
                  {/* Barre décorative du haut */}
                  <div className="w-[150px] h-[25px] bg-[#CFCACA] rounded-b-3xl shadow-sm mb-9" />
                  <div className="flex flex-col items-center mt-3">
                    {/* Petite barre décorative */}
                    <div className="mb-8 bg-[#CFCACA] h-[10px] w-[50px] rounded-full shadow-sm" />

                    {/* Switch Dark Mode */}
                    <div
                      onClick={toggleDarkMode}
                      className={`
                      ${isDarkMode ? "bg-[#2C2C2C]" : "bg-[#D1CFCF]"}
                      rounded-[30px] 
                      h-[36px] w-[100px] 
                      sm:h-[41px] sm:w-[110px] 
                      flex 
                      items-center 
                      justify-between 
                      px-3 
                      relative 
                      cursor-pointer 
                      transition-colors 
                      duration-300 
                      hover:shadow-md
                    `}
                    >
                      <motion.div
                        className={`
                        absolute 
                        h-[28px] w-[28px] 
                        sm:h-[32px] sm:w-[32px]
                        rounded-full 
                        z-10 
                        shadow-md 
                        transition-colors 
                        duration-300
                        ${isDarkMode ? "bg-[#F47D02]" : "bg-[#191818]"}
                      `}
                        animate={{ x: isDarkMode ? 0 : 60 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                        }}
                      />
                      {/* Icônes Lune & Soleil */}
                      <div className="absolute inset-0 flex items-center justify-between px-[10px] z-20">
                        {/* Icône lune */}
                        <div className="flex items-center justify-center w-[28px] h-[28px] sm:w-[32px] sm:h-[32px]">
                          <svg
                            width="19"
                            height="20"
                            viewBox="0 0 19 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.63935 10.3242C1.93313 14.5703 5.49933 18.0249 9.76734 18.2146C12.7786 18.3465 15.4716 16.9284 17.0874 14.694C17.7566 13.7788 17.3975 13.1687 16.2795 13.3748C15.7328 13.4737 15.1697 13.515 14.5821 13.4902C10.5916 13.3253 7.32731 9.95317 7.31099 5.97088C7.30283 4.89904 7.52317 3.88492 7.92304 2.96149C8.36371 1.93912 7.83327 1.45267 6.81319 1.88965C3.58158 3.26655 1.37005 6.55627 1.63935 10.3242Z"
                              stroke={isDarkMode ? "white" : "#B1A8A8"}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        {/* Icône soleil */}
                        <div className="flex items-center justify-center w-[28px] h-[28px] sm:w-[32px] sm:h-[32px]">
                          <svg
                            width="21"
                            height="20"
                            viewBox="0 0 21 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.3059 15.3368C13.2664 15.3368 15.6664 12.9368 15.6664 9.97629C15.6664 7.01573 13.2664 4.61572 10.3059 4.61572C7.34532 4.61572 4.94531 7.01573 4.94531 9.97629C4.94531 12.9368 7.34532 15.3368 10.3059 15.3368Z"
                              stroke={isDarkMode ? "#B1A8A8" : "white"}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M16.1979 15.8644L16.0907 15.7572M16.0907 4.19486L16.1979 4.08765L16.0907 4.19486ZM4.42115 15.8644L4.52836 15.7572L4.42115 15.8644ZM10.3095 1.79498V1.729V1.79498ZM10.3095 18.223V18.1571V18.223ZM2.12848 9.97602H2.0625H2.12848ZM18.5565 9.97602H18.4906H18.5565ZM4.52836 4.19486L4.42115 4.08765L4.52836 4.19486Z"
                              stroke={isDarkMode ? "#B1A8A8" : "white"}
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image du téléphone */}
                <Image
                  src={
                    isDarkMode
                      ? "/telephone/phoneNoir.png"
                      : "/telephone/phoneBlanc.png"
                  }
                  alt="Phone Interface"
                  fill
                  className="object-contain mt-[26px] sm:mt-[108px] "
                  priority
                />
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
          gap-8 sm:gap-12 md:gap-16 
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
                <span className="inline-block px-4 py-2 bg-[#47B5B0]/10 text-[#47B5B0] rounded-full text-sm font-medium">
                  Maîtrisez votre énergie
                </span>
                <h2
                  className="
                  text-3xl 
                  sm:text-4xl 
                  md:text-5xl 
                  lg:text-6xl 
                  font-bold 
                  text-[#191818] 
                  leading-tight 
                  tracking-tight
                "
                >
                  Maîtriser ma <br />
                  <span className="text-[#47B5B0]">consommation</span>
                </h2>
                <p
                  className="
                  text-sm 
                  sm:text-base 
                  md:text-lg 
                  lg:text-xl 
                  text-gray-600 
                  leading-relaxed
                "
                >
                  Suivez votre consommation en temps réel, estimez le montant de
                  votre facture et découvrez les bons gestes pour économiser de
                  l&apos;énergie.
                </p>
                <div className="flex items-center gap-4">
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
                  >
                    <span className="text-base sm:text-lg">
                      Essayez notre simulateur
                    </span>
                    <svg
                      width="25"
                      height="26"
                      viewBox="0 0 25 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.5"
                        d="M12.5 23.4163C8.08021 23.4163 5.87083 23.4163 4.49792 21.8903C3.125 20.3663 3.125 17.9101 3.125 12.9997C3.125 8.08926 3.125 5.63405 4.49792 4.10801C5.87083 2.58197 8.08125 2.58301 12.5 2.58301C16.9187 2.58301 19.1292 2.58301 20.5021 4.10801C21.875 5.63509 21.875 8.08926 21.875 12.9997C21.875 17.9101 21.875 20.3653 20.5021 21.8903C19.1292 23.4153 16.9187 23.4163 12.5 23.4163Z"
                        fill="white"
                      />
                      <path
                        d="M15.6224 6.75H9.3724C8.88802 6.75 8.64635 6.75 8.4474 6.80313C8.18268 6.87416 7.9413 7.01358 7.74749 7.20738C7.55368 7.40119 7.41426 7.64257 7.34323 7.90729C7.28906 8.10833 7.28906 8.35 7.28906 8.83333C7.28906 9.31667 7.28906 9.55937 7.34219 9.75833C7.41322 10.0231 7.55264 10.2644 7.74645 10.4582C7.94025 10.652 8.18163 10.7915 8.44635 10.8625C8.6474 10.9167 8.88906 10.9167 9.3724 10.9167H15.6224C16.1068 10.9167 16.3484 10.9167 16.5474 10.8635C16.8121 10.7925 17.0535 10.6531 17.2473 10.4593C17.4411 10.2655 17.5805 10.0241 17.6516 9.75937C17.7057 9.55833 17.7057 9.31667 17.7057 8.83333C17.7057 8.35 17.7057 8.10729 17.6526 7.90833C17.5816 7.64361 17.4422 7.40223 17.2483 7.20843C17.0545 7.01462 16.8132 6.8752 16.5484 6.80417C16.3484 6.75 16.1057 6.75 15.6224 6.75ZM8.33073 15.0833C8.607 15.0833 8.87195 14.9736 9.0673 14.7782C9.26265 14.5829 9.3724 14.3179 9.3724 14.0417C9.3724 13.7654 9.26265 13.5004 9.0673 13.3051C8.87195 13.1097 8.607 13 8.33073 13C8.05446 13 7.78951 13.1097 7.59416 13.3051C7.39881 13.5004 7.28906 13.7654 7.28906 14.0417C7.28906 14.3179 7.39881 14.5829 7.59416 14.7782C7.78951 14.9736 8.05446 15.0833 8.33073 15.0833ZM8.33073 19.25C8.607 19.25 8.87195 19.1403 9.0673 18.9449C9.26265 18.7496 9.3724 18.4846 9.3724 18.2083C9.3724 17.9321 9.26265 17.6671 9.0673 17.4718C8.87195 17.2764 8.607 17.1667 8.33073 17.1667C8.05446 17.1667 7.78951 17.2764 7.59416 17.4718C7.39881 17.6671 7.28906 17.9321 7.28906 18.2083C7.28906 18.4846 7.39881 18.7496 7.59416 18.9449C7.78951 19.1403 8.05446 19.25 8.33073 19.25ZM12.4974 15.0833C12.7737 15.0833 13.0386 14.9736 13.234 14.7782C13.4293 14.5829 13.5391 14.3179 13.5391 14.0417C13.5391 13.7654 13.4293 13.5004 13.234 13.3051C13.0386 13.1097 12.7737 13 12.4974 13C12.2211 13 11.9562 13.1097 11.7608 13.3051C11.5655 13.5004 11.4557 13.7654 11.4557 14.0417C11.4557 14.3179 11.5655 14.5829 11.7608 14.7782C11.9562 14.9736 12.2211 15.0833 12.4974 15.0833ZM12.4974 19.25C12.7737 19.25 13.0386 19.1403 13.234 18.9449C13.4293 18.7496 13.5391 18.4846 13.5391 18.2083C13.5391 17.9321 13.4293 17.6671 13.234 17.4718C13.0386 17.2764 12.7737 17.1667 12.4974 17.1667C12.2211 17.1667 11.9562 17.2764 11.7608 17.4718C11.5655 17.6671 11.4557 17.9321 11.4557 18.2083C11.4557 18.4846 11.5655 18.7496 11.7608 18.9449C11.9562 19.1403 12.2211 19.25 12.4974 19.25ZM16.6641 15.0833C16.9403 15.0833 17.2053 14.9736 17.4006 14.7782C17.596 14.5829 17.7057 14.3179 17.7057 14.0417C17.7057 13.7654 17.596 13.5004 17.4006 13.3051C17.2053 13.1097 16.9403 13 16.6641 13C16.3878 13 16.1228 13.1097 15.9275 13.3051C15.7321 13.5004 15.6224 13.7654 15.6224 14.0417C15.6224 14.3179 15.7321 14.5829 15.9275 14.7782C16.1228 14.9736 16.3878 15.0833 16.6641 15.0833ZM16.6641 19.25C16.9403 19.25 17.2053 19.1403 17.4006 18.9449C17.596 18.7496 17.7057 18.4846 17.7057 18.2083C17.7057 17.9321 17.596 17.6671 17.4006 17.4718C17.2053 17.2764 16.9403 17.1667 16.6641 17.1667C16.3878 17.1667 16.1228 17.2764 15.9275 17.4718C15.7321 17.6671 15.6224 17.9321 15.6224 18.2083C15.6224 18.4846 15.7321 18.7496 15.9275 18.9449C16.1228 19.1403 16.3878 19.25 16.6641 19.25Z"
                        fill="white"
                      />
                    </svg>
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
                className="absolute left-0 top-1/2 -translate-y-1/2"
              >
                <div className="bg-[#191818] backdrop-blur-lg p-6 rounded-3xl shadow-xl w-[300px] border border-white/10">
                  <h3 className="text-lg font-semibold mb-3 text-white/90">
                    {activeSlide === 0
                      ? "Adopter les bons gestes"
                      : activeSlide === 1
                      ? "Maîtriser ma consommation"
                      : activeSlide === 2
                      ? "Simuler ma facture"
                      : "Réaliser les économies"}
                  </h3>
                  <p className="text-sm text-white/60">
                    {activeSlide === 0
                      ? "Changez vos réflexes, économisez votre énergie"
                      : activeSlide === 1
                      ? "Suivez votre consommation en temps réel"
                      : activeSlide === 2
                      ? "Estimez le montant de votre facture"
                      : "Réduisez votre consommation"}
                  </p>
                </div>
              </motion.div>

              {/* Current slide (logic basé sur activeSlide) */}
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
                  p-8 
                  rounded-3xl 
                  shadow-2xl 
                  w-[300px] sm:w-[400px]
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
                  p-8 
                  rounded-3xl 
                  shadow-2xl 
                  w-[300px] sm:w-[400px]
                  border border-white/20 
                  z-20 mx-auto
                "
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-[#47B5B0]/10 rounded-xl">
                      <CarouselIcon className="w-8 h-8 text-[#47B5B0]" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#191818]">
                      Simuler ma facture
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-8">
                    Estimez facilement le montant de votre prochaine facture.
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
                      router.push("/simulateur-facture");
                    }}
                  >
                    <span>Accéder au simulateur</span>
                    <svg
                      width="25"
                      height="26"
                      viewBox="0 0 25 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.5"
                        d="M12.5 23.4163C8.08021 23.4163 5.87083 23.4163 4.49792 21.8903C3.125 20.3663 3.125 17.9101 3.125 12.9997C3.125 8.08926 3.125 5.63405 4.49792 4.10801C5.87083 2.58197 8.08125 2.58301 12.5 2.58301C16.9187 2.58301 19.1292 2.58301 20.5021 4.10801C21.875 5.63509 21.875 8.08926 21.875 12.9997C21.875 17.9101 21.875 20.3653 20.5021 21.8903C19.1292 23.4153 16.9187 23.4163 12.5 23.4163Z"
                        fill="white"
                      />
                      <path
                        d="M15.6224 6.75H9.3724C8.88802 6.75 8.64635 6.75 8.4474 6.80313C8.18268 6.87416 7.9413 7.01358 7.74749 7.20738C7.55368 7.40119 7.41426 7.64257 7.34323 7.90729C7.28906 8.10833 7.28906 8.35 7.28906 8.83333C7.28906 9.31667 7.28906 9.55937 7.34219 9.75833C7.41322 10.0231 7.55264 10.2644 7.74645 10.4582C7.94025 10.652 8.18163 10.7915 8.44635 10.8625C8.6474 10.9167 8.88906 10.9167 9.3724 10.9167H15.6224C16.1068 10.9167 16.3484 10.9167 16.5474 10.8635C16.8121 10.7925 17.0535 10.6531 17.2473 10.4593C17.4411 10.2655 17.5805 10.0241 17.6516 9.75937C17.7057 9.55833 17.7057 9.31667 17.7057 8.83333C17.7057 8.35 17.7057 8.10729 17.6526 7.90833C17.5816 7.64361 17.4422 7.40223 17.2483 7.20843C17.0545 7.01462 16.8132 6.8752 16.5484 6.80417C16.3484 6.75 16.1057 6.75 15.6224 6.75ZM8.33073 15.0833C8.607 15.0833 8.87195 14.9736 9.0673 14.7782C9.26265 14.5829 9.3724 14.3179 9.3724 14.0417C9.3724 13.7654 9.26265 13.5004 9.0673 13.3051C8.87195 13.1097 8.607 13 8.33073 13C8.05446 13 7.78951 13.1097 7.59416 13.3051C7.39881 13.5004 7.28906 13.7654 7.28906 14.0417C7.28906 14.3179 7.39881 14.5829 7.59416 14.7782C7.78951 14.9736 8.05446 15.0833 8.33073 15.0833ZM8.33073 19.25C8.607 19.25 8.87195 19.1403 9.0673 18.9449C9.26265 18.7496 9.3724 18.4846 9.3724 18.2083C9.3724 17.9321 9.26265 17.6671 9.0673 17.4718C8.87195 17.2764 8.607 17.1667 8.33073 17.1667C8.05446 17.1667 7.78951 17.2764 7.59416 17.4718C7.39881 17.6671 7.28906 17.9321 7.28906 18.2083C7.28906 18.4846 7.39881 18.7496 7.59416 18.9449C7.78951 19.1403 8.05446 19.25 8.33073 19.25ZM12.4974 15.0833C12.7737 15.0833 13.0386 14.9736 13.234 14.7782C13.4293 14.5829 13.5391 14.3179 13.5391 14.0417C13.5391 13.7654 13.4293 13.5004 13.234 13.3051C13.0386 13.1097 12.7737 13 12.4974 13C12.2211 13 11.9562 13.1097 11.7608 13.3051C11.5655 13.5004 11.4557 13.7654 11.4557 14.0417C11.4557 14.3179 11.5655 14.5829 11.7608 14.7782C11.9562 14.9736 12.2211 15.0833 12.4974 15.0833ZM12.4974 19.25C12.7737 19.25 13.0386 19.1403 13.234 18.9449C13.4293 18.7496 13.5391 18.4846 13.5391 18.2083C13.5391 17.9321 13.4293 17.6671 13.234 17.4718C13.0386 17.2764 12.7737 17.1667 12.4974 17.1667C12.2211 17.1667 11.9562 17.2764 11.7608 17.4718C11.5655 17.6671 11.4557 17.9321 11.4557 18.2083C11.4557 18.4846 11.5655 18.7496 11.7608 18.9449C11.9562 19.1403 12.2211 19.25 12.4974 19.25ZM16.6641 15.0833C16.9403 15.0833 17.2053 14.9736 17.4006 14.7782C17.596 14.5829 17.7057 14.3179 17.7057 14.0417C17.7057 13.7654 17.596 13.5004 17.4006 13.3051C17.2053 13.1097 16.9403 13 16.6641 13C16.3878 13 16.1228 13.1097 15.9275 13.3051C15.7321 13.5004 15.6224 13.7654 15.6224 14.0417C15.6224 14.3179 15.7321 14.5829 15.9275 14.7782C16.1228 14.9736 16.3878 15.0833 16.6641 15.0833ZM16.6641 19.25C16.9403 19.25 17.2053 19.1403 17.4006 18.9449C17.596 18.7496 17.7057 18.4846 17.7057 18.2083C17.7057 17.9321 17.596 17.6671 17.4006 17.4718C17.2053 17.2764 16.9403 17.1667 16.6641 17.1667C16.3878 17.1667 16.1228 17.2764 15.9275 17.4718C15.7321 17.6671 15.6224 17.9321 15.6224 18.2083C15.6224 18.4846 15.7321 18.7496 15.9275 18.9449C16.1228 19.1403 16.3878 19.25 16.6641 19.25Z"
                        fill="white"
                      />
                    </svg>
                  </motion.button>
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
              className="absolute right-0 top-1/2 -translate-y-1/2"
            >
              <div className="bg-[#191818] backdrop-blur-lg p-6 rounded-3xl shadow-xl w-[300px] border border-white/10">
                <h3 className="text-lg font-semibold mb-3 text-white/90">
                  {activeSlide === 0
                    ? "Simuler ma facture"
                    : activeSlide === 1
                    ? "Réaliser les économies"
                    : activeSlide === 2
                    ? "Adopter les bons gestes"
                    : "Maîtriser ma consommation"}
                </h3>
                <p className="text-sm text-white/60">
                  {activeSlide === 0
                    ? "Estimez le montant de votre facture"
                    : activeSlide === 1
                    ? "Réduisez votre consommation"
                    : activeSlide === 2
                    ? "Changez vos réflexes"
                    : "Suivez votre consommation en temps réel"}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Navigation du carrousel (pastilles) avec contrôles supplémentaires */}
        <div
          className="
          absolute 
          bottom-8 sm:bottom-12 
          left-1/2 
          transform -translate-x-1/2 
          flex 
          justify-center 
          items-center 
          gap-4 
          bg-white/50
          backdrop-blur-md
          px-6 sm:px-8 
          py-3 sm:py-4 
          rounded-full
          shadow-md
        "
        >
          {/* Bouton précédent */}
          <motion.button
            onClick={prevSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "tween", duration: 0.2 }}
            className="w-8 h-8 flex items-center justify-center"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="#47B5B0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>

          {/* Points de navigation */}
          {[0, 1, 2, 3].map((index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "tween", duration: 0.2 }}
              onClick={() => setActiveSlide(index)}
              className={`
              h-3
              rounded-full 
              transition-all 
              duration-300 
              ${
                activeSlide === index
                  ? "w-10 sm:w-14 bg-[#47B5B0] shadow-md"
                  : "w-3 bg-gray-300 hover:bg-gray-400"
              }
            `}
            />
          ))}

          {/* Bouton suivant */}
          <motion.button
            onClick={nextSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "tween", duration: 0.2 }}
            className="w-8 h-8 flex items-center justify-center"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 6L15 12L9 18"
                stroke="#47B5B0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </div>
      </motion.section>

      {/* Section 9 */}
      <div className="relative w-full max-w-[90%] mx-auto mb-[60px] sm:mb-[80px] md:mb-[100px]">
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
        "
        >
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

        {/* <div
          className="absolute bottom-0 left-0 right-0 mx-auto"
          style={{
            width: "40%",
            height: "60px",
            backgroundImage: `url("data:image/svg+xml,%3Csvg%20width%3D%22400%22%20height%3D%2260%22%20viewBox%3D%220%200%20400%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M0%2C60%20Q20%2C30%2040%2C0%20L360%2C0%20Q380%2C30%20400%2C60%20Z%22%20fill%3D%22white%22%20%2F%3E%0A%20%20%3C%2Fsvg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "contain",
            transform: "translateY(50%)",
            zIndex: 10,
          }}
        /> */}
      </div>
    </div>
  );
}
