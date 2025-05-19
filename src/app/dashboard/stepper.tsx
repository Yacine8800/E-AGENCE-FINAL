import React, { useState, useRef } from "react";
import { clsx } from "clsx";
import InfoClient from "./demandes/InfoClient";
import InfoClientSuite from "./demandes/InfoClientSuite";
import InfoDemandeur from "./demandes/InfoDemandeur";
import InfoBranchement from "./demandes/InfoBranchement";
import InfoDisjoncteur from "./demandes/InfoDisjoncteur";
import Documents from "./demandes/Documents";
import InfoIdCard from "./demandes/InfoIdCard";
import demandesService from "../services/demandesService";
import { toast } from "react-toastify";
import { ToastifyDetailedError } from "../../../utils/toast";
import { DemandeType } from "../constants/demandes";
import { useAuth } from "../../hooks/useAuth";

// Définition des étapes par type de demande
const stepsByType: Record<DemandeType, string[]> = {
  mutation: [
    "Joindre les documents",
    "Infos de l'ancien client",
    "Infos de l'ancien client",
    "Infos du nouveau client",
    "Infos sur le branchement",
  ],
  reabonnement: [
    "Joindre les documents",
    "Infos de l'ancien client",
    "Infos de l'ancien client",
    "Infos du nouveau client",
    "Infos sur le branchement",
  ],
  branchement: [
    "Joindre les documents du demandeur",
    "Pièce d'identité du demandeur",
    "Infos du demandeur",
  ],
  abonnement: [
    "Joindre les documents du demandeur",
    "Pièce d'identité du demandeur",
    "Infos du demandeur",
  ],
  resiliation: [
    "Joindre les documents",
    "Infos du client",
    "Infos localisation",
    "Infos sur la résiliation",
  ],
  "modification-branchement": [
    "Joindre les documents",
    "Infos du client",
    "Détails de la modification",
    "Infos localisation",
  ],
  "maintenance-ouvrage": [
    "Joindre les documents",
    "Infos du client",
    "Détails de la maintenance",
    "Infos localisation",
  ],
  "modification-commerciale": [
    "Joindre les documents",
    "Infos du client",
    "Détails de la modification",
  ],
  "achat-disjoncteur": [
    "Joindre les documents",
    "Infos du client",
    "Détails de l'achat",
  ],
  "construction-ouvrage": [
    "Joindre les documents",
    "Infos du demandeur",
    "Détails de la construction",
    "Infos localisation",
  ],
};

// Définition des composants à utiliser pour chaque étape et type
const componentsByType: Record<DemandeType, Array<{ Component: React.ComponentType<any>; name: string }>> = {
  mutation: [
    { Component: Documents, name: "documents" },
    { Component: InfoClient, name: "request_info" },
    { Component: InfoClientSuite, name: "current_owner" },
    { Component: InfoDemandeur, name: "new_owner" },
    { Component: InfoBranchement, name: "location_and_mutation" },
  ],
  reabonnement: [
    { Component: Documents, name: "documents" },
    { Component: InfoClient, name: "request_info" },
    { Component: InfoClientSuite, name: "current_owner" },
    { Component: InfoDemandeur, name: "new_owner" },
    { Component: InfoBranchement, name: "location_and_mutation" },
  ],
  branchement: [
    { Component: Documents, name: "documents" },
    { Component: InfoIdCard, name: "id_card" },
    { Component: InfoDemandeur, name: "new_owner" },
  ],
  abonnement: [
    { Component: Documents, name: "documents" },
    { Component: InfoIdCard, name: "id_card" },
    { Component: InfoDemandeur, name: "new_owner" },
  ],
  resiliation: [
    { Component: Documents, name: "documents" },
    { Component: InfoClient, name: "request_info" },
    { Component: InfoBranchement, name: "location_and_mutation" },
    { Component: InfoClientSuite, name: "termination_info" },
  ],
  "modification-branchement": [
    { Component: Documents, name: "documents" },
    { Component: InfoClient, name: "request_info" },
    { Component: InfoClientSuite, name: "current_owner" },
    { Component: InfoBranchement, name: "location_and_mutation" },
  ],
  "maintenance-ouvrage": [
    { Component: Documents, name: "documents" },
    { Component: InfoClient, name: "request_info" },
    { Component: InfoClientSuite, name: "current_owner" },
    { Component: InfoBranchement, name: "location_and_mutation" },
  ],
  "modification-commerciale": [
    { Component: Documents, name: "documents" },
    { Component: InfoClient, name: "request_info" },
    { Component: InfoClientSuite, name: "current_owner" },
  ],
  "achat-disjoncteur": [
    { Component: Documents, name: "documents" },
    { Component: InfoClient, name: "request_info" },
    { Component: InfoDisjoncteur, name: "achat_disjoncteur_info" },
  ],
  "construction-ouvrage": [
    { Component: Documents, name: "documents" },
    { Component: InfoDemandeur, name: "new_owner" },
    { Component: InfoClientSuite, name: "current_owner" },
    { Component: InfoBranchement, name: "location_and_mutation" },
  ],
};

