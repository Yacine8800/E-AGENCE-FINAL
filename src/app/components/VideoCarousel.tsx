"use client";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const VideoCarousel = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isHalfway, setIsHalfway] = useState(false);

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

  return (
    <div className="relative px-4 sm:px-6 md:px-12 lg:px-[80px] w-full h-[450px] sm:h-[550px] md:h-[650px] lg:h-[850px] overflow-hidden">
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
            e-agence
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
          et profitez d'une expérience simplifiée et{" "}
          <strong className="font-semibold">plus efficace</strong>.
        </motion.p>

        {/* Boutons animés - espacement réduit */}
        <motion.div className="mt-2 sm:mt-3 flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto max-w-[85%] sm:max-w-none mx-auto">
          <motion.button
            className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 border border-black rounded-full text-black font-medium text-xs sm:text-sm bg-white hover:bg-black hover:text-white transition-all w-full sm:w-auto"
            initial={{ x: 100, opacity: 0, filter: "blur(10px)" }}
            animate={isHalfway ? { x: 0, opacity: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Devenir client
          </motion.button>
          <motion.button
            className="px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 bg-black text-white rounded-full font-medium text-xs sm:text-sm hover:bg-white hover:text-black hover:border hover:border-black transition-all w-full sm:w-auto"
            initial={{ x: 100, opacity: 0, filter: "blur(10px)" }}
            animate={isHalfway ? { x: 0, opacity: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 1, ease: "easeOut", delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Créer un compte
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoCarousel;
