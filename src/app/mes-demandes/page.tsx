"use client";

import Link from "next/link";
import Breadcrumb from "../components/Breadcrumb";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import FloatingBot from "../components/FloatingBot";

// Configuration pour forcer le rendu côté client uniquement
export const dynamic = "force-dynamic";
export const runtime = "edge";

const DEMANDES = [
  {
    id: 1,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Branchements abonnements",
    description:
      "Le branchement consiste à relier votre local au réseau électrique",
    link: "/branchements-abonnements",
    documents: [
      "Pièce d'identité",
      "Titre de propriété ou bail de location",
      "Attestation de conformité technique"
    ]
  },
  {
    id: 2,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: "Réabonnements",
    description:
      "Vous venez de vous installer dans un nouveau local et vous avez un tableau de comptage sans électricité? Procédez ici à un réabonnement",
    link: "/reabonnements",
    documents: [
      "Pièce d'identité",
      "Titre de propriété ou bail de location",
      "Dernière facture d'électricité ou numéro d'abonnement"
    ]
  },
  {
    id: 3,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    title: "Mutation",
    description:
      "Vous aménagez un nouveau local ou vous démarrez une activité et l'abonnement n'est pas à votre nom?",
    link: "/mutation",
    documents: [
      "Pièce d'identité",
      "Titre de propriété ou bail de location",
      "Facture d'électricité récente"
    ]
  },
  {
    id: 4,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Modification branchement",
    description:
      "Modifier votre puissance ou adapter votre type de branchement (Monophasé / Triphasé)",
    link: "/modification-branchement",
    documents: [
      "Pièce d'identité",
      "Facture d'électricité récente",
      "Formulaire de demande complété"
    ]
  },
  {
    id: 5,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
    title: "Maintenances d'ouvrage",
    description:
      "Effectuer une demande d'entretien, de construction d'ouvrage publics ou de déplacement d'infrastructures élèctriques",
    link: "/maintenance-ouvrage",
    documents: [
      "Pièce d'identité",
      "Titre de propriété",
      "Plan de localisation",
      "Description détaillée des travaux"
    ]
  },
  {
    id: 6,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Abonnement",
    description:
      "Mettre fin à un contrat d'abonnement, Achat disjoncteur / achète un Disjoncteur en cas de panne, de changement de puissance",
    link: "/abonnement",
    documents: [
      "Pièce d'identité",
      "Numéro d'abonnement",
      "Dernière facture"
    ]
  },
  {
    id: 7,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: "Modifications commerciales",
    description:
      "Mettre fin à un contrat d'abonnement, Achat disjoncteur / achète un Disjoncteur en cas de panne, de changement de puissance",
    link: "/modifications-commerciales",
    documents: [
      "Pièce d'identité",
      "Justificatif de domicile",
      "Numéro d'abonnement",
      "Formulaire de demande"
    ]
  },
  {
    id: 8,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    title: "Achat disjoncteur",
    description:
      "Modifier votre puissance ou adapter votre type de branchement (Monophasé / Triphasé)",
    link: "/achat-disjoncteur",
    documents: [
      "Pièce d'identité",
      "Facture d'électricité",
      "Justificatif de domicile"
    ]
  },
  {
    id: 9,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "Construction d'ouvrage",
    description: "Nouveau projet de construction",
    link: "/construction-ouvrage",
    documents: [
      "Pièce d'identité",
      "Titre de propriété",
      "Permis de construire",
      "Plans de construction",
      "Étude de faisabilité"
    ]
  },
];

const demandesLabels = {
  "mes-demandes": "Mes demandes"
};

