"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import { useAppSelector } from "@/src/store/hooks"; // Import du hook Redux
import ChatBot from "./ChatBot";
import SimpleMessage from "./SimpleMessage";
import { API_BOT_CIE, API_BOT_CIE_SUBSCRIBE } from "@/config/constants";
import axios from "axios";
import { decodeTokens } from "@/utils/tokendecod";
import { collectRoutesUsingEdgeRuntime } from "next/dist/build/utils";

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Define MqttTokenType to match the interface in ChatBot.tsx
interface MqttTokenType {
  user_id: number;
  client_id: string;
  nom: string;
  prenom: string;
  certified_account: boolean;
  uuid_llm: string;
  photoProfil: string | null;
  iat?: number;
  abonnements?: {
    postpayes: any[];
    prepayes: any[];
  };
}

export default function FloatingBot() {
  const [isHovered, setIsHovered] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mqttToken, setMqttToken] = useState<MqttTokenType | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [animationData, setAnimationData] = useState<any>(null);
  const defaultClientId = "AQ123456789";
  const [initialMessage, setInitialMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Récupérer les informations de l'utilisateur connecté depuis Redux store
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  console.log(user?._id, "user");

  // Référence vers l'élément input du chatbot
  const chatInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Import the animation data dynamically
    import("../../../public/bot-anime-flow.json").then((data) => {
      setAnimationData(data.default);
    });
  }, []);

  // Check if a modal is open
  useEffect(() => {
    const checkForOpenModals = () => {
      // Look for fixed elements with z-50 class that might be modals
      const modals = document.querySelectorAll('.fixed.inset-0.z-50');
      let modalFound = false;

      modals.forEach(modal => {
        // Check if this is a demand-related modal by looking for heading content
        const headings = modal.querySelectorAll('h2');
        headings.forEach(heading => {
          if (heading.textContent?.includes('Demande')) {
            modalFound = true;
          }
        });

        // Also check for any modal with ModalDEmande structure
        if (modal.querySelector('.bg-[#F8F9F9].rounded-l-2xl')) {
          modalFound = true;
        }
      });

      setIsModalOpen(modalFound);
    };

    // Listen for custom events for modal state
    const handleModalOpened = () => {
      setIsModalOpen(true);
    };

    const handleModalClosed = () => {
      setIsModalOpen(false);
    };

    // Add event listeners for custom events
    window.addEventListener('modal-opened', handleModalOpened);
    window.addEventListener('modal-closed', handleModalClosed);

    // Run the check initially
    checkForOpenModals();

    // Set up a mutation observer to detect when modals are added or removed
    const observer = new MutationObserver(checkForOpenModals);

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('modal-opened', handleModalOpened);
      window.removeEventListener('modal-closed', handleModalClosed);
    };
  }, []);

  // Ajouter un écouteur d'événement pour ouvrir le chatbot
  useEffect(() => {
    const handleCustomOpenEvent = (e: Event) => {
      console.log("Événement open-floating-bot-chat reçu");

      // Vérifier si un message initial est fourni dans l'événement personnalisé
      if (e instanceof CustomEvent && e.detail && e.detail.message) {
        console.log("Message initial reçu:", e.detail.message);
        setInitialMessage(e.detail.message);
      }

      handleOpenChat();
    };

    // Enregistrer l'écouteur d'événement global
    document.addEventListener('open-floating-bot-chat', handleCustomOpenEvent);

    // Fonction pour exposer l'ouverture du chatbot à l'extérieur
    const sendMessageToBot = (message: string) => {
      setInitialMessage(message);
      handleOpenChat();
    };

    // Exposer la fonction globalement pour l'accès externe
    if (typeof window !== 'undefined') {
      (window as any).__sendMessageToBot = sendMessageToBot;
      console.log("Fonction __sendMessageToBot exposée globalement");
    }

    // Nettoyer l'écouteur d'événement lorsque le composant est démonté
    return () => {
      document.removeEventListener('open-floating-bot-chat', handleCustomOpenEvent);

      // Nettoyer également la fonction globale
      if (typeof window !== 'undefined') {
        delete (window as any).__sendMessageToBot;
      }
    };
  }, []);

  // Fonction pour obtenir l'ID client à utiliser
  const getClientId = () => {
    // Si l'utilisateur est authentifié et a un ID, l'utiliser
    if (isAuthenticated && user && user._id) {


      return user._id;
    }

    // Sinon, essayer de récupérer depuis localStorage
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData && userData._id) {
            return userData._id;
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de l'utilisateur du localStorage:", error);
        }
      }
    }

    // Utiliser l'ID par défaut si aucun utilisateur n'est trouvé
    return defaultClientId;
  };

  // Fonction pour obtenir le nom et prénom
  const getUserName = () => {
    let nom = "Anonyme";
    let prenom = "Anonyme";

    // Si l'utilisateur est authentifié et a un nom/prénom, les utiliser
    if (isAuthenticated && user) {
      nom = user.lastname || "Anonyme";
      prenom = user.firstname || "Anonyme";
    } else {
      // Sinon, essayer de récupérer depuis localStorage
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            if (userData) {
              nom = userData.lastname || "Anonyme";
              prenom = userData.firstname || "Anonyme";
            }
          } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur du localStorage:", error);
          }
        }
      }
    }

    return { nom, prenom };
  };

  // Logique de récupération du token MQTT
  const getTokenForMqtt = async () => {
    try {
      const clientId = getClientId();
      const { nom, prenom } = getUserName();

      console.log(`Récupération du token MQTT pour: ID=${clientId}, Nom=${nom}, Prénom=${prenom}`);

      // Appel API pour récupérer le token
      const response = await axios.post(`${API_BOT_CIE}api/v1/getToken`, {
        client_id: clientId,
        nom: nom,
        prenom: prenom,
      });

      const data = response.data;

      // Stocker le token MQTT
      if (data.token) {
        // Définir le token et décoder immédiatement pour obtenir mqttToken
        setToken(data.token);
        const decodedToken = decodeTokens(data.token);
        setMqttToken(decodedToken);


        // S'assurer que le token décodé est disponible avant de continuer
        if (decodedToken && decodedToken.user_id) {
          try {
            console.log(`Souscription au topic: user-${decodedToken.user_id}-messages`);

            // Utiliser le token décodé directement plutôt que l'état qui pourrait ne pas être encore mis à jour
            const subscribeResponse = await axios.post(
              `${API_BOT_CIE_SUBSCRIBE}user-${decodedToken.user_id}-messages`,
              {},
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${data.token}`,
                },
              }
            );

            console.log("Souscription réussie:", subscribeResponse.data);
          } catch (subscribeError) {
            console.error("Erreur lors de la souscription au topic MQTT:", subscribeError);
          }
        } else {
          console.error("Token décodé invalide ou user_id manquant");
        }
      } else {
        throw new Error("Le token n'a pas été trouvé dans la réponse");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du token MQTT:", error);
    }
  };

  const handleOpenChat = () => {
    console.log("Ouverture du chatbot");
    setIsChatOpen(true);
    getTokenForMqtt();
  };

  // Effet pour envoyer le message initial quand le chatbot est ouvert
  useEffect(() => {
    if (isChatOpen && initialMessage) {
      console.log("Chatbot ouvert, tentative d'envoi du message initial:", initialMessage);

      // Fonction pour trouver l'input et envoyer le message
      const sendInitialMessage = () => {
        const chatbotInputs = document.querySelectorAll('input[placeholder*="Message à Clem\'Bot"]');
        console.log("Recherche de l'input du chatbot, trouvé:", chatbotInputs.length);

        if (chatbotInputs.length > 0) {
          const input = chatbotInputs[0] as HTMLInputElement;
          chatInputRef.current = input;

          // Définir la valeur de l'input
          input.value = initialMessage;

          // Déclencher l'événement input pour React
          const inputEvent = new Event('input', { bubbles: true });
          input.dispatchEvent(inputEvent);

          // Trouver le bouton d'envoi ou simuler l'appui sur Entrée
          setTimeout(() => {
            // Chercher le formulaire parent et le soumettre directement
            const form = input.closest('form');
            if (form) {
              console.log("Formulaire trouvé, soumission directe");
              const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
              form.dispatchEvent(submitEvent);
            } else {
              // Simuler l'appui sur Entrée
              console.log("Simulation de l'appui sur Entrée");
              const enterEvent = new KeyboardEvent('keypress', {
                key: 'Enter',
                code: 'Enter',
                bubbles: true,
                cancelable: true
              });
              input.dispatchEvent(enterEvent);

              // Chercher aussi un bouton d'envoi à cliquer
              setTimeout(() => {
                const sendButtons = document.querySelectorAll('button[type="submit"], button.send-button, svg[data-testid="send"]');
                if (sendButtons.length > 0) {
                  console.log("Bouton d'envoi trouvé, clic");
                  (sendButtons[0] as HTMLElement).click();
                }
              }, 200);
            }

            // Réinitialiser le message initial après envoi
            setInitialMessage(null);
          }, 500);
        } else {
          // Réessayer si l'input n'est pas encore disponible
          console.log("Input non trouvé, nouvelle tentative dans 500ms");
          setTimeout(sendInitialMessage, 500);
        }
      };

      // Commencer à chercher l'input après un délai pour laisser le chat se charger
      setTimeout(sendInitialMessage, 1500);
    }
  }, [isChatOpen, initialMessage]);

  return (
    <>
      <AnimatePresence mode="sync">
        {isHovered && !isChatOpen && !isModalOpen && (
          <SimpleMessage onClose={() => setIsHovered(false)} />
        )}
        {isChatOpen && (
          <ChatBot
            onClose={() => setIsChatOpen(false)}
            mqttToken={mqttToken}
            clientId={getClientId()}
            token={token}
          />
        )}
      </AnimatePresence>

      {!isModalOpen && (
        <motion.div
          className="
            fixed 
            bottom-4 right-4 
            sm:bottom-16 sm:right-8 
            md:bottom-2 md:right-12 
            z-50
          "
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <motion.button
            className="
              rounded-full 
              shadow-lg 
              hover:shadow-xl 
              transition-all 
              duration-300
              w-[60px] h-[60px]
              overflow-hidden
              bg-white
            "
            whileHover={{ scale: 1.05 }}
            onClick={handleOpenChat}
            onMouseEnter={() => !isChatOpen && setIsHovered(true)}
            onMouseLeave={() => !isChatOpen && setIsHovered(true)}
          >
            {animationData && (
              <Lottie
                animationData={animationData}
                loop={true}
                style={{ width: "100%", height: "100%" }}
                className="rounded-full"
              />
            )}
          </motion.button>
        </motion.div>
      )}
    </>
  );
}
