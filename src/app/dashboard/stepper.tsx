import React, { useState, useRef } from "react";
import { clsx } from "clsx";
import InfoClient from "./demandes/InfoClient";
import InfoClientSuite from "./demandes/InfoClientSuite";
import InfoDemandeur from "./demandes/InfoDemandeur";
import InfoBranchement from "./demandes/InfoBranchement";
import InfoDisjoncteur from "./demandes/InfoDisjoncteur";
import Documents from "./demandes/Documents";
import demandesService from "../services/demandesService";
import { toast } from "react-toastify";
import { ToastifyDetailedError } from "../../../utils/toast";
import { DemandeType } from "../constants/demandes";

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
    "Infos du demandeur",
    "Infos localisation",
  ],
  abonnement: [
    "Joindre les documents du demandeur",
    "Infos du demandeur",
    "Infos localisation",
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
    { Component: InfoDemandeur, name: "new_owner" },
    { Component: InfoBranchement, name: "location_and_mutation" },
  ],
  abonnement: [
    { Component: Documents, name: "documents" },
    { Component: InfoDemandeur, name: "new_owner" },
    { Component: InfoBranchement, name: "location_and_mutation" },
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

  // Fonction pour mettre à jour les données de chaque étape
  const updateFormData = (step: number, data: any) => {
    const formName = componentsByType[type][step].name;

    switch (formName) {
      case "documents":
        documentsRef.current = data;
        break;
      case "request_info":
        requestInfoRef.current = data;
        break;
      case "current_owner":
        currentOwnerRef.current = data;
        break;
      case "new_owner":
        newOwnerRef.current = data;
        break;
      case "location_and_mutation":
        // Mise à jour des données de location et mutation
        if (data.locationData) locationInfoRef.current = data.locationData;
        if (data.mutationData) mutationInfoRef.current = data.mutationData;
        if (data.branchementData) branchementDataRef.current = data.branchementData;
        break;
      case "achat_disjoncteur_info":
        console.log("Mise à jour des données de disjoncteur:", data);
        // Logique spécifique pour l'achat de disjoncteur
        if (data.personalInfo) disjoncteurPersonalInfoRef.current = data.personalInfo;
        if (data.technicalInfo) disjoncteurTechnicalInfoRef.current = data.technicalInfo;
        break;
      case "termination_info":
        // Pour les informations de résiliation
        if (data) resiliationDataRef.current = data;
        break;
      default:
        console.log("Type de formulaire non reconnu:", formName);
        break;
    }
  };

  // Fonction pour soumettre le formulaire complet
  const handleSubmit = async () => {
    setIsSubmitting(true);

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

        toast.success("Demande de mutation soumise avec succès!");
        setTimeout(() => {
          closeModal();
        }, 2000);
      } else if (type === "branchement" || type === "abonnement") {
        // Valider les données requises pour le branchement abonnement
        const requiredFields = [
          { ref: newOwnerRef.current.firstname, name: "Prénom du demandeur" },
          { ref: newOwnerRef.current.lastname, name: "Nom du demandeur" },
          { ref: newOwnerRef.current.mobile_number, name: "Téléphone du demandeur" },
          { ref: locationInfoRef.current.address, name: "Adresse" },
          { ref: locationInfoRef.current.city, name: "Ville" }
        ];

        const missingFields = requiredFields
          .filter(field => !field.ref || field.ref.trim() === "")
          .map(field => field.name);

        if (missingFields.length > 0) {
          toast.error(`Veuillez remplir les champs suivants : ${missingFields.join(", ")}`);
          return;
        }

        // Construire les données pour la demande de branchement abonnement
        const formData = {
          requestInfo: {
            client_id: localStorage.getItem('userId') || "",
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
              identifier: newOwnerRef.current.id_card.number,
              email: newOwnerRef.current.email,
              mobile_number: newOwnerRef.current.mobile_number,
              id_card: {
                number: newOwnerRef.current.id_card.number,
                establishment_place: newOwnerRef.current.id_card.establishment_place,
                establishment_date: newOwnerRef.current.id_card.establishment_date,
                attachment: ""
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
            leaseholder_id_card: documentsRef.current.leaseholder_id_card,
            additionalDocuments: documentsRef.current.additional_documents
          }
        };

        console.log("Données branchement envoyées :", formData);

        // Appeler le service pour soumettre la demande
        const response = await demandesService.submitBranchementAbonnement(formData);
        console.log("Réponse du serveur :", response);

        toast.success("Demande de branchement abonnement soumise avec succès!");
        setTimeout(() => {
          closeModal();
        }, 2000);
      } else if (type === "resiliation") {
        // Construire les données pour la demande de résiliation
        const formData = {
          requestInfo: {
            client_id: localStorage.getItem('userId') || "",
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

        toast.success("Demande de résiliation soumise avec succès!");
        setTimeout(() => {
          closeModal();
        }, 2000);
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
            client_id: localStorage.getItem('userId') || "",
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

        toast.success("Demande d'achat de disjoncteur soumise avec succès!");
        setTimeout(() => {
          closeModal();
        }, 2000);
      } else {
        // Pour les autres types de demande
        closeModal();
      }
    } catch (error: any) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      const errorMessage = error.message || "Erreur lors de la soumission de la demande";
      ToastifyDetailedError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the appropriate component based on the type and current step
  const renderStepContent = () => {
    const components = componentsByType[type];
    if (currentStep < components.length) {
      const { Component, name } = components[currentStep];

      // Vérifier le type de composant pour passer les bonnes props
      if (Component === InfoClientSuite) {
        return <InfoClientSuite
          endpoint={type}
          name={name as "current_owner" | "termination_info"}
          updateFormData={(data: any) => updateFormData(currentStep, data)}
        />;
      } else if (Component === InfoDisjoncteur && type === "achat-disjoncteur") {
        return <InfoDisjoncteur
          endpoint="achat-disjoncteur"
          updateFormData={(data: any) => updateFormData(currentStep, data)}
        />;
      } else {
        return <Component
          endpoint={type}
          updateFormData={(data: any) => updateFormData(currentStep, data)}
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
    <div className="w-full h-full flex flex-col">
      {/* Header avec le stepper - fixé en haut */}
      <div className="sticky top-0 z-10 pt-4 pb-6 border-b bg-white">
        {/* Barre de progression */}
        <div className="flex items-center justify-center gap-2 md:gap-4 overflow-x-auto px-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center min-w-fit">
              {/* Cercle du step */}
              <div
                className={clsx(
                  "w-8 h-8 md:w-10 md:h-10 border-primary flex items-center justify-center rounded-full border-2 transition-all font-bold text-sm md:text-base",
                  currentStep > index
                    ? "bg-primary text-white border-primary"
                    : currentStep === index
                      ? "bg-primary text-white border-primary"
                      : "border-primary text-primary bg-white"
                )}
              >
                {currentStep > index ? "✔" : index + 1}
              </div>

              {/* Barre de connexion */}
              {index < steps.length - 1 && (
                <div
                  className={clsx(
                    "w-6 md:w-10 h-1 ml-2 md:ml-4 transition-all",
                    currentStep > index ? "bg-primary" : "bg-gray-300"
                  )}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Titre de l'étape actuelle */}
        <div className="text-center mt-4 px-4">
          <h2 className="text-base md:text-lg font-semibold text-primary">
            {steps[currentStep]}
          </h2>
        </div>
      </div>

      {/* Contenu Dynamique - occupe l'espace du milieu avec défilement masqué */}
      <div
        className="flex-grow overflow-y-auto py-6 scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {renderStepContent()}
      </div>

      {/* Boutons de navigation - fixés en bas en colonne */}
      <div className="mt-auto pt-6 pb-6 flex flex-row gap-4 px-6 border-t bg-white">
        <button
          className="w-full rounded-full text-primary border-2 border-primary font-semibold py-4 hover:bg-gray-100"
          disabled={currentStep === 0 || isSubmitting}
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
        >
          Précédent
        </button>
        <button
          className="w-full rounded-full bg-primary text-white font-semibold py-4 hover:bg-red-600"
          disabled={isSubmitting}
          onClick={() =>
            currentStep === steps.length - 1
              ? handleSubmit()
              : setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))
          }
        >
          {isSubmitting
            ? "Envoi en cours..."
            : currentStep === steps.length - 1
              ? "Enregistrer"
              : "Suivant"}
        </button>
      </div>
    </div>
  );
};

export default Stepper;
