"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface ChatBotProps {
  onClose: () => void;
}

interface MessageContent {
  type: "text" | "image" | "audio" | "pdf" | "doc" | "location";
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
}

interface Message {
  id: string;
  content: MessageContent[];
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
  error?: string;
}

const optionColors = {
  simulateurs: "#00DC82",
  demandes: "#FF3B30",
  reclamations: "#FF453A",
  agences: "#0A84FF",
  depannage: "#FF9F0A",
  infos: "#64D2FF",
};

export default function ChatBot({ onClose }: ChatBotProps) {
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
  const [isExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [imageCarousel, setImageCarousel] = useState<{
    isOpen: boolean;
    messageId: string;
    startIndex: number;
    images: MessageContent[];
  }>({ isOpen: false, messageId: "", startIndex: 0, images: [] });

  const [isMounted, setIsMounted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [audioElements, setAudioElements] = useState<{
    [key: string]: HTMLAudioElement;
  }>({});

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

    // Définir isMounted à true après le rendu initial
    setIsMounted(true);

    return () => {
      setIsMounted(false);
    };
  }, []);

  // Fonctions d'agrandissement et de plein écran supprimées car le chat est toujours en plein écran

  const toggleTheme = (e?: React.MouseEvent) => {
    // Arrêter la propagation de l'événement pour éviter les conflits si l'événement existe
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("chatbot-theme", newTheme ? "dark" : "light");
    console.log("Theme toggled:", newTheme ? "dark" : "light");
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

  const handleSendMessage = async () => {
    // Vérifier si une option du menu a été sélectionnée
    if (!selectedOption) {
      // Ne rien faire si aucune option n'est sélectionnée
      return;
    }

    // Si aucun texte ou fichier n'est fourni, ne pas envoyer de message
    if (!inputValue.trim() && selectedFiles.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: [
        ...selectedFiles,
        ...(inputValue.trim()
          ? [{ type: "text" as const, content: inputValue.trim() }]
          : []),
      ],
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // Nettoyer les éléments audio avant de vider la liste des fichiers sélectionnés
    Object.values(audioElements).forEach((audio) => {
      audio.pause();
      audio.src = "";
    });
    setAudioElements({});

    setSelectedFiles([]);
    setShowAttachMenu(false);
    setIsProcessing(true);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: [{ type: "text", content: "" }],
      isUser: false,
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, botMessage]);

    // Simuler la réponse du bot avec un délai pour montrer l'animation de frappe
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessage.id
            ? {
                ...msg,
                isLoading: false,
                content: [
                  {
                    type: "text",
                    content:
                      "Je comprends votre demande concernant " +
                      selectedOption +
                      ". Je vais vous aider...",
                  },
                ],
              }
            : msg
        )
      );
      setIsProcessing(false);
    }, 2000);
  };

  const handleFileSelect = (type: "photo" | "file") => {
    if (type === "photo" && imageInputRef.current) {
      imageInputRef.current.click();
    } else if (type === "file" && fileInputRef.current) {
      fileInputRef.current.click();
    }
    setShowAttachMenu(false);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: "image" | "file"
  ) => {
    const files = e.target.files;
    if (!files?.length) return;

    // Pour les images, prendre en charge plusieurs fichiers
    if (fileType === "image") {
      // Convertir FileList en Array pour pouvoir utiliser map
      const filesArray = Array.from(files);
      // Créer des URLs pour chaque image sélectionnée
      const newSelectedFiles = filesArray.map((file) => {
        const imageUrl = URL.createObjectURL(file);
        return {
          type: "image" as const,
          content: imageUrl,
          name: file.name,
          size: file.size,
        };
      });

      // Ajouter les nouvelles images à celles déjà sélectionnées
      setSelectedFiles((prev) => [...prev, ...newSelectedFiles]);
    } else {
      // Pour les autres fichiers, prendre le premier
      const file = files[0];
      const extension = file.name.split(".").pop()?.toLowerCase();
      let type: MessageContent["type"] = "doc";
      if (extension === "pdf") type = "pdf";

      setSelectedFiles((prev) => [
        ...prev,
        { type, content: file.name, name: file.name, size: file.size },
      ]);
    }
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      // Afficher un message de chargement pendant la récupération des coordonnées
      setSelectedFiles((prev) => [
        ...prev,
        {
          type: "location",
          content: "Récupération de votre position...",
          address: "Récupération en cours...",
        },
      ]);

      // Options pour une meilleure précision
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const address = `Latitude: ${latitude.toFixed(
              6
            )}, Longitude: ${longitude.toFixed(6)}`;

            setSelectedFiles((prev) =>
              prev.map((file) =>
                file.type === "location" &&
                file.address === "Récupération en cours..."
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
          } catch (error) {
            console.error(
              "Erreur lors de la récupération de la position",
              error
            );
            // En cas d'erreur, utiliser simplement les coordonnées
            setSelectedFiles((prev) =>
              prev.map((file) =>
                file.type === "location" &&
                file.address === "Récupération en cours..."
                  ? {
                      type: "location",
                      content: `${latitude},${longitude}`,
                      address: `Latitude: ${latitude.toFixed(
                        6
                      )}, Longitude: ${longitude.toFixed(6)}`,
                      latitude,
                      longitude,
                    }
                  : file
              )
            );
          }
        },
        (error) => {
          // Gérer l'erreur de géolocalisation
          console.error("Erreur de géolocalisation:", error);

          // Supprimer le message de chargement et afficher une erreur
          setSelectedFiles((prev) =>
            prev.filter(
              (file) =>
                !(
                  file.type === "location" &&
                  file.address === "Récupération en cours..."
                )
            )
          );

          // Afficher un message d'erreur plus descriptif selon le type d'erreur
          let errorMessage = "Impossible d'accéder à votre localisation.";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage +=
                " Vous avez refusé la demande de géolocalisation.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage +=
                " Les informations de localisation sont indisponibles.";
              break;
            case error.TIMEOUT:
              errorMessage += " La demande de localisation a expiré.";
              break;
          }

          alert(errorMessage);
        },
        options
      );
    } else {
      alert(
        "La géolocalisation n'est pas prise en charge par votre navigateur."
      );
    }

    setShowAttachMenu(false);
  };

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
      return; // Ne pas tenter de créer un élément Audio
    }

    // Ajouter un log pour déboguer les problèmes de lecture
    console.log("Tentative de lecture audio:", content.content);

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

  return (
    <>
      {/* Carrousel d'images */}
      {imageCarousel.isOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center">
          <div className="absolute top-4 right-4 ">
            <button
              onClick={closeImageCarousel}
              className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="relative w-full max-w-3xl mx-auto ]">
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
            <div className="absolute inset-y-0 left-4 flex items-center">
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`
          h-full
          w-full
          ${theme.bg} 
          overflow-hidden 
          transition-all 
          duration-300
          flex flex-col
          pointer-events-auto
        `}
      >
        <div
          className={`flex items-center px-4 py-3 sm:px-6 sm:py-4 border-b ${theme.border} flex-shrink-0 pointer-events-auto relative`}
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
              <p className={`${theme.textSecondary} text-sm`}>En ligne</p>
            </div>
          </div>

          {/* Utilisation de createPortal pour rendre les boutons en dehors de la hiérarchie normale du DOM */}
          {isMounted &&
            typeof document !== "undefined" &&
            createPortal(
              <div
                className="fixed top-5 right-5 flex gap-3 z-[999999] pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Bouton de changement de thème */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleTheme(e);
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-full shadow-md cursor-pointer pointer-events-auto"
                  style={{
                    backgroundColor: isDarkMode ? "#27272A" : "#F3F4F6",
                    border: "none",
                    outline: "none",
                  }}
                >
                  {isDarkMode ? (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 1V3"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 21V23"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.22 4.22L5.64 5.64"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.36 18.36L19.78 19.78"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1 12H3"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 12H23"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.22 19.78L5.64 18.36"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.36 5.64L19.78 4.22"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1582 17.4668C18.1126 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.748 21.1181 10.0795 20.7461C8.41102 20.3741 6.88299 19.5345 5.67423 18.3258C4.46546 17.117 3.62594 15.589 3.25391 13.9205C2.88188 12.252 2.99272 10.5121 3.57346 8.9043C4.1542 7.29651 5.18083 5.88737 6.53321 4.84175C7.88559 3.79614 9.50779 3.15731 11.21 3C10.2134 4.34827 9.73385 6.00945 9.85853 7.68141C9.98322 9.35338 10.7039 10.9251 11.8894 12.1106C13.0749 13.2961 14.6466 14.0168 16.3186 14.1415C17.9906 14.2662 19.6517 13.7866 21 12.79Z"
                        stroke="#4B5563"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>

                {/* Bouton de fermeture */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-full shadow-md cursor-pointer pointer-events-auto"
                  style={{
                    backgroundColor: isDarkMode ? "#27272A" : "#F3F4F6",
                    color: isDarkMode ? "#9CA3AF" : "#4B5563",
                    border: "none",
                    outline: "none",
                  }}
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
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>,
              document.body
            )}
        </div>

        <div
          ref={chatContainerRef}
          className={`
          relative 
          px-4 sm:px-6 
          py-3 sm:py-4 
          min-h-[250px] 
          flex-grow overflow-y-auto
          ${theme.bg}
        `}
          style={{
            background: isDarkMode
              ? "linear-gradient(180deg, #2C2C2C 0%, #252525 100%)"
              : "linear-gradient(180deg, #FFFFFF 0%, #F9FAFB 100%)",
          }}
        >
          {!selectedOption ? (
            <div className="flex flex-col items-center gap-4">
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
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
          ) : (
            <div className="flex flex-col gap-4">
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
                    <div className="ml-2 relative">
                      <div className="bg-blue-200 rounded-full w-8 h-8 flex items-center justify-center overflow-hidden relative">
                        <Image
                          src="/assets/personne.png"
                          alt="User"
                          width={32}
                          height={32}
                          className="rounded-full"
                          placeholder="blur"
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFMQJ+WCwgQQAAAABJRU5ErkJggg=="
                        />
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-[1px] border-white z-50"></div>
                      </div>
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
                                {content.content}
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
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
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
                                        console.log(
                                          "Tentative de lecture audio"
                                        );

                                        // Mettre à jour l'état immédiatement pour changer l'icône
                                        setSelectedFiles((prev) => {
                                          const newFiles = [...prev];
                                          const fileIndex =
                                            selectedFiles.indexOf(file);
                                          if (fileIndex !== -1) {
                                            console.log(
                                              "Mise à jour de l'état: isPlaying = true"
                                            );
                                            newFiles[fileIndex] = {
                                              ...newFiles[fileIndex],
                                              isPlaying: true,
                                            };
                                          }
                                          return newFiles;
                                        });

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
                                    <span className="w-1.5 h-3 bg-red-500 rounded-full animate-[soundbar_1s_ease-in-out_infinite]"></span>
                                    <span className="w-1.5 h-3 bg-red-500 rounded-full animate-[soundbar_1s_ease-in-out_infinite_0.2s]"></span>
                                    <span className="w-1.5 h-3 bg-red-500 rounded-full animate-[soundbar_1s_ease-in-out_infinite_0.4s]"></span>
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
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
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
          {/* {selectedOption ? ( */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
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
                  ${
                    isProcessing ||
                    (!inputValue.trim() && selectedFiles.length === 0)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                `}
                onClick={handleSendMessage}
                disabled={
                  isProcessing ||
                  (!inputValue.trim() && selectedFiles.length === 0)
                }
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
