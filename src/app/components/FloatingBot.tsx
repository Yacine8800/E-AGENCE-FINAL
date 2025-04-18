"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
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
  const clientId = "AQ123456789";

  useEffect(() => {
    // Import the animation data dynamically
    import("../../../public/bot-anime-flow.json").then((data) => {
      setAnimationData(data.default);
    });
  }, []);

  // Logique de récupération du token MQTT

  const getTokenForMqtt = async () => {
    try {
      // Appel API pour récupérer le token
      const response = await axios.post(`${API_BOT_CIE}api/v1/getToken`, {
        client_id: clientId,
        nom: "Anonyme",
        prenom: "Anonyme",
      });

      const data = response.data;

      // Stocker le token MQTT
      if (data.token) {
        setToken(data.token);
        setMqttToken(decodeTokens(data.token));

        await axios.post(
          `${API_BOT_CIE_SUBSCRIBE}user-${mqttToken?.user_id}-messages`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${data.token}`,
            },
          }
        );
      } else {
        throw new Error("Le token n'a pas été trouvé dans la réponse");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du token MQTT:", error);
    }
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
    getTokenForMqtt();
  };

  return (
    <>
      <AnimatePresence mode="sync">
        {isHovered && !isChatOpen && (
          <SimpleMessage onClose={() => setIsHovered(false)} />
        )}
        {isChatOpen && (
          <ChatBot
            onClose={() => setIsChatOpen(false)}
            mqttToken={mqttToken}
            clientId={clientId}
            token={token}
          />
        )}
      </AnimatePresence>

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
    </>
  );
}
