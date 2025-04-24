"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, FormEvent } from "react";
import FormComponent from "./FormComponent";
import MarkdownRenderer from "./MarkdownRenderer";
import InteractiveListComponent from "./InteractiveListComponent";
import logger from "../utils/logger";
import {
  generateSecureId,
  secureJSONStringify,
  sanitizeString,
} from "../utils/securityUtils";
import {
  API_BOT_CIE,
  API_BOT_CIE_INBOUND,
  API_BOT_CIE_OUTBOUND,
  API_BOT_CIE_WEBHOOK,
} from "@/config/constants";
import axios from "axios";
import { useMqttClient } from "../hooks/useMqttClient";
import { decodeTokens } from "@/utils/tokendecod";

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

interface ChatBotProps {
  onClose: () => void;
  mqttToken: MqttTokenType | null;
  clientId?: string;
  token?: string | null;
}

interface MessageContent {
  type:
    | "text"
    | "image"
    | "audio"
    | "pdf"
    | "doc"
    | "location"
    | "button"
    | "list"
    | "form";
  content: string;
  duration?: number;
  isPlaying?: boolean;
  progress?: number;
  currentTime?: number;
  name?: string;
  size?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  error?: boolean;

  // Pour le texte formate
  text?: string;  // Texte formate avec markdown
  
  // Pour les messages interactifs
  buttons?: {
    id: string;
    title: string;
    type: string;
  }[];

  // Pour les listes interactives
  listItems?: {
    id: string;
    title: string;
    description?: string;
  }[];
  selector?: "unique" | "multiple";  // Type de selection (radio ou checkbox)

  // Pour les formulaires
  formFields?: {
    id: string;
    name: string;
    required: boolean;
    value: string;
    type: "number" | "string" | "Date" | "Datetime" | "Image";
  }[];
  typeRequest?: string; // mutation, branchement, etc.
}

interface Message {
  id: string;
  content: MessageContent[];
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
  error?: string;
  status?: "sent" | "delivered" | "read"; // Statut du message pour les checks
}

const optionColors = {
  simulateurs: "#00DC82",
  demandes: "#FF3B30",
  reclamations: "#FF453A",
  agences: "#0A84FF",
  depannage: "#FF9F0A",
  infos: "#64D2FF",
};

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="#FFD700"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
    />
  </svg>
);

const ExpandIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const CollapseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6"
  >
    <polyline points="9 3 3 3 3 9" />

    <polyline points="15 21 21 21 21 15" />

    <line x1="3" y1="3" x2="10" y2="10" />

    <line x1="21" y1="21" x2="14" y2="14" />
  </svg>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export default function ChatBot({
  onClose,
  mqttToken,
  clientId,
  token,
}: ChatBotProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<MessageContent[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingInterval, setRecordingInterval] =
    useState<NodeJS.Timeout | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [imageCarousel, setImageCarousel] = useState<{
    isOpen: boolean;
    messageId: string;
    startIndex: number;
    images: MessageContent[];
  }>({ isOpen: false, messageId: "", startIndex: 0, images: [] });

  // État pour suivre si le bot est en train de répondre
  const [waitingForBotResponse, setWaitingForBotResponse] = useState(false);
  // État pour suivre la connexion MQTT
  const [mqttConnected, setMqttConnected] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [audioElements, setAudioElements] = useState<{
    [key: string]: HTMLAudioElement;
  }>({});

  // Get the user_id directly from the token
  const userId = mqttToken?.user_id || null;

  const tokenGil =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiIxMDIzNTI2OTc2MTYzMTMyNjQ5MDIiLCJub20iOiJEU1REIiwicHJlbm9tIjoiQ0VSSUEiLCJjZXJ0aWZpZWRfYWNjb3VudCI6ZmFsc2UsInV1aWRfbGxtIjoiNjM5ODBlNWYtM2FkZS00NTUzLWFiY2MtNjAyZmJjYjA3NzZhIiwidXNlcl9pZCI6MTcsImFib25uZW1lbnRzIjp7InBvc3RwYXllcyI6W10sInByZXBheWVzIjpbXX0sInBob3RvUHJvZmlsIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSVNJTTZzc0pyVXB5TFk0S0VzRHBKZFJfLW1iM0JaUTRGWE90d1RxMTFvME5jZzVBPXM5Ni1jIiwiaWF0IjoxNzQzNTg4ODcwfQ.9acCNJBdzoj6eEAN1Pz-2PU7GZinbqz1IuQ1cOZRG-4";

  const decodeGil = decodeTokens(tokenGil);

  const { client_id: client_Gil, user_id: user_Gil } = decodeGil;

  const client_id = mqttToken?.client_id;

  const theme = {
    bg: isDarkMode ? "bg-[#1E1E1E]" : "bg-white",
    bgSecondary: isDarkMode ? "bg-[#18181B]" : "bg-white",
    bgHover: isDarkMode ? "hover:bg-[#27272A]" : "hover:bg-gray-100",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-300" : "text-gray-600",
    border: isDarkMode ? "border-gray-700" : "border-gray-200",
    messageBg: isDarkMode
      ? "from-[#323232] to-[#272727]"
      : "from-gray-50 to-white",
    messageText: isDarkMode ? "text-gray-100" : "text-gray-900",
    iconColor: isDarkMode ? "text-gray-300" : "text-gray-600",
    iconHover: isDarkMode ? "hover:text-white" : "hover:text-gray-900",
    buttonBg: isDarkMode ? "bg-[#27272A]" : "bg-gray-100",
    buttonHover: isDarkMode ? "hover:bg-[#323232]" : "hover:bg-gray-200",
    inputBg: isDarkMode ? "bg-[#18181B]" : "bg-white",
    inputText: isDarkMode ? "text-white" : "text-gray-900",
    inputPlaceholder: isDarkMode
      ? "placeholder-gray-400"
      : "placeholder-gray-500",
    shadow: isDarkMode ? "shadow-black/10" : "shadow-gray-200",
    transition: "transition-colors duration-200",
    expandButton: isDarkMode
      ? "text-gray-300 hover:text-white hover:bg-[#27272A]"
      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
    closeButton: isDarkMode
      ? "text-gray-300 hover:text-white hover:bg-[#27272A]"
      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("chatbot-theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  // Mise à jour du hook pour obtenir l'état de connexion MQTT
  const { client, connected } = useMqttClient(
    `user-${userId}-messages`,
    (payload) => {
      // Désactiver l'indicateur d'attente de réponse quand on reçoit un message
      setWaitingForBotResponse(false);
      console.log("📥 Nouveau message MQTT reçu:", payload);

      const data = payload?.data;
      if (!data) return;

      // On traite les différents types de messages
      const botMessage = data.response?.message;
      const botText = botMessage?.text;

      // Si on a un message texte simple (avec prise en charge du Markdown)
      if (botText && botMessage?.type === "TEXT") {
        // Créer un nouvel objet message pour la réponse du bot
        const newMessage: Message = {
          id: `${data.message_id}-bot`,
          isUser: false,
          timestamp: new Date(),
          content: [{ 
            type: "text", 
            content: botText 
          }],
        };

        addMessageToState(newMessage);
      }
      
      // Si on a un message de type liste interactive (INTERACTIVE_LIST)
      else if (botMessage?.type === "INTERACTIVE_LIST" && Array.isArray(botMessage.list)) {
        // Déterminer le type de sélecteur (unique ou multiple) selon la propriété selector
        const selector = botMessage.selector === "multiple" ? "multiple" : "unique";
        
        // Créer un nouvel objet message pour la réponse avec liste interactive
        const listMessage: Message = {
          id: `${data.message_id}-list`,
          isUser: false,
          timestamp: new Date(),
          content: [{
            type: "list",
            content: "Liste de sélection",
            text: botMessage.text || "", // Texte explicatif formaté en Markdown
            listItems: botMessage.list.map(item => ({
              id: item.id || generateSecureId(),
              title: item.title || "",
              description: item.description || ""
            })),
            selector: selector
          }],
        };
        
        addMessageToState(listMessage);
      }

      // Si on a un message avec des boutons interactifs
      else if (
        botText &&
        botMessage?.type === "INTERACTIVE_BUTTON" &&
        botMessage?.buttons
      ) {
        // Créer un nouvel objet message pour la réponse interactive avec boutons
        const newMessage: Message = {
          id: `${data.message_id}-bot`,
          isUser: false,
          timestamp: new Date(),
          content: [
            { type: "text", content: botText },
            {
              type: "button",
              content: "",
              buttons: botMessage.buttons.map((btn) => ({
                id: btn.id || generateSecureId(),
                title: btn.title || "",
                type: btn.type || "INTERACTIVE_BUTTON_REPLY",
              })),
            },
          ],
        };

        addMessageToState(newMessage);
      }
      
      // Si on a un message de type formulaire (FORMS)
      else if (botMessage?.type === "FORMS" && Array.isArray(botMessage.fields)) {
        // Créer un nouvel objet message pour le formulaire
        const formMessage: Message = {
          id: `${data.message_id}-form`,
          isUser: false,
          timestamp: new Date(),
          content: [{
            type: "form",
            content: "Formulaire",
            typeRequest: botMessage.type_request || "",
            formFields: botMessage.fields.map(field => ({
              id: field.id,
              name: field.name,
              required: field.required,
              value: field.value || "",
              type: field.type
            }))
          }]
        };
        
        addMessageToState(formMessage);
      }

      // Si on a un message de type INTERACTIVE_LIST_REPLY
      else if (
        data.message?.type === "INTERACTIVE_LIST_REPLY" &&
        data.message.list_selected
      ) {
        // Créer un nouvel objet message pour la réponse avec liste interactive
        const listMessage: Message = {
          id: `${data.message_id || generateSecureId()}-list`,
          isUser: false,
          timestamp: new Date(),
          content: [
            {
              type: "list",
              content: "Liste de sélection",
              listItems: Array.isArray(data.message.list_selected)
                ? data.message.list_selected.map((item) => ({
                    id: item.id || generateSecureId(),
                    title: item.title || "",
                    description: item.description || "",
                  }))
                : [],
            },
          ],
        };

        addMessageToState(listMessage);
      }

      // Fonction utilitaire pour ajouter un message à l'état avec vérification des doublons
      function addMessageToState(message: Message) {
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          // Vérifie si ce message n'existe pas déjà
          if (!existingIds.has(message.id)) {
            return [...prev, message];
          }
          return prev;
        });
      }
    }
  );

  // Gérer le clic sur un bouton interactif
  const handleButtonClick = async (
    messageId: string,
    contentIndex: number,
    button: { id: string; title: string; type: string }
  ) => {
    try {
      // Préparer les données à envoyer au format demandé
      const buttonData = {
        UrlWebhook: API_BOT_CIE_WEBHOOK,
        from: client_id,
        integrationType: "E-Agence",
        message: {
          type: "INTERACTIVE_BUTTON_REPLY",

          title: button.title,
        },
        messageId: messageId || generateSecureId(),
        receivedAt: new Date().toISOString(),
      };

      console.log("Envoi de la réponse bouton:", buttonData);

      // Envoyer la réponse via HTTP avec le token d'autorisation
      const response = await axios.post(API_BOT_CIE_INBOUND, buttonData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("✅ Réponse bouton envoyée avec succès:", response.data);

      // Créer un message utilisateur pour montrer la sélection
      const userMessage: Message = {
        id: generateSecureId(),
        isUser: true,
        timestamp: new Date(),
        content: [
          {
            type: "text",
            content: button.title,
          },
        ],
        status: "sent",
      };

      // Ajouter le message utilisateur
      setMessages((prev) => [...prev, userMessage]);

      // Désactiver les boutons dans le message original
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        const messageIndex = newMessages.findIndex((m) => m.id === messageId);
        if (messageIndex !== -1) {
          // Supprimer le contenu de type bouton
          newMessages[messageIndex].content = newMessages[
            messageIndex
          ].content.filter(
            (c, i) => !(i === contentIndex && c.type === "button")
          );
        }
        return newMessages;
      });

      // Indiquer qu'on attend une réponse du bot
      setWaitingForBotResponse(true);
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi de la réponse bouton:", error);
    }
  };

  // Gérer la soumission d'un formulaire
  const handleFormSubmit = async (messageId: string, contentIndex: number, formData: any) => {
    // Trouver le message contenant le formulaire
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;
    
    const message = messages[messageIndex];
    const content = message.content[contentIndex];
    
    if (content.type !== "form" || !content.formFields) return;
    
    try {
      // Préparer les données à envoyer
      const formSubmitData = {
        UrlWebhook: API_BOT_CIE_WEBHOOK,
        from: client_id || "AQ123456789",
        integrationType: "E-Agence",
        message: {
          type: "REPLY_FORMS_REQUEST",
          type_request: content.typeRequest,
          response: formData
        },
        messageId: generateSecureId(),
        receivedAt: new Date().toISOString()
      };
      
      console.log("Envoi du formulaire:", formSubmitData);
      
      // Envoyer la soumission du formulaire via HTTP avec le token d'autorisation
      const response = await axios.post(API_BOT_CIE_INBOUND, formSubmitData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("✅ Formulaire envoyé avec succès:", response.data);
      
      // Le formulaire reste visible en mode réduit avec son propre récapitulatif
      // Pas besoin d'ajouter un message séparé à la conversation
      
      // Ne pas supprimer le formulaire, mais marquer qu'il a été soumis
      // Le FormComponent s'occupera d'afficher le formulaire en mode réduit
      // avec le récapitulatif des données
      // Cette partie est gérée par les états internes du FormComponent
      
      // Indiquer qu'on attend une réponse du bot
      setWaitingForBotResponse(true);
      
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi du formulaire:", error);
    }
  };
  
  // Gérer la confirmation d'une liste
  const handleListConfirmation = async (
    messageId: string,
    contentIndex: number,
    selectedItems: Array<{ id: string; title: string; description?: string }>
  ) => {
    // Trouver le message contenant la liste
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    const message = messages[messageIndex];
    const content = message.content[contentIndex];

    if (content.type !== "list" || !content.listItems) return;

    try {
      // Préparer les données à envoyer au format exact du payload demandé
      const listData = {
        "from": client_id || "AQ123456789",
        "integrationType": "WHATSAPP",
        "receivedAt": new Date().toISOString(),
        "messageId": generateSecureId(),
        "UrlWebhook": API_BOT_CIE_WEBHOOK,
        "message": {
          "type": "INTERACTIVE_LIST_REPLY",
          "list_selected": selectedItems.map(item => ({
            "id": item.id,
            "title": item.title
          }))
        }
      };

      console.log("Envoi de la confirmation de liste:", listData);

      // Envoyer la confirmation via HTTP avec le token d'autorisation
      const response = await axios.post(API_BOT_CIE_INBOUND, listData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(
        "✅ Confirmation de liste envoyée avec succès:",
        response.data
      );

      // Enregistrer l'ID de message pour éviter la duplication
      // L'API va nous renvoyer une réponse, donc nous n'ajoutons pas 
      // manuellement un message de confirmation pour éviter la duplication
      const messageId = generateSecureId();
      console.log(`Message confirmation envoyé avec ID: ${messageId}`);
      
      // Nous allons laisser l'API renvoyer la confirmation
      // Le système MQTT va gérer l'affichage du message

      // Supprimer le bouton de confirmation
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        if (newMessages[messageIndex]?.content[contentIndex]) {
          // Supprimer le contenu complet de type liste
          newMessages[messageIndex].content = newMessages[
            messageIndex
          ].content.filter((c, i) => i !== contentIndex);
        }
        return newMessages;
      });

      // Indiquer qu'on attend une réponse du bot
      setWaitingForBotResponse(true);
    } catch (error) {
      console.error(
        "❌ Erreur lors de l'envoi de la confirmation de liste:",
        error
      );
    }
  };

  useEffect(() => {
    if (typeof connected !== "undefined") {
      setMqttConnected(connected);
      console.log("MQTT connection status:", connected);
    }
  }, [connected]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("chatbot-theme", newTheme ? "dark" : "light");
  };

  const currentColor = selectedOption
    ? optionColors[selectedOption as keyof typeof optionColors]
    : "#FF6B00";

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fonction pour tester si un audio est lisible
  const testAudioPlayability = (audioUrl: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const audio = new Audio();

      const onCanPlay = () => {
        cleanup();
        resolve(true);
      };

      const onError = () => {
        cleanup();
        resolve(false);
      };

      const cleanup = () => {
        audio.removeEventListener("canplaythrough", onCanPlay);
        audio.removeEventListener("error", onError);
        audio.src = "";
      };

      audio.addEventListener("canplaythrough", onCanPlay, { once: true });
      audio.addEventListener("error", onError, { once: true });

      // Définir une durée maximale pour le test
      setTimeout(() => {
        cleanup();
        resolve(false);
      }, 2000);

      audio.src = audioUrl;
      audio.load();
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Tester différents formats pour trouver le plus compatible
      let mediaRecorder;
      let mimeType = "";

      // Liste des formats par ordre de préférence
      const formats = [
        "audio/mp3",
        "audio/mp4",
        "audio/aac",
        "audio/mpeg",
        "audio/webm;codecs=opus",
        "audio/ogg;codecs=opus",
      ];

      // Trouver le premier format supporté
      for (const format of formats) {
        if (MediaRecorder.isTypeSupported(format)) {
          mimeType = format;
          break;
        }
      }

      // Créer le MediaRecorder avec le format choisi ou sans spécifier de format
      if (mimeType) {
        mediaRecorder = new MediaRecorder(stream, { mimeType });
      } else {
        mediaRecorder = new MediaRecorder(stream);
      }

      console.log("Format d'enregistrement utilisé:", mediaRecorder.mimeType);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Démarrer l'enregistrement avec des chunks plus fréquents
      mediaRecorder.start(100); // Créer un chunk toutes les 100ms
      setIsRecording(true);

      const interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
      setRecordingInterval(interval);
    } catch (error) {
      console.error("Erreur microphone:", error);
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current || !isRecording) return;
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream
      .getTracks()
      .forEach((track) => track.stop());

    if (recordingInterval) {
      clearInterval(recordingInterval);
      setRecordingInterval(null);
    }

    setIsRecording(false);
    setRecordingDuration(0);

    // Créer un blob avec le format d'enregistrement utilisé
    const mimeType = mediaRecorderRef.current?.mimeType || "audio/webm";
    const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
    const audioUrl = URL.createObjectURL(audioBlob);

    // Tester si l'audio est lisible
    const isPlayable = await testAudioPlayability(audioUrl);

    console.log(`Audio enregistré en ${mimeType}, lisible: ${isPlayable}`);

    // Ajouter le fichier audio aux fichiers sélectionnés
    setSelectedFiles((prev) => [
      ...prev,
      {
        type: "audio",
        content: audioUrl,
        duration: recordingDuration,
        isPlaying: false,
        name: `Enregistrement_${new Date()
          .toISOString()
          .substring(0, 19)
          .replace(/:/g, "-")}.${mimeType.split("/")[1].split(";")[0]}`,
        error: !isPlayable,
      },
    ]);

    audioChunksRef.current = [];
  };

  const handleRecordClick = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const sessionId = useRef(`eagence-chat-${Date.now()}`).current;

  const handleSendMessage = async () => {
    // Vérifier si le champ n'est pas vide
    if (!inputValue.trim()) {
      console.log("Le message est vide");
      return;
    }

    try {
      const messageId = Date.now().toString();
      sentMessageIds.add(messageId);

      const outboundPayload = {
        from: client_id,
        integrationType: "E-Agence",
        receivedAt: new Date().toISOString(),
        messageId: messageId,
        UrlWebhook: API_BOT_CIE_WEBHOOK, // Fait le lien avec votre webhook
        message: {
          type: "TEXT",
          text: inputValue.trim(),
        },
      };

      const userMessage: Message = {
        id: messageId,
        isUser: true,
        timestamp: new Date(),
        content: [
          {
            type: "text",
            content: outboundPayload.message.text,
          },
        ],
      };

      // Affiche le message utilisateur tout de suite
      setMessages((prev) => [...prev, userMessage]);

      // Activer l'indicateur d'attente de réponse
      setWaitingForBotResponse(true);

      // Envoi HTTP vers votre API Inbound
      axios
        .post(API_BOT_CIE_INBOUND, outboundPayload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        .catch((error) => {
          console.error("Erreur lors de l'envoi (Inbound):", error);
        });

      // Publication MQTT sur le topic d'envoi
      if (client && client.connected) {
        try {
          client.publish("outbound-messages", JSON.stringify(outboundPayload));
          console.log(
            "Message MQTT publié sur outbound-messages:",
            outboundPayload
          );
        } catch (mqttError) {
          console.error("Erreur lors de la publication MQTT:", mqttError);
        }
      } else {
        console.warn(
          "Client MQTT non connecté, impossible de publier le message"
        );
      }

      // 7) Vider le champ input
      setInputValue("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };

  // Pour garder une trace des messages envoyés pour pouvoir les filtrer en réception
  const sentMessageIds = useRef<Set<string>>(new Set()).current;

  const toggleAudioPlayback = (messageIndex: number, contentIndex: number) => {
    const message = messages[messageIndex];
    const content = message.content[contentIndex];
    if (content.type !== "audio") return;

    // Vérifier d'abord si l'URL audio est valide
    if (!content.content || content.error === true) {
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[messageIndex].content[contentIndex].error = true;
        return newMessages;
      });
      return;
    }

    const audioKey = `${messageIndex}-${contentIndex}`;
    let audio = audioElements[audioKey];

    if (!audio) {
      try {
        // Créer l'élément audio dans un bloc try-catch
        audio = new Audio();

        audio.addEventListener(
          "error",
          (e) => {
            console.error("Erreur de chargement audio:", e, e.target);
            // Afficher plus de détails sur l'erreur
            const audioElement = e.target as HTMLAudioElement;
            console.error("Source audio:", audioElement.src);
            console.error(
              "État de l'audio:",
              audioElement.error?.code,
              audioElement.error?.message
            );

            // Mettre à jour le message pour montrer l'erreur
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[messageIndex].content[contentIndex].error = true;
              return newMessages;
            });
          },
          { once: true }
        ); // L'événement se déclenchera une seule fois

        audio.addEventListener(
          "loadedmetadata",
          () => {
            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[messageIndex].content[contentIndex].duration =
                audio.duration;
              newMessages[messageIndex].content[contentIndex].error = false;
              return newMessages;
            });
          },
          { once: true }
        ); // L'événement se déclenchera une seule fois

        audio.addEventListener("timeupdate", () => {
          setMessages((prev) => {
            const newMessages = [...prev];
            const c = newMessages[messageIndex].content[contentIndex];
            if (c && audio) {
              c.currentTime = audio.currentTime;
              c.progress = (audio.currentTime / audio.duration) * 100;
            }
            return newMessages;
          });
        });

        audio.addEventListener(
          "ended",
          () => {
            setMessages((prev) => {
              const newMessages = [...prev];
              if (newMessages[messageIndex]?.content[contentIndex]) {
                newMessages[messageIndex].content[contentIndex].isPlaying =
                  false;
              }
              return newMessages;
            });
          },
          { once: true }
        ); // L'événement se déclenchera une seule fois

        // Stocker l'élément audio après avoir configuré tous les événements
        setAudioElements((prev) => ({ ...prev, [audioKey]: audio }));

        // Définir la source uniquement après avoir configuré tous les événements
        audio.src = content.content;
        // Précharger les métadonnées seulement (pas tout le fichier)
        audio.preload = "metadata";
      } catch (error) {
        console.error("Erreur lors de la création de l'élément audio:", error);
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[messageIndex].content[contentIndex].error = true;
          return newMessages;
        });
        return; // Ne pas continuer si la création a échoué
      }
    }

    // Vérifier si l'audio existe et n'est pas en erreur avant de tenter de le lire
    if (audio && !content.error) {
      if (content.isPlaying) {
        try {
          audio.pause();
        } catch (error) {
          console.error("Erreur lors de la pause audio:", error);
        }
      } else {
        try {
          // Mettre en pause tous les autres audios
          Object.values(audioElements).forEach((a) => {
            try {
              a.pause();
            } catch (pauseError) {
              console.error("Erreur lors de la pause d'un audio:", pauseError);
            }
          });

          // Mettre à jour l'état de tous les autres audios
          messages.forEach((msg, msgIdx) => {
            msg.content.forEach((cnt, cntIdx) => {
              if (cnt.type === "audio" && cnt.isPlaying) {
                setMessages((prev) => {
                  const newMessages = [...prev];
                  if (newMessages[msgIdx]?.content[cntIdx]) {
                    newMessages[msgIdx].content[cntIdx].isPlaying = false;
                  }
                  return newMessages;
                });
              }
            });
          });

          // Tenter de lire l'audio actuel
          const playPromise = audio.play();

          // La méthode play() renvoie une promesse - nous devons la gérer
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.error("Erreur lors de la lecture audio:", error);
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[messageIndex].content[contentIndex].error = true;
                newMessages[messageIndex].content[contentIndex].isPlaying =
                  false;
                return newMessages;
              });
            });
          }
        } catch (error) {
          console.error("Erreur lors de la lecture audio:", error);
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[messageIndex].content[contentIndex].error = true;
            return newMessages;
          });
          return; // Ne pas continuer si la lecture a échoué
        }
      }

      // Mettre à jour l'état de lecture seulement si tout s'est bien passé
      setMessages((prev) => {
        const newMessages = [...prev];
        if (newMessages[messageIndex]?.content[contentIndex]) {
          newMessages[messageIndex].content[contentIndex].isPlaying =
            !content.isPlaying;
        }
        return newMessages;
      });
    } else if (!content.error) {
      // Si l'audio n'existe pas encore mais n'est pas en erreur, marquer comme erreur
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[messageIndex].content[contentIndex].error = true;
        return newMessages;
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Fonction pour ouvrir le carrousel d'images
  const handleImageClick = (messageId: string, contentIndex: number) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (!message) return;

    // Récupérer toutes les images du message
    const images = message.content.filter((item) => item.type === "image");
    if (images.length === 0) return;

    // Trouver l'index dans le tableau filtré des images
    const imageIndex = message.content
      .slice(0, contentIndex)
      .filter((item) => item.type === "image").length;

    // Ouvrir le carrousel avec l'image cliquée comme point de départ
    setImageCarousel({
      isOpen: true,
      messageId,
      startIndex: imageIndex,
      images,
    });
  };

  // Fonction pour fermer le carrousel
  const closeImageCarousel = () => {
    setImageCarousel({
      isOpen: false,
      messageId: "",
      startIndex: 0,
      images: [],
    });
  };

  // Navigation dans le carrousel
  const navigateCarousel = (direction: "next" | "prev") => {
    setImageCarousel((prev) => {
      const newIndex =
        direction === "next"
          ? (prev.startIndex + 1) % prev.images.length
          : (prev.startIndex - 1 + prev.images.length) % prev.images.length;

      return {
        ...prev,
        startIndex: newIndex,
      };
    });
  };

  useEffect(() => {
    return () => {
      Object.values(audioElements).forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
    };
  }, [audioElements]);

  // Fermer le carrousel avec la touche Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && imageCarousel.isOpen) {
        closeImageCarousel();
      } else if (e.key === "ArrowRight" && imageCarousel.isOpen) {
        navigateCarousel("next");
      } else if (e.key === "ArrowLeft" && imageCarousel.isOpen) {
        navigateCarousel("prev");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [imageCarousel]);

  const removeAttachment = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const imageFiles = selectedFiles.filter((file) => file.type === "image");
  const otherFiles = selectedFiles.filter((file) => file.type !== "image");

  const handleFileSelect = (type: "photo" | "file") => {
    const ref = type === "photo" ? imageInputRef.current : fileInputRef.current;
    if (ref) ref.click();
    setShowAttachMenu(false);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: "image" | "file"
  ) => {
    const files = e.target.files;
    if (!files?.length) return;

    if (fileType === "image") {
      // Traitement multiple pour les images
      const newFiles = Array.from(files).map((file) => ({
        type: "image" as const,
        content: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      }));
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    } else {
      // Traitement pour les autres types de fichiers
      const file = files[0];
      const type =
        file.name.split(".").pop()?.toLowerCase() === "pdf" ? "pdf" : "doc";
      setSelectedFiles((prev) => [
        ...prev,
        { type, content: file.name, name: file.name, size: file.size },
      ]);
    }
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      alert(
        "La géolocalisation n'est pas prise en charge par votre navigateur."
      );
      setShowAttachMenu(false);
      return;
    }

    // Ajouter un marqueur temporaire de chargement
    const loadingId = Date.now();
    setSelectedFiles((prev) => [
      ...prev,
      {
        type: "location",
        content: "Récupération de votre position...",
        address: "Récupération en cours...",
        loadingId, // Identifiant unique pour retrouver ce marqueur
      },
    ]);

    // Options de géolocalisation
    const options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };

    // Mise à jour de la position
    const updateLocationFile = (latitude: number, longitude: number) => {
      const address = `Latitude: ${latitude.toFixed(
        6
      )}, Longitude: ${longitude.toFixed(6)}`;
      setSelectedFiles((prev) =>
        prev.map((file) =>
          "loadingId" in file && file.loadingId === loadingId
            ? {
                type: "location",
                content: `${latitude},${longitude}`,
                address,
                latitude,
                longitude,
              }
            : file
        )
      );
    };

    // Gestion des erreurs
    const handleGeoError = (error: GeolocationPositionError) => {
      console.error("Erreur de géolocalisation:", error);

      // Supprimer le message de chargement
      setSelectedFiles((prev) =>
        prev.filter(
          (file) => !("loadingId" in file && file.loadingId === loadingId)
        )
      );

      // Message d'erreur selon le code
      const errorMessages = {
        [GeolocationPositionError.PERMISSION_DENIED]:
          "Vous avez refusé la demande de géolocalisation.",
        [GeolocationPositionError.POSITION_UNAVAILABLE]:
          "Les informations de localisation sont indisponibles.",
        [GeolocationPositionError.TIMEOUT]:
          "La demande de localisation a expiré.",
      };

      alert(
        `Impossible d'accéder à votre localisation. ${
          errorMessages[error.code] || ""
        }`
      );
    };

    // Demander la position
    navigator.geolocation.getCurrentPosition(
      (position) =>
        updateLocationFile(position.coords.latitude, position.coords.longitude),
      handleGeoError,
      options
    );

    setShowAttachMenu(false);
  };

  return (
    <>
      {/* Carrousel d'images */}
      {imageCarousel.isOpen && (
        <div className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center">
          <div className="absolute top-4 right-4 z-[10000]">
            <button
              onClick={closeImageCarousel}
              className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke={isDarkMode ? "#9CA3AF" : "#4B5563"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="relative w-full max-w-3xl mx-auto z-[10000]">
            {/* Image principale */}
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={imageCarousel.images[imageCarousel.startIndex].content}
                alt={`Image ${imageCarousel.startIndex + 1}`}
                width={1200}
                height={800}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>

            {/* Navigation */}
            <div className="absolute inset-y-0 left-4 flex items-center z-[10000]">
              <button
                onClick={() => navigateCarousel("prev")}
                className="p-2 bg-gray-800/50 rounded-full text-white hover:bg-gray-700 transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            </div>

            <div className="absolute inset-y-0 right-4 flex items-center">
              <button
                onClick={() => navigateCarousel("next")}
                className="p-2 bg-gray-800/50 rounded-full text-white hover:bg-gray-700 transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Indicateur de position */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {imageCarousel.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setImageCarousel((prev) => ({ ...prev, startIndex: index }))
                  }
                  className={`w-2.5 h-2.5 rounded-full ${
                    index === imageCarousel.startIndex
                      ? "bg-white"
                      : "bg-gray-500"
                  }`}
                  aria-label={`Image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Miniatures d'images */}
          {imageCarousel.images.length > 1 && (
            <div className="absolute bottom-12 left-0 right-0">
              <div className="flex justify-center gap-2 p-2 max-w-[90%] mx-auto overflow-x-auto">
                {imageCarousel.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setImageCarousel((prev) => ({
                        ...prev,
                        startIndex: index,
                      }))
                    }
                    className={`
                      w-16 h-16 flex-shrink-0 rounded overflow-hidden 
                      ${
                        index === imageCarousel.startIndex
                          ? "ring-2 ring-white"
                          : "opacity-70"
                      }
                    `}
                  >
                    <Image
                      src={image.content}
                      alt={`Thumbnail ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`
          fixed z-50 
          ${
            isExpanded
              ? "inset-4 sm:inset-8 md:inset-10 lg:inset-20 z-[10000]"
              : "bottom-20 right-4 sm:right-8 w-[300px] sm:w-[400px] z-[10000]"
          } 
          ${theme.bg} 
          rounded-3xl 
          shadow-2xl 
          overflow-hidden 
          transition-all 
          duration-300
          flex flex-col
        `}
        style={{ maxHeight: isExpanded ? "calc(100vh - 2rem)" : "auto" }}
      >
        <div
          className={`flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b ${theme.border} flex-shrink-0`}
        >
          <div className="flex items-center gap-3">
            <Image
              src="/chat/bot.png"
              alt="Assistant"
              width={35}
              height={35}
              className="rounded-full"
            />
            <div>
              <h2 className={`${theme.text} font-medium`}>
                Assistant E-Agence
              </h2>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full ${
                    mqttConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <p className={`${theme.textSecondary} text-sm`}>
                  {mqttConnected ? "En ligne" : "Hors ligne"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleExpand}
              className={`p-2 ${theme.expandButton} rounded-full`}
            >
              {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
            </button>

            <button
              onClick={toggleTheme}
              className={`
              p-2 
              ${theme.buttonBg} 
              ${theme.buttonHover} 
              ${theme.text} 
              rounded-full 
              ${theme.transition}
            `}
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>

            <button
              onClick={onClose}
              className={`p-2 ${theme.closeButton} rounded-full transition-colors`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke={isDarkMode ? "#9CA3AF" : "#4B5563"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <div
          ref={chatContainerRef}
          className={`
          relative 
          px-4 sm:px-6 
          py-3 sm:py-4 
          min-h-[250px] 
          ${
            isExpanded
              ? "flex-grow overflow-y-auto"
              : "max-h-[400px] sm:max-h-[500px] overflow-y-auto"
          } 
          ${theme.bg}
          ${isExpanded ? "mb-0" : ""}
        `}
          style={{
            background: isDarkMode
              ? "linear-gradient(180deg, #2C2C2C 0%, #252525 100%)"
              : "linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)",
          }}
        >
          {!selectedOption && messages.length === 0 && (
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="flex justify-center gap-2 w-full flex-wrap">
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`
                    flex items-center gap-2
                    ${
                      isDarkMode
                        ? "bg-[#18181B] hover:bg-[#27272A]"
                        : "bg-white hover:bg-gray-50"
                    }
                    ${theme.text} 
                    px-4 py-2 
                    rounded-full 
                    text-sm 
                    group
                  `}
                    onClick={() => setSelectedOption("simulateurs")}
                  >
                    <div className="text-[#00DC82] w-5 h-5 flex items-center justify-center">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M3 3h18v18H3V3z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 7h10v10H7V7z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="group-hover:text-[#00DC82] transition-colors">
                      Simulateurs
                    </span>
                  </motion.button>

                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`
                    flex items-center gap-2
                    ${
                      isDarkMode
                        ? "bg-[#18181B] hover:bg-[#27272A]"
                        : "bg-white hover:bg-gray-50"
                    }
                    ${theme.text} 
                    px-4 py-2 
                    rounded-full 
                    text-sm 
                    group
                  `}
                    onClick={() => setSelectedOption("demandes")}
                  >
                    <div className="text-[#FF3B30] w-5 h-5 flex items-center justify-center">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="group-hover:text-[#FF3B30] transition-colors">
                      Demandes
                    </span>
                  </motion.button>

                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`
                    flex items-center gap-2
                    ${
                      isDarkMode
                        ? "bg-[#18181B] hover:bg-[#27272A]"
                        : "bg-white hover:bg-gray-50"
                    }
                    ${theme.text} 
                    px-4 py-2 
                    rounded-full 
                    text-sm 
                    group
                  `}
                    onClick={() => setSelectedOption("reclamations")}
                  >
                    <div className="text-[#FF453A] w-5 h-5 flex items-center justify-center">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="group-hover:text-[#FF453A] transition-colors">
                      Réclamations
                    </span>
                  </motion.button>
                </div>

                <div className="flex justify-center gap-2 w-full flex-wrap">
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`
                    flex items-center gap-2
                    ${
                      isDarkMode
                        ? "bg-[#18181B] hover:bg-[#27272A]"
                        : "bg-white hover:bg-gray-50"
                    }
                    ${theme.text} 
                    px-4 py-2 
                    rounded-full 
                    text-sm 
                    group
                  `}
                    onClick={() => setSelectedOption("agences")}
                  >
                    <div className="text-[#0A84FF] w-5 h-5 flex items-center justify-center">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="group-hover:text-[#0A84FF] transition-colors">
                      Nos agences
                    </span>
                  </motion.button>

                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`
                    flex items-center gap-2
                    ${
                      isDarkMode
                        ? "bg-[#18181B] hover:bg-[#27272A]"
                        : "bg-white hover:bg-gray-50"
                    }
                    ${theme.text} 
                    px-4 py-2 
                    rounded-full 
                    text-sm 
                    group
                  `}
                    onClick={() => setSelectedOption("depannage")}
                  >
                    <div className="text-[#FF9F0A] w-5 h-5 flex items-center justify-center">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="group-hover:text-[#FF9F0A] transition-colors">
                      Dépannage
                    </span>
                  </motion.button>

                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`
                    flex items-center gap-2
                    ${
                      isDarkMode
                        ? "bg-[#18181B] hover:bg-[#27272A]"
                        : "bg-white hover:bg-gray-50"
                    }
                    ${theme.text} 
                    px-4 py-2 
                    rounded-full 
                    text-sm 
                    group
                  `}
                    onClick={() => setSelectedOption("infos")}
                  >
                    <div className="text-[#64D2FF] w-5 h-5 flex items-center justify-center">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="group-hover:text-[#64D2FF] transition-colors">
                      Infos
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {selectedOption && (
              <div
                className={`flex items-center gap-2 ${theme.bgSecondary} p-4 rounded-xl`}
              >
                <div
                  className={`text-[${currentColor}] w-6 h-6 flex items-center justify-center`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className={`${theme.text} text-lg capitalize`}>
                  {selectedOption}
                </span>
              </div>
            )}

            {/* Indicateur de chargement en attente de réponse */}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.isUser ? "flex-row-reverse" : ""
                }`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-red-500 to-red-600 ring-2 ring-red-500/20">
                    <Image
                      src="/chat/bot.png"
                      alt="Assistant"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {message.isUser && (
                  <div className={theme.text + " ml-2"}>
                    <UserIcon />
                  </div>
                )}
                <div
                  className={`flex flex-col gap-1.5 ${
                    message.isUser ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`
                    relative 
                    rounded-2xl px-4 py-2.5 
                    max-w-[280px]
                    ${
                      message.isUser
                        ? "bg-gradient-to-r from-red-500 via-red-500 to-red-600 text-white shadow-lg shadow-red-500/20 rounded-tr-sm"
                        : "bg-gradient-to-br from-[#323232] to-[#272727] text-gray-100 shadow-lg shadow-black/10 rounded-tl-sm"
                    }
                  `}
                  >
                    {message.isLoading ? (
                      <div className="py-2">
                        <div className="flex space-x-2">
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              repeatDelay: 0.25,
                            }}
                            className="h-2 w-2 rounded-full bg-gray-400"
                          ></motion.div>
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              repeatDelay: 0.25,
                              delay: 0.1,
                            }}
                            className="h-2 w-2 rounded-full bg-gray-400"
                          ></motion.div>
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              repeatDelay: 0.25,
                              delay: 0.2,
                            }}
                            className="h-2 w-2 rounded-full bg-gray-400"
                          ></motion.div>
                        </div>
                      </div>
                    ) : (
                      message.content.map((content, contentIndex) => (
                        <div key={contentIndex}>
                          {content.type === "text" && (
                            <p className="relative z-10 text-[15px] leading-relaxed">
                              <MarkdownRenderer text={content.content} />
                            </p>
                          )}

                          {content.type === "image" && (
                            <div
                              className="relative rounded-lg overflow-hidden my-2 cursor-pointer"
                              onClick={() =>
                                handleImageClick(message.id, contentIndex)
                              }
                            >
                              <Image
                                src={content.content}
                                alt="Image message"
                                width={300}
                                height={200}
                                className="w-full h-auto"
                              />
                            </div>
                          )}

                          {content.type === "button" &&
                            content.buttons &&
                            content.buttons.length > 0 && (
                              <div className="relative my-2 mt-3">
                                <div className="flex flex-wrap gap-2">
                                  {content.buttons.map((button) => (
                                    <button
                                      key={button.id}
                                      onClick={() =>
                                        handleButtonClick(
                                          message.id,
                                          contentIndex,
                                          button
                                        )
                                      }
                                      className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                                    >
                                      {button.title}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          
                          {content.type === "form" && content.formFields && content.formFields.length > 0 && (
                            <FormComponent 
                              messageId={message.id}
                              contentIndex={contentIndex}
                              formFields={content.formFields}
                              onSubmit={handleFormSubmit}
                              theme={theme}
                            />
                          )}

                          {content.type === "list" &&
                            content.listItems &&
                            content.listItems.length > 0 && (
                              <InteractiveListComponent
                                messageId={message.id}
                                contentIndex={contentIndex}
                                text={content.text}
                                listItems={content.listItems}
                                selector={content.selector || "unique"}
                                onConfirm={handleListConfirmation}
                              />
                            )}

                          {content.type === "location" && (
                            <div className="relative rounded-lg overflow-hidden my-2 p-3 bg-black/20">
                              <div className="flex items-center gap-2 mb-2">
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-red-400"
                                >
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                  <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span className="font-medium">
                                  Localisation partagée
                                </span>
                              </div>

                              <div className="relative rounded-lg overflow-hidden h-[150px] w-full bg-gray-800 mb-2">
                                {content.latitude && content.longitude && (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 text-white">
                                    <div className="text-center p-2">
                                      <svg
                                        className="w-6 h-6 mx-auto mb-1"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                      </svg>
                                      <p>
                                        Position:{" "}
                                        {content.latitude?.toFixed(6)},{" "}
                                        {content.longitude?.toFixed(6)}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="text-sm">{content.address}</div>

                              <a
                                href={`https://www.google.com/maps?q=${content.latitude},${content.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center text-sm text-blue-400 hover:text-blue-300"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="mr-1"
                                >
                                  <line x1="7" y1="17" x2="17" y2="7"></line>
                                  <polyline points="7 7 17 7 17 17"></polyline>
                                </svg>
                                Voir dans Google Maps
                              </a>
                            </div>
                          )}

                          {content.type === "audio" && (
                            <div className="flex items-center gap-3 bg-black/20 rounded-xl p-3 min-w-[200px]">
                              {content.error ? (
                                <div className="w-full text-center p-2">
                                  <div className="text-red-500 mb-1">
                                    <svg
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="inline-block mr-1"
                                    >
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <line
                                        x1="12"
                                        y1="8"
                                        x2="12"
                                        y2="12"
                                      ></line>
                                      <line
                                        x1="12"
                                        y1="16"
                                        x2="12.01"
                                        y2="16"
                                      ></line>
                                    </svg>
                                  </div>
                                  <p className="text-sm text-red-400">
                                    Impossible de lire le fichier audio
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Format non supporté ou fichier
                                    indisponible
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={() =>
                                      toggleAudioPlayback(index, contentIndex)
                                    }
                                    className={`
                                    relative w-10 h-10 flex items-center justify-center rounded-full transition-all
                                    ${
                                      content.isPlaying
                                        ? "bg-red-500"
                                        : "bg-red-500/80 hover:bg-red-500"
                                    }
                                  `}
                                  >
                                    {content.isPlaying && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1.5 }}
                                        className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"
                                      />
                                    )}
                                    <motion.div
                                      animate={{
                                        rotate: content.isPlaying ? 360 : 0,
                                      }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      {content.isPlaying ? (
                                        <svg
                                          width="15"
                                          height="15"
                                          viewBox="0 0 24 24"
                                          fill="white"
                                        >
                                          <rect
                                            x="6"
                                            y="4"
                                            width="4"
                                            height="16"
                                          />
                                          <rect
                                            x="14"
                                            y="4"
                                            width="4"
                                            height="16"
                                          />
                                        </svg>
                                      ) : (
                                        <svg
                                          width="15"
                                          height="15"
                                          viewBox="0 0 24 24"
                                          fill="white"
                                        >
                                          <path d="M8 5v14l11-7z" />
                                        </svg>
                                      )}
                                    </motion.div>
                                  </button>

                                  <div className="flex-1 space-y-2">
                                    <div
                                      className="relative h-2 bg-black/20 rounded-full overflow-hidden cursor-pointer group"
                                      onClick={(e) => {
                                        const rect =
                                          e.currentTarget.getBoundingClientRect();
                                        const x = e.clientX - rect.left;
                                        const percentage =
                                          (x / rect.width) * 100;
                                        const audio =
                                          audioElements[
                                            `${index}-${contentIndex}`
                                          ];
                                        if (audio) {
                                          audio.currentTime =
                                            (percentage / 100) *
                                            audio.duration;
                                        }
                                      }}
                                    >
                                      <motion.div
                                        className="absolute inset-0 bg-red-500/20 scale-y-0 origin-bottom transition-transform"
                                        style={{
                                          scaleY: content.isPlaying ? 1 : 0,
                                        }}
                                      />
                                      <motion.div
                                        className="h-full bg-red-500 rounded-full"
                                        style={{
                                          width: `${content.progress || 0}%`,
                                        }}
                                        animate={{
                                          backgroundColor: content.isPlaying
                                            ? [
                                                "#EF4444",
                                                "#DC2626",
                                                "#EF4444",
                                              ]
                                            : "#EF4444",
                                        }}
                                        transition={{
                                          duration: 1,
                                          repeat: Infinity,
                                          ease: "easeInOut",
                                        }}
                                      />
                                    </div>

                                    <div className="flex justify-between items-center">
                                      <span
                                        className={`${theme.textSecondary} text-sm`}
                                      >
                                        {formatDuration(
                                          content.currentTime || 0
                                        )}
                                      </span>
                                      <span
                                        className={`${theme.textSecondary} text-sm`}
                                      >
                                        {formatDuration(
                                          content.duration || 0
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex items-center gap-2 px-1 text-xs text-gray-400">
                    <span>{message.isUser ? "Vous" : "Assistant"}</span>
                    <span>•</span>
                    <span>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Afficher les checks de statut pour les messages de l'utilisateur */}
                  {message.isUser && message.status && (
                    <div className="text-xs text-right mt-1 pr-1">
                      {message.status === "sent" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-300 inline-block"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                      {message.status === "delivered" && (
                        <div className="inline-flex">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-300 inline-block"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-300 inline-block -ml-2"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      )}
                      {message.status === "read" && (
                        <div className="inline-flex">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="inline-block"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="inline-block -ml-2"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {waitingForBotResponse && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-red-500 to-red-600 ring-2 ring-red-500/20">
                  <Image
                    src="/chat/bot.png"
                    alt="Assistant"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-gradient-to-br from-[#323232] to-[#272727] text-gray-100 px-4 py-2.5 rounded-2xl max-w-[280px] shadow-lg shadow-black/10">
                  <div className="flex space-x-2">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 0.25,
                      }}
                      className="h-2 w-2 rounded-full bg-gray-400"
                    ></motion.div>
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 0.25,
                        delay: 0.1,
                      }}
                      className="h-2 w-2 rounded-full bg-gray-400"
                    ></motion.div>
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 0.25,
                        delay: 0.2,
                      }}
                      className="h-2 w-2 rounded-full bg-gray-400"
                    ></motion.div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className={`px-4 sm:px-6 py-3 border-t ${theme.border}`}>
          {(selectedFiles.length > 0 || inputValue.trim().length > 0) && (
            <div className="absolute bottom-full left-0 mb-2 w-full max-w-full bg-[#1E1E1E] rounded-xl shadow-lg border border-gray-800 p-3 z-50">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-white text-sm font-medium">
                  Aperçu du message
                  {selectedFiles.length > 0 &&
                    ` - Fichiers (${selectedFiles.length})`}
                </h4>
                <button
                  onClick={() => {
                    // Arrêter tous les audios en cours de lecture
                    Object.values(audioElements).forEach((audio) => {
                      audio.pause();
                      audio.src = "";
                    });
                    setAudioElements({});
                    setSelectedFiles([]);
                  }}
                  className="text-gray-400 hover:text-gray-200 p-1"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Aperçu du message texte */}
              {inputValue.trim().length > 0 && (
                <div className="mb-3 p-3 rounded-lg bg-gradient-to-r from-red-500 via-red-500 to-red-600 text-white shadow-md max-h-[100px] overflow-y-auto">
                  <p className="relative z-10 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                    {inputValue}
                  </p>
                </div>
              )}

              <div className="max-h-[200px] overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {imageFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      {/* Bouton de suppression */}
                      <button
                        onClick={() => {
                          // Arrêter l'audio si en cours de lecture
                          if (file.type === "audio") {
                            const audioKey = `preview-${index}`;
                            const existingAudio = audioElements[audioKey];
                            if (existingAudio) {
                              existingAudio.pause();
                              existingAudio.src = "";
                              // Supprimer de la liste des éléments audio
                              setAudioElements((prev) => {
                                const newElements = { ...prev };
                                delete newElements[audioKey];
                                return newElements;
                              });
                            }
                          }

                          setSelectedFiles((prev) =>
                            prev.filter(
                              (_, i) => i !== selectedFiles.indexOf(file)
                            )
                          );
                        }}
                        className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>

                      {/* Aperçu d'image */}
                      <div className="overflow-hidden rounded-lg w-[120px] h-[120px] relative bg-gray-800">
                        <Image
                          src={file.content}
                          alt={file.name || "Image"}
                          width={120}
                          height={120}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1 text-xs text-white truncate">
                          {file.name || "Image"}
                        </div>
                      </div>
                    </div>
                  ))}
                  {imageFiles.length > 5 && (
                    <div className="relative rounded-lg overflow-hidden w-[120px] h-[120px] bg-gray-800">
                      <Image
                        src={imageFiles[4].content}
                        alt={imageFiles[4].name || "Image"}
                        width={120}
                        height={120}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                        <span className="text-white text-lg font-bold">
                          +{imageFiles.length - 5}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          // Arrêter l'audio si en cours de lecture
                          if (imageFiles[4].type === "audio") {
                            const audioKey = `preview-${4}`;
                            const existingAudio = audioElements[audioKey];
                            if (existingAudio) {
                              existingAudio.pause();
                              existingAudio.src = "";
                              // Supprimer de la liste des éléments audio
                              setAudioElements((prev) => {
                                const newElements = { ...prev };
                                delete newElements[audioKey];
                                return newElements;
                              });
                            }
                          }

                          setSelectedFiles((prev) =>
                            prev.filter(
                              (_, i) =>
                                i !== selectedFiles.indexOf(imageFiles[4])
                            )
                          );
                        }}
                        className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {otherFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      {/* Bouton de suppression */}
                      <button
                        onClick={() => {
                          // Arrêter l'audio si en cours de lecture
                          if (file.type === "audio") {
                            const audioKey = `preview-${index}`;
                            const existingAudio = audioElements[audioKey];
                            if (existingAudio) {
                              existingAudio.pause();
                              existingAudio.src = "";
                              // Supprimer de la liste des éléments audio
                              setAudioElements((prev) => {
                                const newElements = { ...prev };
                                delete newElements[audioKey];
                                return newElements;
                              });
                            }
                          }

                          setSelectedFiles((prev) =>
                            prev.filter(
                              (_, i) => i !== selectedFiles.indexOf(file)
                            )
                          );
                        }}
                        className="absolute -top-2 -right-2 z-10 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>

                      {/* Aperçu de document */}
                      {(file.type === "pdf" || file.type === "doc") && (
                        <div className="p-3 rounded-lg flex items-center gap-2 bg-[#27272A] min-w-[180px] max-w-[220px]">
                          <div
                            className={`text-${
                              file.type === "pdf" ? "red" : "blue"
                            }-500 flex-shrink-0`}
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path
                                d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <polyline points="13 2 13 9 20 9" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <span className="text-gray-300 text-sm truncate block">
                              {file.name}
                            </span>
                            <span className="text-gray-400 text-xs">
                              {file.size
                                ? `${Math.round(file.size / 1024)} KB`
                                : ""}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Aperçu audio interactif */}
                      {file.type === "audio" && (
                        <div className="p-3 rounded-lg bg-[#27272A] min-w-[220px] max-w-[280px]">
                          {/* Afficher un message d'erreur si nécessaire */}
                          {file.error && (
                            <div className="text-red-400 text-sm p-2 rounded-md bg-red-900/20 mb-2">
                              Impossible de lire cet audio.
                              <br />
                              Format non supporté ou fichier indisponible.
                            </div>
                          )}
                          <div className="flex items-center gap-3 mb-2">
                            <button
                              onClick={() => {
                                try {
                                  // Créer un audio temporaire pour prévisualisation
                                  const audioPreview = new Audio();

                                  // Ajouter un gestionnaire d'erreur avant de définir la source
                                  audioPreview.addEventListener(
                                    "error",
                                    (e) => {
                                      console.error(
                                        "Erreur de chargement audio (preview):",
                                        e
                                      );
                                      const audioElement =
                                        e.target as HTMLAudioElement;
                                      console.error(
                                        "Source audio:",
                                        audioElement.src
                                      );
                                      console.error(
                                        "État de l'audio:",
                                        audioElement.error?.code,
                                        audioElement.error?.message
                                      );

                                      // Marquer le fichier comme en erreur
                                      setSelectedFiles((prev) => {
                                        const newFiles = [...prev];
                                        newFiles[
                                          selectedFiles.indexOf(file)
                                        ].error = true;
                                        return newFiles;
                                      });
                                    },
                                    { once: true }
                                  );

                                  // Définir la source après avoir configuré le gestionnaire d'erreur
                                  audioPreview.src = file.content;

                                  // Vérifier si un audio est déjà en lecture
                                  const audioKey = `preview-${index}`;
                                  const existingAudio = audioElements[audioKey];

                                  if (existingAudio) {
                                    if (file.isPlaying) {
                                      existingAudio.pause();
                                      console.log("Audio mis en pause");
                                      setSelectedFiles((prev) => {
                                        const newFiles = [...prev];
                                        const fileIndex =
                                          selectedFiles.indexOf(file);
                                        if (fileIndex !== -1) {
                                          console.log(
                                            "Mise à jour de l'état: isPlaying = false"
                                          );
                                          newFiles[fileIndex] = {
                                            ...newFiles[fileIndex],
                                            isPlaying: false,
                                          };
                                        }
                                        return newFiles;
                                      });
                                    } else {
                                      try {
                                        const playPromise =
                                          existingAudio.play();

                                        // La méthode play() renvoie une promesse - nous devons la gérer
                                        if (playPromise !== undefined) {
                                          playPromise.catch((error) => {
                                            console.error(
                                              "Erreur lors de la lecture audio (existingAudio):",
                                              error
                                            );
                                            setSelectedFiles((prev) => {
                                              const newFiles = [...prev];
                                              newFiles[
                                                selectedFiles.indexOf(file)
                                              ].error = true;
                                              newFiles[
                                                selectedFiles.indexOf(file)
                                              ].isPlaying = false;
                                              return newFiles;
                                            });
                                          });
                                        }
                                        // Cette mise à jour est déjà faite plus haut, nous pouvons la supprimer
                                      } catch (error) {
                                        console.error(
                                          "Erreur lors de la lecture audio (existingAudio):",
                                          error
                                        );
                                        setSelectedFiles((prev) => {
                                          const newFiles = [...prev];
                                          newFiles[
                                            selectedFiles.indexOf(file)
                                          ].error = true;
                                          return newFiles;
                                        });
                                      }
                                    }
                                  } else {
                                    // Configurer les événements de l'audio
                                    audioPreview.addEventListener(
                                      "ended",
                                      () => {
                                        console.log("Audio terminé");
                                        setSelectedFiles((prev) => {
                                          const newFiles = [...prev];
                                          const fileIndex =
                                            selectedFiles.indexOf(file);
                                          if (fileIndex !== -1) {
                                            console.log(
                                              "Mise à jour de l'état après fin: isPlaying = false"
                                            );
                                            newFiles[fileIndex] = {
                                              ...newFiles[fileIndex],
                                              isPlaying: false,
                                            };
                                          }
                                          return newFiles;
                                        });
                                      }
                                    );

                                    audioPreview.addEventListener(
                                      "loadedmetadata",
                                      () => {
                                        setSelectedFiles((prev) => {
                                          const newFiles = [...prev];
                                          newFiles[
                                            selectedFiles.indexOf(file)
                                          ].duration = audioPreview.duration;
                                          newFiles[
                                            selectedFiles.indexOf(file)
                                          ].error = false;
                                          return newFiles;
                                        });
                                      }
                                    );

                                    // Démarrer la lecture avec gestion des erreurs
                                    const playPromise = audioPreview.play();
                                    if (playPromise !== undefined) {
                                      playPromise.catch((error) => {
                                        console.error(
                                          "Erreur lors de la lecture audio (preview):",
                                          error
                                        );
                                        setSelectedFiles((prev) => {
                                          const newFiles = [...prev];
                                          newFiles[
                                            selectedFiles.indexOf(file)
                                          ].error = true;
                                          newFiles[
                                            selectedFiles.indexOf(file)
                                          ].isPlaying = false;
                                          return newFiles;
                                        });
                                      });
                                    }

                                    // Enregistrer l'élément audio pour contrôle futur
                                    setAudioElements((prev) => ({
                                      ...prev,
                                      [audioKey]: audioPreview,
                                    }));

                                    // Mettre à jour l'état pour indiquer que l'audio est en lecture
                                    console.log("Nouvel audio en lecture");
                                    setSelectedFiles((prev) => {
                                      const newFiles = [...prev];
                                      const fileIndex =
                                        selectedFiles.indexOf(file);
                                      if (fileIndex !== -1) {
                                        console.log(
                                          "Mise à jour de l'état pour nouvel audio: isPlaying = true"
                                        );
                                        newFiles[fileIndex] = {
                                          ...newFiles[fileIndex],
                                          isPlaying: true,
                                        };
                                      }
                                      return newFiles;
                                    });
                                  }
                                } catch (error) {
                                  console.error(
                                    "Erreur lors de la création de l'aperçu audio:",
                                    error
                                  );
                                  setSelectedFiles((prev) => {
                                    const newFiles = [...prev];
                                    newFiles[
                                      selectedFiles.indexOf(file)
                                    ].error = true;
                                    return newFiles;
                                  });
                                }
                              }}
                              className={`
                                relative w-10 h-10 flex items-center justify-center rounded-full
                                ${
                                  file.isPlaying
                                    ? "bg-red-500"
                                    : "bg-red-500/80 hover:bg-red-500"
                                }
                              `}
                            >
                              {file.isPlaying && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1.5 }}
                                  className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"
                                />
                              )}
                              <motion.div
                                animate={{
                                  rotate: file.isPlaying ? 360 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                              >
                                {file.isPlaying ? (
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <rect
                                      x="6"
                                      y="4"
                                      width="4"
                                      height="16"
                                      fill="white"
                                    />
                                    <rect
                                      x="14"
                                      y="4"
                                      width="4"
                                      height="16"
                                      fill="white"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    width="15"
                                    height="15"
                                    viewBox="0 0 24 24"
                                    fill="white"
                                  >
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                )}
                              </motion.div>
                            </button>

                            <div className="flex-1">
                              <span className="text-gray-300 text-sm truncate block">
                                Enregistrement audio
                              </span>
                              <span className="text-gray-400 text-xs flex items-center gap-1">
                                {file.error ? (
                                  <span className="text-red-400">
                                    Erreur de format
                                  </span>
                                ) : file.isPlaying ? (
                                  <span className="flex space-x-1">
                                    <span className="w-1.5 h-4 bg-red-500 rounded-full animate-[soundbar_1s_ease-in-out_infinite]" />
                                    <span className="w-1.5 h-4 bg-red-500 rounded-full animate-[soundbar_1s_ease-in-out_infinite_0.2s]" />
                                    <span className="w-1.5 h-4 bg-red-500 rounded-full animate-[soundbar_1s_ease-in-out_infinite_0.4s]" />
                                  </span>
                                ) : (
                                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                )}
                                {file.duration
                                  ? formatDuration(file.duration)
                                  : "Audio prêt"}
                              </span>
                            </div>
                          </div>

                          {/* Mini barre de progression */}
                          <div className="h-1 w-full bg-black/30 rounded-full overflow-hidden mt-1">
                            <motion.div
                              className="h-full bg-red-500"
                              initial={{ width: "0%" }}
                              animate={{
                                width: file.isPlaying ? "100%" : "0%",
                              }}
                              transition={{
                                duration: file.duration || 30,
                                ease: "linear",
                                repeat: 0,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Aperçu de localisation */}
                      {file.type === "location" && (
                        <div className="p-3 rounded-lg bg-[#27272A] w-[220px]">
                          <div className="flex items-center gap-2 mb-2">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-red-400"
                            >
                              <path
                                d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span className="text-white text-sm font-medium">
                              {file.address === "Récupération en cours..."
                                ? "Localisation en cours..."
                                : "Localisation prête"}
                            </span>
                          </div>

                          {file.latitude && file.longitude ? (
                            <div className="h-[100px] rounded-lg overflow-hidden mb-1 bg-gray-700">
                              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800 text-white">
                                <div className="text-center p-2">
                                  <svg
                                    className="w-6 h-6 mx-auto mb-1"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                  </svg>
                                  <p>
                                    Position: {file.latitude?.toFixed(4)},{" "}
                                    {file.longitude?.toFixed(4)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-[100px] rounded-lg overflow-hidden mb-1 bg-gray-700 flex items-center justify-center">
                              <svg
                                className="animate-spin h-8 w-8 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            </div>
                          )}

                          <div className="text-gray-300 text-xs truncate">
                            {file.address}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedFiles.length > 0 && (
            <div className="p-2 border-t border-gray-300 flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-2 rounded flex items-center space-x-2"
                >
                  {file.type === "image" ? (
                    <Image
                      src={file.content}
                      alt={file.name || "Image preview"}
                      width={50}
                      height={50}
                      className="object-cover rounded"
                    />
                  ) : file.type === "audio" ? (
                    <audio controls src={file.content} className="w-24" />
                  ) : file.type === "location" ? (
                    <div>
                      <p className="text-sm">{file.address || file.content}</p>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="text-sm">{file.name}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 text-xs"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

      
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`flex items-center gap-3 ${
                  theme.inputBg
                } rounded-xl px-4 py-2.5 ${
                  isExpanded ? "max-w-full w-full" : ""
                }`}
                key="input-container"
              >
                <div className="relative">
                  <button
                    className={`
                    p-2 
                    ${theme.buttonHover} 
                    rounded-full 
                    transition-colors
                  `}
                    onClick={() => setShowAttachMenu(!showAttachMenu)}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isDarkMode ? "#9CA3AF" : "#4B5563"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {showAttachMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`
                        absolute bottom-full left-0 mb-2 
                        ${theme.bg} 
                        rounded-xl 
                        shadow-lg 
                        py-2 
                        min-w-[180px] 
                        z-[10000]
                      `}
                      >
                        <button
                          className={`
                          w-full flex items-center gap-3 px-4 py-2 
                          ${theme.buttonHover}
                          transition-colors 
                          ${theme.text}
                        `}
                          onClick={() => handleFileSelect("photo")}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="M21 15l-5-5L5 21" />
                          </svg>
                          <span>Photo</span>
                        </button>

                        <button
                          className={`
                          w-full flex items-center gap-3 px-4 py-2 
                          ${theme.buttonHover}
                          transition-colors 
                          ${theme.text}
                        `}
                          onClick={() => handleFileSelect("file")}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="13 2 13 9 20 9" />
                          </svg>
                          <span>Fichiers</span>
                        </button>

                        <button
                          className={`
                          w-full flex items-center gap-3 px-4 py-2 
                          ${theme.buttonHover}
                          transition-colors 
                          ${theme.text}
                        `}
                          onClick={() => handleShareLocation()}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span>Localisation</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !isProcessing) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    isProcessing
                      ? "Attendez la réponse..."
                      : "Message à Clem'Bot ..."
                  }
                  className={`
                  flex-1 
                  bg-transparent 
                  outline-none 
                  ${theme.text} 
                  ${theme.inputPlaceholder}
                `}
                  disabled={isProcessing}
                />

                <button
                  className={`
                  relative 
                  p-2 
                  ${theme.buttonHover} 
                  rounded-full 
                  transition-colors
                  ${isRecording ? "text-red-500" : theme.iconColor}
                `}
                  onClick={handleRecordClick}
                  disabled={isProcessing}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                  </svg>
                  {isRecording && (
                    <>
                      <div
                        className={`
                        absolute -top-16 left-1/2 -translate-x-1/2 
                        ${theme.bg} 
                        ${theme.text} 
                        px-4 py-2 
                        rounded-xl 
                        shadow-lg
                      `}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-4 bg-red-500 rounded-full animate-[soundbar_1s_ease-in-out_infinite]" />
                            <div className="w-1.5 h-4 bg-red-500 rounded-full animate-[soundbar_1s_ease-in-out_infinite_0.2s]" />
                            <div className="w-1.5 h-4 bg-red-500 rounded-full animate-[soundbar_1s_ease-in-out_infinite_0.4s]" />
                          </div>
                          <span className={`${theme.text} text-sm font-medium`}>
                            {formatDuration(recordingDuration)}
                          </span>
                        </div>
                      </div>
                      <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping"></div>
                    </>
                  )}
                </button>

                <button
                  className={`
                  p-2 
                  ${theme.buttonHover} 
                  rounded-full 
                  transition-colors
                  ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}
                `}
                  onClick={handleSendMessage}
                  disabled={isProcessing}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isDarkMode ? "#FF3B30" : "#FF3B30"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </motion.div>
            </AnimatePresence>
      
    
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileChange(e, "file")}
          className="hidden"
          accept=".pdf,.doc,.docx"
        />
        <input
          type="file"
          ref={imageInputRef}
          onChange={(e) => handleFileChange(e, "image")}
          className="hidden"
          accept="image/*"
          multiple
        />
      </motion.div>
    </>
  );
}
