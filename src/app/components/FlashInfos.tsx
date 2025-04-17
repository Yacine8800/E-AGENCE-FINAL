"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function FlashInfos() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotification] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 2;

  const [notification, setNotification] = useState<{
    title: string;
    body: string;
  } | null>(null);

  useEffect(() => {
    // Handler for foreground notifications (when app is active)
    const handleNotification = (event: Event) => {
      const customEvent = event as CustomEvent<{ title: string; body: string; data?: any }>;
      console.log("Foreground notification received:", customEvent.detail);
      
      // Vérifier si c'est une notification de test
      const isTestNotification = 
        (customEvent.detail.title === "Notification pour Safari" && 
         customEvent.detail.body.includes("temps réel même sur Safari")) ||
        (customEvent.detail.data && customEvent.detail.data.type === "safari-test");
        
      // Ne pas afficher les notifications de test
      if (!isTestNotification) {
        setNotification({
          title: customEvent.detail.title,
          body: customEvent.detail.body,
        });
      } else {
        console.log("Notification de test ignorée dans l'UI");
      }
    };

    // Setup broadcast channel to receive messages from service worker
    // This helps receive notifications when the browser tab is not active
    let broadcastChannel: BroadcastChannel | null = null;
    
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        broadcastChannel = new BroadcastChannel('firebase-messaging-sw-channel');
        
        broadcastChannel.onmessage = (event) => {
          console.log("Broadcast channel message received:", event.data);
          
          if (event.data && event.data.type === 'BACKGROUND_NOTIFICATION') {
            const notificationData = event.data.payload;
            
            // Vérifier si c'est une notification de test
            const isTestNotification = 
              (notificationData.title === "Notification pour Safari" && 
               notificationData.body.includes("temps réel même sur Safari")) ||
              (notificationData.data && notificationData.data.type === "safari-test");
              
            // Ne pas afficher les notifications de test
            if (!isTestNotification) {
              setNotification({
                title: notificationData.title,
                body: notificationData.body
              });
            } else {
              console.log("Notification de test ignorée dans l'UI (broadcast channel)");
            }
          }
        };
        
        // Log connection status
        console.log("Broadcast channel connected for notifications");
      } catch (err) {
        console.error("Error setting up BroadcastChannel:", err);
      }
    }

    // Register normal event listener for foreground notifications
    window.addEventListener("firebase-notification", handleNotification);

    return () => {
      // Clean up event listeners
      window.removeEventListener("firebase-notification", handleNotification);
      
      // Close broadcast channel if it exists
      if (broadcastChannel) {
        try {
          broadcastChannel.close();
        } catch (err) {
          console.error("Error closing broadcast channel:", err);
        }
      }
    };
  }, []);

  // Ajouter un effet pour afficher automatiquement la notification lorsqu'elle est reçue
  useEffect(() => {
    if (notification && !isOpen) {
      // Ouvrir automatiquement la notification pendant quelques secondes
      setIsOpen(true);
      // Fermer automatiquement après 5 secondes
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    boxShadow: [
      "0 0 0 0px rgba(214, 81, 45, 0)",
      "0 0 0 2px rgba(214, 81, 45, 0.5)",
      "0 0 0 0px rgba(214, 81, 45, 0)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const nextSlide = () => {
    setCurrentSlide((current) => (current === totalSlides ? 1 : current + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((current) => (current === 1 ? totalSlides : current - 1));
  };

  return (
    <div
      className="
        fixed 
        left-3 bottom-3 
        sm:left-6 sm:bottom-6 
        md:left-8 md:bottom-8 
        z-50
      "
    >
      <motion.div
        className="
          relative 
          flex 
          items-center 
          bg-white 
          w-[120px] 
          sm:w-[160px] 
          md:w-[200px] 
          h-[50px] 
          sm:h-[60px] 
          md:h-[69px] 
          p-3 sm:p-4 md:p-5 
          gap-2 sm:gap-[10px] 
          rounded-[15px] sm:rounded-[20px] 
          shadow-lg 
          cursor-pointer 
          hover:shadow-xl 
          transition-shadow
        "
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <motion.div
          className={`
            w-8 h-8 
            sm:w-10 sm:h-10 
            md:w-[42px] md:h-[42px] 
            ${notification ? "bg-[#D6512D]" : "bg-[#F4793B]"}
            rounded-[5px] sm:rounded-[10px] 
            flex items-center justify-center
          `}
          animate={notification ? pulseAnimation : {}}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z"
              fill="white"
            />
          </svg>
        </motion.div>

        <div className="flex-1">
          <div className="relative inline-block">
            <span className="text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap">
              Flash infos
            </span>
            {notification && (
              <div className="absolute -right-4 -top-2">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="24"
                    height="24"
                    rx="12"
                    fill="#D6512D"
                    fillOpacity="0.3"
                  />
                  <path
                    d="M10.4922 13.9L9.75219 5H14.2722L13.5122 13.9H10.4922ZM12.0122 19.18C10.6722 19.18 9.73219 18.24 9.73219 17.08C9.73219 15.9 10.6722 15.02 12.0122 15.02C13.3522 15.02 14.2722 15.9 14.2722 17.08C14.2722 18.24 13.3522 19.18 12.0122 19.18Z"
                    fill="#D6512D"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 "
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="
                absolute
                bottom-full 
                mb-4 
                left-0 
                w-[280px] 
                sm:w-[320px] 
                md:w-[400px] 
                bg-white/95 
                backdrop-blur-md 
                rounded-[20px] 
                sm:rounded-[30px] 
                md:rounded-[30px]
                shadow-2xl 
                border 
                border-gray-100/20 
                p-4 
                sm:p-6
                md:p-8
              "
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6 sm:mb-8">
                <div>
                  <motion.h3
                    className="text-lg sm:text-xl md:text-2xl font-bold text-[#F4793B] leading-tight mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {notification ? (
                      <span>{notification.title}</span>
                    ) : (
                      <span>Notification</span>
                    )}
                  </motion.h3>
                  <motion.div
                    className="h-1 w-12 sm:w-16 bg-[#F4793B]/20 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="
                    text-gray-400 
                    hover:text-gray-600 
                    p-2 
                    -mr-2 
                    -mt-2 
                    rounded-full 
                    hover:bg-gray-50 
                    transition-all
                  "
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>

              <motion.div
                className="mb-6 sm:mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {notification ? (
                  <p className="text-gray-800 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 md:mb-6">
                    {notification.body}
                  </p>
                ) : (
                  <p className="text-red-500 text-base text-center font-bold sm:text-lg md:text-base leading-relaxed mb-4 sm:mb-6">
                    Aucune notification
                  </p>
                )}
                <div className="text-gray-800 text-xs sm:text-sm md:text-base">
                  Plus d&apos;infos :{" "}
                  <a
                    href="http://www.cie.ci"
                    className="
                      text-[#F4793B] 
                      underline 
                      decoration-[#F4793B]/30 
                      hover:decoration-[#F4793B] 
                      hover:text-[#D6512D] 
                      transition-all
                    "
                  >
                    www.cie.ci
                  </a>{" "}
                  et nos réseaux sociaux
                </div>
              </motion.div>

              <motion.div
                className="flex items-center justify-between mt-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  className="
                    w-10 h-10 
                    sm:w-[42px] sm:h-[42px] 
                    bg-[#F4793B] 
                    rounded-[5px] sm:rounded-[10px] 
                    flex items-center justify-center 
                    relative 
                    group
                  "
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-[#F4793B]/20 rounded-[20px] group-hover:scale-110 transition-transform"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="relative z-10"
                  >
                    <path
                      d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z"
                      fill="white"
                    />
                  </svg>
                </motion.div>

                <div className="flex items-center gap-4 sm:gap-6">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevSlide();
                    }}
                    className="
                      w-10 h-10 
                      sm:w-12 sm:h-12 
                      flex items-center justify-center 
                      bg-gray-50 
                      rounded-full 
                      hover:bg-gray-100 
                      transition-all 
                      relative 
                      group
                    "
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gray-200/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="relative z-10"
                    >
                      <path
                        d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"
                        fill="currentColor"
                      />
                    </svg>
                  </motion.button>

                  <div className="relative">
                    <motion.div
                      className="absolute -inset-4 bg-gray-50/50 rounded-full -z-10"
                      initial={false}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-sm sm:text-base md:text-base font-medium text-gray-800 min-w-[50px] sm:min-w-[80px] text-center select-none">
                      {currentSlide} sur {totalSlides}
                    </span>
                  </div>

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextSlide();
                    }}
                    className="
                      w-10 h-10 
                      sm:w-12 sm:h-12 
                      flex items-center 
                      justify-center 
                      bg-gray-50 
                      rounded-full 
                      hover:bg-gray-100 
                      transition-all 
                      relative 
                      group
                    "
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gray-200/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="relative z-10"
                    >
                      <path
                        d="M8.59 16.59L10 18L16 12L10 6L8.59 7.41L13.17 12L8.59 16.59Z"
                        fill="currentColor"
                      />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