export default function MesDemandesPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState("");
  const [selectedMode, setSelectedMode] = useState<number>(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  const [showFloatingBot, setShowFloatingBot] = useState(true);

  useEffect(() => {
    // Import the animation data dynamically
    import("../../../public/bot-anime-flow.json").then((data) => {
      setAnimationData(data.default);
    });
  }, []);

  const handleDemandeClick = (e: React.MouseEvent, link: string, mode: number) => {
    e.preventDefault();

    // Vérifier si l'utilisateur est connecté (token présent dans localStorage)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

    if (token && user) {
      // Utilisateur connecté, redirection vers le dashboard
      console.log("Utilisateur connecté, redirection vers le dashboard avec mode:", mode);

      // Déterminer quel type de demande ouvrir dans le dashboard
      let demandeType = "";
      switch (mode) {
        case 3: // Mutation
          demandeType = "mutation";
          break;
        case 1: // Branchement d'abonnement
          demandeType = "branchement";
          break;
        case 2: // Réabonnement
          demandeType = "reabonnement";
          break;
        case 4: // Abonnement
          demandeType = "abonnement";
          break;
        case 5: // Modification branchement
          demandeType = "modification-branchement";
          break;
        case 6: // Maintenance d'ouvrage
          demandeType = "maintenance-ouvrage";
          break;
        case 7: // Modification commerciale
          demandeType = "modification-commerciale";
          break;
        case 8: // Achat disjoncteur
          demandeType = "achat-disjoncteur";
          break;
        case 9: // Construction d'ouvrage
          demandeType = "construction-ouvrage";
          break;
        default:
          demandeType = "";
      }

      // Stocker le type de demande dans localStorage pour que le dashboard puisse l'utiliser
      if (demandeType && typeof window !== 'undefined') {
        localStorage.setItem('openDemandeType', demandeType);
      }

      // Rediriger vers le dashboard
      if (typeof window !== 'undefined') {
        window.location.href = `/dashboard`;
      }
    } else {
      // Utilisateur non connecté, afficher la modal d'authentification
      setSelectedLink(link);
      setSelectedMode(mode);
      setShowAuthModal(true);
    }
  };

  const handleLogin = () => {
    // Si une demande de chat est en attente, la stocker dans sessionStorage
    // (car localStorage peut être effacé lors de la redirection)
    if (typeof window !== 'undefined') {
      const pendingChatDemande = localStorage.getItem('pendingChatDemande');
      if (pendingChatDemande) {
        sessionStorage.setItem('pendingChatAfterLogin', pendingChatDemande);
        localStorage.removeItem('pendingChatDemande');
      }

      // Stocker également le type de demande pour l'ouvrir après connexion
      if (selectedMode) {
        localStorage.setItem('pendingDemandeMode', selectedMode.toString());
      }

      // Rediriger vers la page de connexion dans la même application
      window.location.href = `/login?mode=${selectedMode}`;
    }
    setShowAuthModal(false);
  };

  const handleRegister = () => {
    // Si une demande de chat est en attente, la stocker dans sessionStorage
    if (typeof window !== 'undefined') {
      const pendingChatDemande = localStorage.getItem('pendingChatDemande');
      if (pendingChatDemande) {
        sessionStorage.setItem('pendingChatAfterLogin', pendingChatDemande);
        localStorage.removeItem('pendingChatDemande');
      }

      // Stocker également le type de demande pour l'ouvrir après connexion
      if (selectedMode) {
        localStorage.setItem('pendingDemandeMode', selectedMode.toString());
      }

      // Rediriger vers la page d'inscription
      window.location.href = `/registration?mode=${selectedMode}`;
    }
    setShowAuthModal(false);
  };

  const openChat = (demandeTitle: string) => {
    if (typeof window === 'undefined') return;

    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      // Utilisateur connecté, ouvrir le chat directement
      proceedWithChat(demandeTitle);
    } else {
      // Utilisateur non connecté, stocker la demande de chat et afficher la modale d'auth
      localStorage.setItem('pendingChatDemande', demandeTitle);
      setSelectedMode(0); // Mode générique pour le chat
      setShowAuthModal(true);
    }
  };

  const proceedWithChat = (demandeTitle: string) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    setIsChatOpen(true);
    setShowFloatingBot(false);

    // Afficher le conteneur de chat et lui donner le focus
    const chatContainer = document.querySelector('#botpress-webchat') as HTMLElement;
    if (chatContainer) {
      chatContainer.style.display = 'block';
      chatContainer.focus();
    }

    // Petite temporisation pour s'assurer que l'iframe est chargée
    setTimeout(() => {
      // Message de bienvenue spécifique à la demande
      const message = `Bonjour, je souhaite être accompagné pour une demande de ${demandeTitle.toLowerCase()}.`;

      // Tentative d'envoi du message (avec retries)
      attemptToSendMessage(message, 0);
    }, 1000);
  };

  const attemptToSendMessage = (message: string, attempts: number) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    if (attempts > 5) {
      console.warn("Impossible d'envoyer le message après plusieurs tentatives");
      return;
    }

    try {
      const webchatIframe = document.querySelector('#botpress-webchat iframe') as HTMLIFrameElement;
      if (!webchatIframe || !webchatIframe.contentDocument) {
        setTimeout(() => attemptToSendMessage(message, attempts + 1), 1000);
        return;
      }

      const inputElement = webchatIframe.contentDocument.querySelector('input[type="text"]') as HTMLInputElement;

      if (inputElement) {
        setMessageInInput(inputElement, message);

        // Déclencher l'envoi du message
        const form = inputElement.closest('form');
        if (form) {
          form.dispatchEvent(new Event('submit', { cancelable: true }));
        } else {
          // Fallback: simuler l'appui sur Entrée
          inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
        }
      } else {
        // Réessayer si l'input n'est pas encore disponible
        setTimeout(() => attemptToSendMessage(message, attempts + 1), 1000);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      setTimeout(() => attemptToSendMessage(message, attempts + 1), 1000);
    }
  };

  const setMessageInInput = (input: HTMLInputElement, message: string) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // Définir la valeur
    input.value = message;

    // Créer et dispatcher les événements nécessaires pour simuler une saisie utilisateur
    const inputEvent = new Event('input', { bubbles: true });
    const changeEvent = new Event('change', { bubbles: true });

    input.dispatchEvent(inputEvent);
    input.dispatchEvent(changeEvent);
  };

  // Effet pour vérifier si un message est en attente après la connexion
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const pendingChatMessage = sessionStorage.getItem('pendingChatAfterLogin');
    if (pendingChatMessage) {
      // Effacer le message en attente
      sessionStorage.removeItem('pendingChatAfterLogin');

      // Laisser un peu de temps pour que le chatbot se charge
      setTimeout(() => {
        proceedWithChat(pendingChatMessage);
      }, 1500);
    }

    // Vérifier également si une demande est en attente d'ouverture après connexion
    const pendingDemandeMode = localStorage.getItem('pendingDemandeMode');
    if (pendingDemandeMode) {
      const mode = parseInt(pendingDemandeMode, 10);
      let demandeType = "";

      switch (mode) {
        case 3:
          demandeType = "mutation";
          break;
        case 1:
          demandeType = "branchement";
          break;
        case 2:
          demandeType = "reabonnement";
          break;
      }

      if (demandeType) {
        localStorage.setItem('openDemandeType', demandeType);
        localStorage.removeItem('pendingDemandeMode');
        window.location.href = `/dashboard`;
      }
    }

    // Ajouter un gestionnaire d'événements pour forcer l'ouverture du chat depuis d'autres pages
    const forceOpenChat = (event: Event) => {
      if (typeof document === 'undefined') return;

      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.message) {
        proceedWithChat(customEvent.detail.message);
      }
    };

    document.addEventListener('forceOpenChat', forceOpenChat as EventListener);

    return () => {
      document.removeEventListener('forceOpenChat', forceOpenChat as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-start justify-center pt-14 pb-20 ">
      {/* Rendre conditionnellement le composant FloatingBot */}
      {showFloatingBot && <FloatingBot />}

      <div className="w-[91%]">

        <div className="bg-gradient-to-br from-[#F5F5F5] to-[#FFFFFF] rounded-[40px] overflow-hidden relative shadow-sm">
          {/* Éléments décoratifs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

          {/* Titre avec style amélioré */}
          <header className="px-8 py-16 relative">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0" style={{
                backgroundImage: "radial-gradient(#f97316 1px, transparent 1px)",
                backgroundSize: "30px 30px"
              }}></div>
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-noir relative inline-block">
                Mes demandes
                <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange to-transparent"></div>
              </h1>
              <p className="text-center text-gray-600 mt-6 text-lg max-w-2xl mx-auto">
                Retrouvez l'ensemble des demandes disponibles pour votre compte particulier. Choisissez votre type de demande ci-dessous.
              </p>
            </div>
          </header>

          {/* Grille de cartes avec design amélioré */}
          <div className="px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-2">
              {DEMANDES.map((demande, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl pt-16 pb-8 px-8 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col items-center text-center group cursor-pointer transform hover:-translate-y-2 mt-12 relative focus-within:ring-2 focus-within:ring-orange/60 focus-within:outline-none"
                  tabIndex={0}
                  aria-label={`Demande de ${demande.title}`}
                >
                  {/* Indicateur de durée/délai */}
                  <div className="absolute top-4 right-4 inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-800">
                    <svg className="w-3.5 h-3.5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Traitement: 48-72h</span>
                  </div>

                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-24 h-24 group-hover:scale-110 transition-all duration-300 flex items-center justify-center rounded-full bg-gradient-to-br from-orange/20 to-orange/5 shadow-md border-[6px] border-white z-10">
                    {demande.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-noir mb-3 group-hover:text-orange transition-colors duration-300 mt-2">
                    {demande.title}
                  </h2>

                  <p className="text-gray-700 mb-4 min-h-[80px]">{demande.description}</p>

                  {/* Liste des documents requis avec formats acceptés */}
                  <div className="w-full mb-5 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                    <h3 className="text-left text-sm font-semibold mb-2 text-gray-800 flex items-center">
                      <svg className="h-4 w-4 mr-1 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Pièces à fournir:
                      {/* <button
                        className="ml-1 text-orange hover:text-orange/80 focus:outline-none focus:ring-1 focus:ring-orange rounded-full"
                        title="Formats acceptés: PDF, JPG, PNG (max 5MB par fichier)"
                        aria-label="Information sur les formats acceptés"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button> */}
                    </h3>
                    <ul className="text-left text-xs text-gray-600 space-y-1.5 pl-2">
                      {demande.documents?.map((doc, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="h-4 w-4 text-orange mr-1 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-500 mt-2 text-left italic">
                      Formats acceptés: PDF, JPG, PNG (max 5MB)
                    </p>
                  </div>

                  {/* Indication d'étape suivante */}


                  {/* Boutons */}
                  <div className="flex items-center justify-center gap-3 w-full mt-auto">
                    <button
                      onClick={(e) => handleDemandeClick(e, demande.link, demande.id)}
                      className="inline-flex bg-noir text-white group-hover:bg-orange transition-all duration-300 font-medium rounded-full px-4 py-1.5 hover:shadow-md group-hover:scale-105 cursor-pointer items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange text-sm"
                      aria-label={`Faire une demande de ${demande.title}`}
                    >
                      <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Faire une demande
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openChat(demande.title);
                      }}
                      className="flex items-center justify-center w-12 h-12 rounded-full shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-orange to-orange/70 focus:outline-none focus:ring-2 focus:ring-orange/40 hover:scale-110 relative overflow-hidden group"
                      title="Faire une demande via le chat"
                      aria-label="Faire une demande par chat avec un conseiller"
                    >
                      {/* Magical shimmer effect */}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></span>

                      {/* Magical glow effect */}
                      <span className="absolute inset-0 w-full h-full rounded-full bg-orange/40 blur-md animate-pulse"></span>

                      {/* Sparkle decorations */}
                      <span className="absolute top-0 right-1 text-yellow-200 text-xs animate-bounce delay-300">✦</span>
                      <span className="absolute bottom-1 left-1 text-yellow-200 text-xs animate-ping opacity-75">✦</span>
                      <span className="absolute top-2 left-2 text-yellow-200 text-xs animate-pulse">✦</span>

                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </button>
                  </div>

                  <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-gray-50 to-transparent rounded-t-2xl -z-0"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'authentification */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden relative"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Pattern de fond subtil */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute inset-0" style={{
                  backgroundImage: "radial-gradient(#f97316 1px, transparent 1px)",
                  backgroundSize: "20px 20px"
                }}></div>
              </div>

              <div className="relative">
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 bg-white/80 rounded-full p-2 backdrop-blur-sm transition-colors duration-300 hover:bg-gray-100"
                  onClick={() => setShowAuthModal(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div>
                  <div className="bg-gradient-to-r from-orange/20 via-orange/15 to-orange/5 rounded-t-2xl pt-10 pb-24 px-8 border-b border-gray-100 relative overflow-hidden">
                    {/* Formes décoratives */}
                    <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-orange/20 blur-xl"></div>
                    <div className="absolute -left-10 bottom-0 w-40 h-40 rounded-full bg-orange/10 blur-xl"></div>

                    <h2 className="text-2xl font-bold text-center text-gray-800 relative">
                      <span className="relative">
                        Continuez votre demande
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-orange rounded-full"></div>
                      </span>
                    </h2>
                  </div>

                  <div className="p-8 pt-0 relative">
                    {/* Icône centrée avec effet d'élévation */}
                    <div className="flex justify-center -mt-14 mb-8 relative z-10">
                      <div className="w-28 h-28 rounded-full bg-white p-1.5 shadow-lg">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-orange/20 to-orange/5 flex items-center justify-center overflow-hidden">
                          {animationData && (
                            <Lottie
                              animationData={animationData}
                              loop={true}
                              style={{ width: "80%", height: "80%" }}
                            />
                          )}
                        </div>
                      </div>

                      {/* Effet de pulsation */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-28 h-28 rounded-full bg-orange/20 animate-ping opacity-30 duration-1000 delay-300"></div>
                      </div>
                    </div>

                    <div className="relative z-10">
                      <p className="text-gray-600 text-center mb-8 max-w-sm mx-auto">
                        Pour continuer votre demande et accéder à tous nos services, veuillez vous connecter ou créer un compte.
                      </p>

                      <div className="space-y-4 max-w-sm mx-auto">
                        <button
                          onClick={handleLogin}
                          className="w-full py-3.5 bg-gradient-to-r from-orange to-orange/90 text-white font-medium rounded-xl hover:from-orange/90 hover:to-orange transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group overflow-hidden relative"
                        >
                          {/* Effet brillant */}
                          <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -translate-x-full skew-x-12 group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>

                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          <span>J'ai déjà un compte</span>
                        </button>

                        <div className="relative my-6">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <span className="px-3 bg-white text-sm text-gray-500">ou</span>
                          </div>
                        </div>

                        <button
                          onClick={handleRegister}
                          className="w-full py-3.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 hover:border-orange/30 hover:text-orange/90 group shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-hover:text-orange transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          <span>Je crée un compte</span>
                        </button>
                      </div>

                      <div className="mt-8 flex justify-center">
                        <button
                          onClick={() => setShowAuthModal(false)}
                          className="text-sm text-gray-500 hover:text-orange transition-all duration-300 flex items-center gap-1 py-2 px-3 rounded-lg hover:bg-orange/5"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Annuler la demande
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
