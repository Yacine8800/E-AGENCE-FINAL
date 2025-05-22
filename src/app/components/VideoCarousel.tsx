"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const VideoCarousel = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isHalfway, setIsHalfway] = useState(false);
  const [isHoveredClient, setIsHoveredClient] = useState(false);
  const [isHoveredCompte, setIsHoveredCompte] = useState(false);

  useEffect(() => {
    const checkVideoProgress = () => {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        const duration = videoRef.current.duration;

        if (currentTime >= duration / 2 && !isHalfway) {
          setIsHalfway(true);
        }
      }
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener("timeupdate", checkVideoProgress);
    }

    return () => {
      if (video) {
        video.removeEventListener("timeupdate", checkVideoProgress);
      }
    };
  }, [isHalfway]);

  // Variantes pour l'animation du fond du bouton
  const backgroundVariants = {
    default: {
      height: "100%",
      width: "0%",
    },
    hover: {
      height: "100%",
      width: "100%",
    },
  };

  // Variantes pour l'animation du texte
  const textVariants = {
    default: {
      y: 0,
    },
    hover: {
      y: -30,
    },
  };

  // Variantes pour l'animation du texte secondaire
  const secondTextVariants = {
    default: {
      y: 30,
      opacity: 0,
    },
    hover: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="relative px-4 sm:px-6 md:px-12 lg:px-[80px] w-full h-[650px] sm:h-[550px] md:h-[650px] lg:h-[850px] overflow-hidden">
      {/* Vidéo de fond */}
      <video
        ref={videoRef}
        src="/video.mp4"
        className="w-full h-[350px] sm:h-[500px] md:h-[600px] lg:h-[795px] object-cover rounded-[10px] sm:rounded-[20px] brightness-90"
        autoPlay
        muted
        playsInline
      >
        <source src="/video.mp4" type="video/quicktime" />
      </video>

      {/* Conteneur du texte et des boutons - positionné plus haut sur la vidéo */}
      <div className="absolute inset-x-0 bottom-12 sm:bottom-16 md:bottom-24 lg:bottom-32 flex flex-col items-center text-center px-4 sm:px-6 md:px-8 z-10">
        {/* Ligne de texte animée sur une seule ligne */}
        <motion.div className="flex flex-row flex-wrap justify-center items-center gap-1 sm:gap-2">
          <motion.span
            initial={{ x: -100, opacity: 0, filter: "blur(10px)", scale: 1.5 }}
            animate={
              isHalfway
                ? { x: 0, opacity: 1, filter: "blur(0px)", scale: 1 }
                : {}
            }
            transition={{ duration: 1, ease: "easeOut" }}
            className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-5xl text-black whitespace-nowrap"
          >
            Akwaba
          </motion.span>

          <motion.span
            initial={{ scale: 2, opacity: 0, filter: "blur(10px)" }}
            animate={
              isHalfway ? { scale: 1, opacity: 1, filter: "blur(0px)" } : {}
            }
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl lg:text-4xl text-black font-normal whitespace-nowrap"
          >
            sur votre
          </motion.span>

          <motion.span
            initial={{ x: 100, opacity: 0, filter: "blur(10px)", scale: 1.5 }}
            animate={
              isHalfway
                ? { x: 0, opacity: 1, filter: "blur(0px)", scale: 1 }
                : {}
            }
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-5xl text-black italic font-semibold whitespace-nowrap"
          >
            agence en ligne
          </motion.span>
        </motion.div>

        {/* Sous-texte - espacement réduit pour s'assurer qu'il reste sur la vidéo */}
        <motion.p
          className="mt-1 sm:mt-2 md:mt-3 text-xs sm:text-sm md:text-base text-black max-w-[280px] sm:max-w-[380px] md:max-w-lg mx-auto leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={isHalfway ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
        >
          Votre agence évolue pour mieux vous servir !{" "}
          <strong className="font-semibold">Explorez</strong> dès maintenant nos{" "}
          <strong className="font-semibold">nouveaux services en ligne</strong>{" "}
          et profitez d&apos;une expérience simplifiée et{" "}
          <strong className="font-semibold">plus efficace</strong>.
        </motion.p>

        {/* Nouveaux boutons design innovant */}
        <motion.div
          className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-[300px] sm:max-w-none mx-auto justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={isHalfway ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {/* Bouton Devenir client */}
          <motion.div
            className="relative overflow-hidden h-12 sm:h-14 w-full sm:w-44 md:w-48 rounded-lg border-2 border-black cursor-pointer bg-white backdrop-blur-sm bg-opacity-70"
            onHoverStart={() => setIsHoveredClient(true)}
            onHoverEnd={() => setIsHoveredClient(false)}
            whileTap={{ scale: 0.97 }}
          >
            {/* Fond animé */}
            <motion.div
              className="absolute bottom-0 left-0 bg-black"
              initial="default"
              animate={isHoveredClient ? "hover" : "default"}
              variants={backgroundVariants}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />

            {/* Texte principal */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center font-medium text-sm sm:text-base text-black"
              initial="default"
              animate={isHoveredClient ? "hover" : "default"}
              variants={textVariants}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              Devenir client
            </motion.div>

            {/* Texte secondaire */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center font-medium text-sm sm:text-base text-white"
              initial="default"
              animate={isHoveredClient ? "hover" : "default"}
              variants={secondTextVariants}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              C'est parti →
            </motion.div>
          </motion.div>

          {/* Bouton Créer un compte */}
          <motion.div
            className="relative overflow-hidden h-12 sm:h-14 w-full sm:w-44 md:w-48 rounded-lg border-2 border-black cursor-pointer bg-black backdrop-blur-sm bg-opacity-90"
            onHoverStart={() => setIsHoveredCompte(true)}
            onHoverEnd={() => setIsHoveredCompte(false)}
            whileTap={{ scale: 0.97 }}
          >
            {/* Fond animé */}
            <motion.div
              className="absolute bottom-0 left-0 bg-white"
              initial="default"
              animate={isHoveredCompte ? "hover" : "default"}
              variants={backgroundVariants}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />

            {/* Texte principal */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center font-medium text-sm sm:text-base text-white"
              initial="default"
              animate={isHoveredCompte ? "hover" : "default"}
              variants={textVariants}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              Créer un compte
            </motion.div>

            {/* Texte secondaire */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center font-medium text-sm sm:text-base text-black"
              initial="default"
              animate={isHoveredCompte ? "hover" : "default"}
              variants={secondTextVariants}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              S'inscrire →
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoCarousel;