interface StepperProps {
  type: DemandeType;
  closeModal: () => void;
}

const Stepper: React.FC<StepperProps> = ({ type, closeModal }) => {
  const steps = stepsByType[type];
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showRecap, setShowRecap] = useState(false);
  const { user } = useAuth();

  // Refs pour conserver les données des formulaires
  const documentsRef = useRef<any>({
    new_owner_id_card: null,
    current_owner_id_card: null,
    additional_documents: [],
    certificatConforme: false,
  });

  const requestInfoRef = useRef<any>({
    country: "784",
    connection_index: 0,
    subscription_number: "",
    counter_number: "",
    old_index: 0,
    demand_number: "",
  });

  const currentOwnerRef = useRef<any>({
    firstname: "",
    lastname: "",
    email: "",
    mobile_number: "",
    id_card_number: "",
    id_card: {
      number: "",
      establishment_country: "",
      establishment_place: "",
      establishment_date: "",
    },
  });

  const newOwnerRef = useRef<any>({
    firstname: "",
    lastname: "",
    email: "",
    mobile_number: "",
    id_card_number: "",
    id_card: {
      number: "",
      establishment_country: "",
      establishment_place: "",
      establishment_date: "",
    },
  });

  const locationInfoRef = useRef<any>({
    address: "",
    city: "",
    postal_code: "",
    gps_coordinates: {
      latitude: 0,
      longitude: 0,
    },
  });

  const mutationInfoRef = useRef<any>({
    reason: "",
    details: "",
    mutation_date: "",
  });

  const branchementDataRef = useRef<any>({
    usageElectrique: "domestique",
    typeBranchement: "monophasé",
    reglageDisjoncteur: "chaud",
  });

  // Create refs for résiliation data
  const resiliationDataRef = useRef<any>({
    cause: "",
    concern: "",
    kennel: "",
    kennel_closed: "",
    kennelKeeper: {
      firstname: "",
      lastname: "",
      mobile_number: "",
    }
  });

  const resiliationSettingsRef = useRef<any>({
    subscription_type: "",
    subscriber_type: "",
  });

  // Ref pour les données de la pièce d'identité
  const idCardRef = useRef<any>({
    id_card_number: "",
    id_card_establishment_place: "",
    id_card_establishment_date: "",
    id_card_type: "",
    id_card_image: null,
    identifier: "",
  });

  const referenceContactRef = useRef<any>({
    firstname: "",
    lastname: "",
    mobile_number: "",
  });

  // Création d'une référence pour les données techniques du disjoncteur
  const disjoncteurTechnicalInfoRef = useRef<any>({
    branching_type: "",
    electricity_use: "",
    equipment_type: "",
    price_code: "",
    circuit_breaker_settings: "",
    circuit_breaker_grade: ""
  });

  const disjoncteurPersonalInfoRef = useRef<any>({
    client_firstname: "",
    client_lastname: "",
    client_reference: "",
    client_identifier: "",
    client_mobile_number: "",
    client_phone_number: ""
  });

  // Fonction pour mettre à jour les données des formulaires
  const handleFormUpdate = (formName: string, data: any) => {
    switch (formName) {
      case "documents":
        documentsRef.current = { ...documentsRef.current, ...data };
        break;
      case "request_info":
        requestInfoRef.current = { ...requestInfoRef.current, ...data };
        break;
      case "current_owner":
        currentOwnerRef.current = { ...currentOwnerRef.current, ...data };
        break;
      case "new_owner":
        newOwnerRef.current = { ...newOwnerRef.current, ...data };
        break;
      case "location_and_mutation":
        // La fonction reçoit soit des données de localisation, soit des données de mutation
        if (data.address !== undefined) {
          locationInfoRef.current = { ...locationInfoRef.current, ...data };
        } else if (data.reason !== undefined) {
          mutationInfoRef.current = { ...mutationInfoRef.current, ...data };
        } else if (data.usageElectrique !== undefined) {
          branchementDataRef.current = { ...branchementDataRef.current, ...data };
        }
        break;
      case "termination_info":
        if (data.concern !== undefined) {
          resiliationDataRef.current = { ...resiliationDataRef.current, ...data };
        } else if (data.subscription_type !== undefined) {
          resiliationSettingsRef.current = { ...resiliationSettingsRef.current, ...data };
        }
        break;
      case "achat_disjoncteur_info":
        // Ajoutez ici la logique pour gérer les données d'achat de disjoncteur
        break;
      case "id_card":
        idCardRef.current = { ...idCardRef.current, ...data };
        break;
      default:
        break;
    }
  };

  // Fonction pour soumettre le formulaire complet avec une animation de progression
  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simuler une progression visuelle
    const progressInterval = setInterval(() => {
      setSubmitProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.floor(Math.random() * 10) + 5;
      });
    }, 300);

    try {
      if (type === "mutation") {
        // Valider les données requises
        const requiredFields = [
          { ref: requestInfoRef.current.subscription_number, name: "Numéro d'abonnement" },
          { ref: requestInfoRef.current.counter_number, name: "Numéro de compteur" },
          { ref: currentOwnerRef.current.firstname, name: "Prénom de l'ancien propriétaire" },
          { ref: currentOwnerRef.current.lastname, name: "Nom de l'ancien propriétaire" },
          { ref: newOwnerRef.current.firstname, name: "Prénom du nouveau propriétaire" },
          { ref: newOwnerRef.current.lastname, name: "Nom du nouveau propriétaire" },
          { ref: newOwnerRef.current.mobile_number, name: "Téléphone du nouveau propriétaire" },
          { ref: locationInfoRef.current.address, name: "Adresse" },
          { ref: locationInfoRef.current.city, name: "Ville" },
          { ref: mutationInfoRef.current.reason, name: "Motif de mutation" },
          { ref: mutationInfoRef.current.mutation_date, name: "Date de mutation" }
        ];

        const missingFields = requiredFields
          .filter(field => !field.ref || field.ref.trim() === "")
          .map(field => field.name);

        if (missingFields.length > 0) {
          toast.error(`Veuillez remplir les champs suivants : ${missingFields.join(", ")}`);
          return;
        }

        const formData = {
          requestInfo: requestInfoRef.current,
          currentOwner: currentOwnerRef.current,
          newOwner: newOwnerRef.current,
          locationInfo: locationInfoRef.current,
          mutationInfo: mutationInfoRef.current,
          attachments: {
            newOwnerIdCard: documentsRef.current.new_owner_id_card,
            currentOwnerIdCard: documentsRef.current.current_owner_id_card,
            additionalDocuments: documentsRef.current.additional_documents,
          }
        };

        console.log("Données envoyées :", formData);

        // Appeler le service pour soumettre la demande
        const response = await demandesService.submitMutation(formData);
        console.log("Réponse du serveur :", response);

        // Progression à 100% une fois terminé
        setSubmitProgress(100);
        clearInterval(progressInterval);

        toast.success("Demande de mutation soumise avec succès!");
        setTimeout(() => {
          closeModal();
        }, 1000);
      } else if (type === "branchement" || type === "abonnement") {
        // Valider les données requises pour le branchement abonnement
        const requiredFields = [
          { ref: newOwnerRef.current.firstname, name: "Prénom du demandeur" },
          { ref: newOwnerRef.current.lastname, name: "Nom du demandeur" },
          { ref: newOwnerRef.current.mobile_number, name: "Téléphone du demandeur" },
          { ref: idCardRef.current.id_card_number, name: "Numéro de la pièce d'identité" },
          { ref: idCardRef.current.id_card_establishment_place, name: "Lieu d'établissement" },
          { ref: idCardRef.current.id_card_establishment_date, name: "Date d'établissement" },
          { ref: idCardRef.current.identifier, name: "Identifiant" },
        ];

        const missingFields = requiredFields
          .filter(field => !field.ref || field.ref.trim() === "")
          .map(field => field.name);

        if (missingFields.length > 0) {
          toast.error(`Veuillez remplir les champs suivants : ${missingFields.join(", ")}`);
          return;
        }

        // Vérifier que le document SECUREL est présent
        if (!documentsRef.current.securel) {
          toast.error("Le document SECUREL (certificat technique) est obligatoire");
          return;
        }

        // Vérifier que l'image de la pièce d'identité est présente
        if (!idCardRef.current.id_card_image) {
          toast.error("La photo de la pièce d'identité est obligatoire");
          return;
        }

        // Construire les données pour la demande de branchement abonnement
        const formData = {
          requestInfo: {
            client_id: user?._id || "",
            country: "784",
            connection_index: 0,
            counter_number: "",
            status: "PENDING",
            demand_number: ""
          },
          personalInfo: {
            owner: {
              firstname: newOwnerRef.current.firstname,
              lastname: newOwnerRef.current.lastname,
              reference: "",
              identifier: idCardRef.current.identifier,
              email: newOwnerRef.current.email,
              mobile_number: newOwnerRef.current.mobile_number,
              id_card: {
                number: idCardRef.current.id_card_number,
                establishment_place: idCardRef.current.id_card_establishment_place,
                establishment_date: idCardRef.current.id_card_establishment_date,
                attachment: idCardRef.current.id_card_image,
                type: idCardRef.current.id_card_type
              }
            },
            notificationPreferences: {
              email: newOwnerRef.current.email,
              mobile_number: newOwnerRef.current.mobile_number
            }
          },
          technicalInfo: {
            branching_type: branchementDataRef.current.typeBranchement || "monophasé",
            electricity_use: branchementDataRef.current.usageElectrique || "domestique",
            subscription_type: "0",
            power_subscription: "",
            circuit_breaker_settings: branchementDataRef.current.reglageDisjoncteur || "chaud"
          },
          attachments: {
            securel: documentsRef.current.securel,
            official_request: documentsRef.current.official_request,
            leaseholder_id_card: null,
            additionalDocuments: documentsRef.current.additional_documents
          }
        };

        console.log("Données branchement envoyées :", formData);

        // Appeler le service pour soumettre la demande
        const response = await demandesService.submitBranchementAbonnement(formData);
        console.log("Réponse du serveur :", response);

        // Progression à 100% une fois terminé
        setSubmitProgress(100);
        clearInterval(progressInterval);

        toast.success("Demande de branchement abonnement soumise avec succès!");
        setTimeout(() => {
          closeModal();
        }, 1000);
      } else if (type === "resiliation") {
        // Construire les données pour la demande de résiliation
        const formData = {
          requestInfo: {
            client_id: user?._id || "",
            subscription_number: requestInfoRef.current.subscription_number || "",
            counter_number: requestInfoRef.current.counter_number || "",
            demand_number: ""
          },
          personalInfo: {
            firstname: currentOwnerRef.current.firstname || "",
            lastname: currentOwnerRef.current.lastname || "",
            reference: "",
            identifier: currentOwnerRef.current.id_card_number || "",
            email: currentOwnerRef.current.email || "",
            phone_number: "", // Si disponible dans le formulaire
            mobile_number: currentOwnerRef.current.mobile_number || ""
          },
          referenceContact: referenceContactRef.current,
          locationInfo: {
            suburb: locationInfoRef.current.suburb || "",
            section: locationInfoRef.current.section || "",
            subsection: "", // Si disponible dans le formulaire
            operational_code: "", // Si disponible dans le formulaire
            boulevard: locationInfoRef.current.boulevard || "",
            avenue: locationInfoRef.current.avenue || "",
            street: locationInfoRef.current.street || "",
            next_to: locationInfoRef.current.next_to || "",
            country: "784",
            counter_number: requestInfoRef.current.counter_number || "",
            management_center: locationInfoRef.current.management_center || ""
          },
          technicalInfo: {
            bill_reception_way: "",
            circuit_breaker_settings: branchementDataRef.current.reglageDisjoncteur || "",
            electricity_usage: branchementDataRef.current.usageElectrique || "",
            branching_type: branchementDataRef.current.typeBranchement || "",
            equipment_type: "",
            subscriber_gender: "",
            price_code: ""
          },
          terminationInfo: resiliationDataRef.current,
          settings: resiliationSettingsRef.current,
          attachments: {
            id_card: documentsRef.current.id_card,
            additionalDocuments: documentsRef.current.additional_documents
          }
        };

        console.log("Données résiliation envoyées :", formData);

        // Appeler le service pour soumettre la demande
        const response = await demandesService.submitResiliation(formData);
        console.log("Réponse du serveur :", response);

        // Progression à 100% une fois terminé
        setSubmitProgress(100);
        clearInterval(progressInterval);

        toast.success("Demande de résiliation soumise avec succès!");
        setTimeout(() => {
          closeModal();
        }, 1000);
      } else if (type === "achat-disjoncteur") {
        // Valider les données requises pour l'achat de disjoncteur
        const requiredFields = [
          { ref: disjoncteurPersonalInfoRef.current.client_firstname, name: "Prénom du client" },
          { ref: disjoncteurPersonalInfoRef.current.client_lastname, name: "Nom du client" },
          { ref: disjoncteurPersonalInfoRef.current.client_mobile_number, name: "Numéro de téléphone du client" },
          { ref: requestInfoRef.current.counter_number, name: "Numéro de compteur" }
        ];

        const missingFields = requiredFields
          .filter(field => !field.ref || field.ref.trim() === "")
          .map(field => field.name);

        if (missingFields.length > 0) {
          toast.error(`Veuillez remplir les champs suivants : ${missingFields.join(", ")}`);
          return;
        }

        // Construire les données pour la demande d'achat de disjoncteur
        const formData = {
          requestInfo: {
            client_id: user?._id || "",
            country: "784",
            counter_number: requestInfoRef.current.counter_number || "",
            codexp: requestInfoRef.current.codexp || ""
          },
          personalInfo: {
            client_firstname: disjoncteurPersonalInfoRef.current.client_firstname || "",
            client_lastname: disjoncteurPersonalInfoRef.current.client_lastname || "",
            client_reference: disjoncteurPersonalInfoRef.current.client_reference || "",
            client_identifier: disjoncteurPersonalInfoRef.current.client_identifier || "",
            client_mobile_number: disjoncteurPersonalInfoRef.current.client_mobile_number || "",
            client_phone_number: disjoncteurPersonalInfoRef.current.client_phone_number || ""
          },
          technicalInfo: {
            branching_type: disjoncteurTechnicalInfoRef.current.branching_type || "",
            electricity_use: disjoncteurTechnicalInfoRef.current.electricity_use || "",
            equipment_type: disjoncteurTechnicalInfoRef.current.equipment_type || "",
            price_code: disjoncteurTechnicalInfoRef.current.price_code || "",
            circuit_breaker_settings: disjoncteurTechnicalInfoRef.current.circuit_breaker_settings || "",
            circuit_breaker_grade: disjoncteurTechnicalInfoRef.current.circuit_breaker_grade || ""
          }
        };

        console.log("Données achat disjoncteur envoyées :", formData);

        // Appeler le service pour soumettre la demande
        const response = await demandesService.submitAchatDisjoncteur(formData);
        console.log("Réponse du serveur :", response);

        // Progression à 100% une fois terminé
        setSubmitProgress(100);
        clearInterval(progressInterval);

        toast.success("Demande d'achat de disjoncteur soumise avec succès!");
        setTimeout(() => {
          closeModal();
        }, 1000);
      } else {
        // Pour les autres types de demande
        setSubmitProgress(100);
        clearInterval(progressInterval);
        setTimeout(() => {
          closeModal();
        }, 1000);
      }
    } catch (error: any) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      const errorMessage = error.message || "Erreur lors de la soumission de la demande";
      ToastifyDetailedError(errorMessage);
      clearInterval(progressInterval);
      setSubmitProgress(0);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitProgress(0);
      }, 500);
    }
  };

  // Fonction pour afficher le récapitulatif
  const handleShowRecap = () => {
    setShowRecap(true);
  };

  // Fonction de rendu du récapitulatif
  const renderRecap = () => {
    const renderField = (label: string, value: string | number | null | undefined) => {
      if (value === null || value === undefined || value === '') return null;
      return (
        <div className="flex flex-col mb-3">
          <span className="text-xs text-gray-500">{label}</span>
          <span className="text-sm font-medium text-gray-800">{value}</span>
        </div>
      );
    };

    let recapContent: React.ReactNode = null;

    if (type === "mutation") {
      recapContent = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Informations de l'abonnement</h4>
            {renderField("Numéro d'abonnement", requestInfoRef.current.subscription_number)}
            {renderField("Numéro de compteur", requestInfoRef.current.counter_number)}
            {renderField("Index de connexion", requestInfoRef.current.connection_index)}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Ancien propriétaire</h4>
            {renderField("Nom", currentOwnerRef.current.lastname)}
            {renderField("Prénom", currentOwnerRef.current.firstname)}
            {renderField("Email", currentOwnerRef.current.email)}
            {renderField("Téléphone", currentOwnerRef.current.mobile_number)}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Nouveau propriétaire</h4>
            {renderField("Nom", newOwnerRef.current.lastname)}
            {renderField("Prénom", newOwnerRef.current.firstname)}
            {renderField("Email", newOwnerRef.current.email)}
            {renderField("Téléphone", newOwnerRef.current.mobile_number)}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Informations de localisation</h4>
            {renderField("Adresse", locationInfoRef.current.address)}
            {renderField("Ville", locationInfoRef.current.city)}
            {renderField("Code postal", locationInfoRef.current.postal_code)}
          </div>
        </div>
      );
    } else if (type === "branchement" || type === "abonnement") {
      recapContent = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Informations du demandeur</h4>
            {renderField("Nom", newOwnerRef.current.lastname)}
            {renderField("Prénom", newOwnerRef.current.firstname)}
            {renderField("Email", newOwnerRef.current.email)}
            {renderField("Téléphone", newOwnerRef.current.mobile_number)}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Pièce d'identité</h4>
            {renderField("Numéro", idCardRef.current.id_card_number)}
            {renderField("Lieu d'établissement", idCardRef.current.id_card_establishment_place)}
            {renderField("Date d'établissement", idCardRef.current.id_card_establishment_date)}
            {renderField("Type de pièce", idCardRef.current.id_card_type)}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg col-span-1 md:col-span-2">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Informations techniques</h4>
            <div className="grid grid-cols-2 gap-3">
              {renderField("Usage électrique", branchementDataRef.current.usageElectrique)}
              {renderField("Type de branchement", branchementDataRef.current.typeBranchement)}
              {renderField("Réglage disjoncteur", branchementDataRef.current.reglageDisjoncteur)}
            </div>
          </div>
        </div>
      );
    } else if (type === "achat-disjoncteur") {
      recapContent = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Informations du client</h4>
            {renderField("Nom", disjoncteurPersonalInfoRef.current.client_lastname)}
            {renderField("Prénom", disjoncteurPersonalInfoRef.current.client_firstname)}
            {renderField("Référence", disjoncteurPersonalInfoRef.current.client_reference)}
            {renderField("Téléphone", disjoncteurPersonalInfoRef.current.client_mobile_number)}
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Informations de la demande</h4>
            {renderField("Numéro de compteur", requestInfoRef.current.counter_number)}
            {renderField("Type de branchement", disjoncteurTechnicalInfoRef.current.branching_type)}
            {renderField("Usage électrique", disjoncteurTechnicalInfoRef.current.electricity_use)}
          </div>
        </div>
      );
    } else {
      // Récapitulatif générique pour les autres types de demande
      recapContent = (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Récapitulatif de votre demande</h4>
          <p className="text-sm text-gray-600">Type de demande: <span className="font-medium">{type.replace('-', ' ')}</span></p>
          {type === "resiliation" && (
            <>
              {renderField("Numéro d'abonnement", requestInfoRef.current.subscription_number)}
              {renderField("Numéro de compteur", requestInfoRef.current.counter_number)}
              {renderField("Cause de résiliation", resiliationDataRef.current.cause)}
            </>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800 font-medium">
                Veuillez vérifier les informations de votre demande avant de la soumettre
              </p>
            </div>
          </div>
        </div>

        {recapContent}

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                En soumettant cette demande, vous certifiez que les informations fournies sont exactes et complètes.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fonction pour raccourcir les libellés trop longs
  const getShortenedLabel = (label: string) => {
    // Raccourcir les libellés trop longs et prendre juste le premier mot
    const words = label.split(' ');
    return words[0];
  };

  // Fonction pour changer d'étape avec animation
  const changeStep = (newStep: number) => {
    if (newStep === currentStep) return;

    setIsAnimating(true);
    setDirection(newStep > currentStep ? 'next' : 'prev');

    // Attendre que l'animation de sortie se termine
    setTimeout(() => {
      setCurrentStep(newStep);

      // Attendre un peu pour que le nouveau contenu s'initialise
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 300);
  };

  // Render the appropriate component based on the type and current step
  const renderStepContent = () => {
    // Si on doit afficher le récapitulatif, le faire avant la soumission finale
    if (showRecap) {
      return renderRecap();
    }

    const components = componentsByType[type];
    if (currentStep < components.length) {
      const { Component, name } = components[currentStep];

      // Vérifier le type de composant pour passer les bonnes props
      if (Component === InfoClientSuite) {
        return <InfoClientSuite
          endpoint={type}
          name={name as "current_owner" | "termination_info"}
          updateFormData={(data: any) => handleFormUpdate(name, data)}
        />;
      } else if (Component === InfoDisjoncteur && type === "achat-disjoncteur") {
        return <InfoDisjoncteur
          endpoint="achat-disjoncteur"
          updateFormData={(data: any) => handleFormUpdate("achat_disjoncteur_info", data)}
        />;
      } else {
        return <Component
          endpoint={type}
          updateFormData={(data: any) => handleFormUpdate(name, data)}
        />;
      }
    }
    return (
      <p className="text-gray-600 text-sm">
        Formulaire de l'étape {currentStep + 1}
      </p>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-4 md:px-6">
      {/* Mobile Step Title - Displays only the current step */}
      <div className="text-center mb-2">
        <h3 className="text-sm font-medium text-gray-800">
          Étape {currentStep + 1}: <span className="text-red-500">{showRecap ? 'Récapitulatif' : steps[currentStep]}</span>
        </h3>
      </div>

      {/* Stepper Progress Bar */}
      <div className="mb-8">
        <div className="px-4 relative">
          {/* Main Progress Line */}
          <div className="absolute top-4 left-0 right-0 h-[2px] bg-gray-200"></div>

          {/* Active Progress Line */}
          <div
            className="absolute top-4 left-0 h-[2px] bg-red-500 transition-all duration-500 ease-out"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`
            }}
          ></div>

          {/* Steps */}
          <div className="flex justify-between relative">
            {steps.map((stepLabel, index) => {
              // Determine step status
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const isPending = index > currentStep;

              return (
                <div
                  key={index}
                  className={`flex flex-col items-center ${isCompleted ? "cursor-pointer" : ""}`}
                  onClick={() => isCompleted && changeStep(index)}
                  role="button"
                  tabIndex={isCompleted ? 0 : -1}
                  aria-label={`Étape ${index + 1}: ${stepLabel} ${isCompleted ? '(complétée)' : isCurrent ? '(en cours)' : '(à venir)'}`}
                >
                  {/* Step Circle */}
                  <div
                    className={`
                      group relative flex items-center justify-center w-8 h-8 rounded-full
                      shadow-sm transition-all duration-300 ease-in-out
                      ${isCompleted ? "bg-green-500 text-white" :
                        isCurrent ? "bg-red-500 text-white" :
                          "bg-white border-2 border-gray-200 text-gray-500"}
                    `}
                    title={stepLabel}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <span className="text-xs font-semibold">{index + 1}</span>
                    )}

                    {/* Tooltip that appears on hover */}
                    <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap transition-opacity duration-200 pointer-events-none">
                      {stepLabel}
                    </div>
                  </div>

                  {/* Step Number - Small digit below */}
                  <div className="mt-1 text-center">
                    <span className={`
                      text-xs font-medium select-none
                      transition-all duration-300 ease-in-out
                      ${isCurrent ? "text-red-500 font-semibold" :
                        isCompleted ? "text-green-600" : "text-gray-400"}
                    `}>
                      {index + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step description row - Display shortened labels */}
      <div className="flex justify-between px-2 pb-6 text-center">
        {steps.map((stepLabel, index) => (
          <div
            key={index}
            className="flex-1 px-1"
          >
            <span className={`
              text-xs block truncate
              ${index === currentStep ? "text-red-500 font-semibold" :
                index < currentStep ? "text-gray-700" : "text-gray-400"}
            `}>
              {getShortenedLabel(stepLabel)}
            </span>
          </div>
        ))}
      </div>

      {/* Form Content with animation */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden mb-8 transition-all duration-300 ease-in-out">
        <div className="p-5 md:p-7 relative">
          <div
            className={`
              transition-all duration-300 ease-in-out
              ${isAnimating ?
                (direction === 'next' ?
                  'opacity-0 transform translate-x-10' :
                  'opacity-0 transform -translate-x-10') :
                'opacity-100 transform translate-x-0'}
            `}
          >
            {renderStepContent()}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          className={`
            relative overflow-hidden px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
            ${(currentStep === 0 || isAnimating) && !showRecap
              ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-70"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 focus:ring-2 focus:ring-gray-200 focus:outline-none"}
            group
          `}
          onClick={() => {
            if (showRecap) {
              setShowRecap(false);
            } else if (currentStep > 0 && !isAnimating) {
              changeStep(currentStep - 1);
            }
          }}
          disabled={(currentStep === 0 || isAnimating) && !showRecap}
          aria-label="Étape précédente"
        >
          <span className="flex items-center">
            <svg
              className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {showRecap ? "Retour" : "Précédent"}
          </span>
        </button>

        {showRecap ? (
          <button
            type="button"
            className={`
              relative overflow-hidden px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 
              ${isSubmitting || isAnimating
                ? "bg-red-600 text-white cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-2 focus:ring-red-300 focus:outline-none"}
            `}
            onClick={handleSubmit}
            disabled={isSubmitting || isAnimating}
            aria-label={isSubmitting ? "Envoi en cours" : "Soumettre la demande"}
          >
            {isSubmitting ? (
              <>
                <div className="absolute inset-0 flex items-center justify-center bg-red-600 z-10">
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>{submitProgress}%</span>
                  </div>
                </div>
                <div
                  className="absolute bottom-0 left-0 h-1 bg-white"
                  style={{ width: `${submitProgress}%`, transition: 'width 0.3s ease-out' }}
                ></div>
                <span className="opacity-0">Envoi en cours...</span>
              </>
            ) : (
              <span className="flex items-center">
                Soumettre
                <svg
                  className="w-4 h-4 ml-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </button>
        ) : (
          currentStep < steps.length - 1 ? (
            <button
              type="button"
              className={`
                relative overflow-hidden px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
                ${isAnimating
                  ? "bg-gray-400 text-white cursor-not-allowed opacity-70"
                  : "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-2 focus:ring-red-300 focus:outline-none"}
                group
              `}
              onClick={() => !isAnimating && changeStep(currentStep + 1)}
              disabled={isAnimating}
              aria-label="Étape suivante"
            >
              <span className="flex items-center">
                Suivant
                <svg
                  className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          ) : (
            <button
              type="button"
              className={`
                relative overflow-hidden px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
                group
                bg-green-500 text-white hover:bg-green-600 active:bg-green-700 focus:ring-2 focus:ring-green-300 focus:outline-none
              `}
              onClick={handleShowRecap}
              aria-label="Récapitulatif de la demande"
            >
              <span className="flex items-center">
                Vérifier et valider
                <svg
                  className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 14l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Stepper;
