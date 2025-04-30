"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface GenericPageProps {
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  secondButtonText?: string;
  secondButtonLink?: string;
  imageLeft?: string;
  imageRight?: string;
  highlightColor?: string;
  highlightWord?: string;
  onButtonClick?: () => void;
}

const GenericPage: React.FC<GenericPageProps> = ({
  title,
  description,
  buttonText,
  buttonLink,
  secondButtonText,
  secondButtonLink,
  imageRight,
  highlightColor = "#47B5B0",
  highlightWord,
  onButtonClick,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Fonction pour ouvrir le chatbot avec un message prédéfini
  const handleOpenChatbot = () => {
    // Vérifier si la fonction globale existe
    if (typeof window !== "undefined") {
      // Vérifier si la fonction globale d'envoi de message est disponible
      if (typeof (window as any).__sendMessageToBot === 'function') {
        console.log("Utilisation de la fonction globale __sendMessageToBot");
        const messageToSend = `Je souhaite des informations concernant ${title}`;
        // Appeler directement la fonction exposée par FloatingBot
        (window as any).__sendMessageToBot(messageToSend);
      } else {
        // Fallback: utiliser l'événement personnalisé avec le message dans detail
        console.log("Fonction globale non disponible, utilisation de l'événement personnalisé");
        const event = new CustomEvent('open-floating-bot-chat', {
          detail: { message: `Je souhaite des informations concernant ${title}` }
        });
        document.dispatchEvent(event);
      }
    }
  };

  const getHighlightedTitle = () => {
    if (!title) return { beforeText: "", highlightedWord: "" };

    if (highlightWord && title.includes(highlightWord)) {
      const parts = title.split(new RegExp(`(${highlightWord})`, 'i'));
      const index = parts.findIndex(part => part.toLowerCase() === highlightWord.toLowerCase());

      if (index !== -1) {
        const beforeText = parts.slice(0, index).join('');
        return { beforeText, highlightedWord: parts[index] };
      }
    }

    const words = title.split(' ');
    const lastWord = words.pop() || "";
    const beforeText = words.length ? words.join(' ') + ' ' : "";

    return { beforeText, highlightedWord: lastWord };
  };

  const { beforeText, highlightedWord } = getHighlightedTitle();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 -mt-[20px] sm:px-6 md:px-8 lg:px-10 xl:px-12 overflow-hidden">
      <div className="w-[96%] bg-[#F3F3F3] rounded-[40px] py-8 sm:py-10 md:py-12 lg:py-16 overflow-hidden">
        <div className="container mx-auto overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold text-noir mb-6 sm:mb-8 md:mb-10">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.5 }}
                >
                  {beforeText}
                </motion.span>
                <motion.span
                  className={`text-[${highlightColor}] relative inline-block`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {highlightedWord}
                  <motion.svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: isVisible ? 1 : 0, opacity: isVisible ? 1 : 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
                  >
                    <motion.path
                      d="M1 5.5C47.3333 2.16667 146.667 2.16667 199 5.5"
                      stroke={highlightColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: isVisible ? 1 : 0 }}
                      transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
                    />
                  </motion.svg>
                </motion.span>
              </h1>

              {description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 md:mb-10 max-w-[500px] sm:max-w-[600px] mx-auto lg:mx-0"
                >
                  {description}
                </motion.p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-nowrap gap-4 justify-center lg:justify-start items-center"
              >
                {buttonText && (
                  <a
                    href={buttonLink || "#"}
                    onClick={(e) => {
                      if (onButtonClick) {
                        e.preventDefault();
                        onButtonClick();
                      }
                    }}
                    className="inline-block bg-orange hover:bg-noir font-semibold text-white px-6 sm:px-8 py-3 sm:py-4 rounded-3xl transition-colors duration-300 text-sm sm:text-base md:text-lg whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {buttonText}
                  </a>
                )}

                {secondButtonText && (
                  <button
                    onClick={handleOpenChatbot}
                    className="inline-flex items-center bg-vert hover:bg-vert font-semibold text-white px-6 sm:px-8 py-3 sm:py-4 rounded-3xl transition-colors duration-300 text-sm sm:text-base md:text-lg whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    <img
                      src="/chat/bot.png"
                      alt="Bot"
                      className="w-6 h-6 mr-2"
                    />
                    {secondButtonText}
                    <svg className="ml-2" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23.0722 15.3445L16.9211 13.0781L14.6547 6.92695C14.5392 6.61399 14.3306 6.34394 14.057 6.15319C13.7833 5.96245 13.4578 5.86019 13.1242 5.86019C12.7906 5.86019 12.4651 5.96245 12.1914 6.15319C11.9178 6.34394 11.7092 6.61399 11.5937 6.92695L9.32731 13.0781L3.17614 15.3445C2.86318 15.46 2.59312 15.6686 2.40238 15.9422C2.21164 16.2159 2.10938 16.5414 2.10938 16.875C2.10938 17.2086 2.21164 17.5341 2.40238 17.8078C2.59312 18.0814 2.86318 18.29 3.17614 18.4055L9.32731 20.6719L11.5937 26.823C11.7092 27.136 11.9178 27.4061 12.1914 27.5968C12.4651 27.7876 12.7906 27.8898 13.1242 27.8898C13.4578 27.8898 13.7833 27.7876 14.057 27.5968C14.3306 27.4061 14.5392 27.136 14.6547 26.823L16.9211 20.6719L23.0722 18.4055C23.3852 18.29 23.6553 18.0814 23.846 17.8078C24.0367 17.5341 24.139 17.2086 24.139 16.875C24.139 16.5414 24.0367 16.2159 23.846 15.9422C23.6553 15.6686 23.3852 15.46 23.0722 15.3445ZM22.5859 17.0859L16.1312 19.4648C16.0356 19.5 15.9488 19.5555 15.8768 19.6276C15.8047 19.6996 15.7492 19.7864 15.714 19.882L13.3351 26.3367C13.3191 26.3798 13.2904 26.4169 13.2527 26.4431C13.2149 26.4694 13.1701 26.4834 13.1242 26.4834C13.0783 26.4834 13.0334 26.4694 12.9957 26.4431C12.958 26.4169 12.9292 26.3798 12.9133 26.3367L10.5343 19.882C10.4992 19.7864 10.4437 19.6996 10.3716 19.6276C10.2996 19.5555 10.2128 19.5 10.1172 19.4648L3.66247 17.0859C3.61941 17.07 3.58227 17.0412 3.55605 17.0035C3.52982 16.9658 3.51577 16.9209 3.51577 16.875C3.51577 16.8291 3.52982 16.7842 3.55605 16.7465C3.58227 16.7088 3.61941 16.68 3.66247 16.6641L10.1172 14.2852C10.2128 14.25 10.2996 14.1945 10.3716 14.1224C10.4437 14.0504 10.4992 13.9636 10.5343 13.868L12.9133 7.41328C12.9292 7.37022 12.958 7.33309 12.9957 7.30686C13.0334 7.28064 13.0783 7.26658 13.1242 7.26658C13.1701 7.26658 13.2149 7.28064 13.2527 7.30686C13.2904 7.33309 13.3191 7.37022 13.3351 7.41328L15.714 13.868C15.7492 13.9636 15.8047 14.0504 15.8768 14.1224C15.9488 14.1945 16.0356 14.25 16.1312 14.2852L22.5859 16.6641C22.629 16.68 22.6661 16.7088 22.6923 16.7465C22.7186 16.7842 22.7326 16.8291 22.7326 16.875C22.7326 16.9209 22.7186 16.9658 22.6923 17.0035C22.6661 17.0412 22.629 17.07 22.5859 17.0859ZM17.1086 4.6875C17.1086 4.50102 17.1826 4.32218 17.3145 4.19032C17.4464 4.05845 17.6252 3.98438 17.8117 3.98438H19.9211V1.875C19.9211 1.68852 19.9951 1.50968 20.127 1.37782C20.2589 1.24595 20.4377 1.17188 20.6242 1.17188C20.8107 1.17188 20.9895 1.24595 21.1214 1.37782C21.2532 1.50968 21.3273 1.68852 21.3273 1.875V3.98438H23.4367C23.6232 3.98438 23.802 4.05845 23.9339 4.19032C24.0657 4.32218 24.1398 4.50102 24.1398 4.6875C24.1398 4.87398 24.0657 5.05282 23.9339 5.18469C23.802 5.31655 23.6232 5.39063 23.4367 5.39063H21.3273V7.5C21.3273 7.68648 21.2532 7.86532 21.1214 7.99718C20.9895 8.12905 20.8107 8.20313 20.6242 8.20313C20.4377 8.20313 20.2589 8.12905 20.127 7.99718C19.9951 7.86532 19.9211 7.68648 19.9211 7.5V5.39063H17.8117C17.6252 5.39063 17.4464 5.31655 17.3145 5.18469C17.1826 5.05282 17.1086 4.87398 17.1086 4.6875ZM28.8273 10.3125C28.8273 10.499 28.7532 10.6778 28.6214 10.8097C28.4895 10.9415 28.3107 11.0156 28.1242 11.0156H26.9523V12.1875C26.9523 12.374 26.8782 12.5528 26.7464 12.6847C26.6145 12.8165 26.4357 12.8906 26.2492 12.8906C26.0627 12.8906 25.8839 12.8165 25.752 12.6847C25.6201 12.5528 25.5461 12.374 25.5461 12.1875V11.0156H24.3742C24.1877 11.0156 24.0089 10.9415 23.877 10.8097C23.7451 10.6778 23.6711 10.499 23.6711 10.3125C23.6711 10.126 23.7451 9.94718 23.877 9.81532C24.0089 9.68346 24.1877 9.60938 24.3742 9.60938H25.5461V8.4375C25.5461 8.25102 25.6201 8.07218 25.752 7.94032C25.8839 7.80846 26.0627 7.73438 26.2492 7.73438C26.4357 7.73438 26.6145 7.80846 26.7464 7.94032C26.8782 8.07218 26.9523 8.25102 26.9523 8.4375V9.60938H28.1242C28.3107 9.60938 28.4895 9.68346 28.6214 9.81532C28.7532 9.94718 28.8273 10.126 28.8273 10.3125Z" fill="white" />
                    </svg>
                  </button>
                )}
              </motion.div>
            </div>

            {imageRight && (
              <motion.div
                className="w-full lg:w-1/2 mt-6 lg:mt-0"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <img
                  src={imageRight}
                  alt="Illustration"
                  className="w-full h-auto rounded-lg max-w-[400px] sm:max-w-[450px] md:max-w-[500px] mx-auto lg:mx-0"
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericPage;
