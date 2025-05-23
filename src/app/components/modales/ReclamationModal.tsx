import {
  useGetCommunesQuery,
  useGetQuartiersQuery,
  useGetSousQuartiersQuery,
} from "@/src/services/referencedata";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import Drawer from "../organism/Drawer";
import {
  CustomCheckbox,
  CustomInput,
  CustomRadio,
  DynamicSelect,
} from "./form-components";

// Types
interface ReferenceData {
  id: string;
  label: string;
  value: string;
}

interface ContactPerson {
  lastName: string;
  firstName: string;
  phoneNumber: string;
}

interface ReclamationFormData {
  // Step 1
  forSelf: boolean;
  lastName: string;
  firstName: string;
  clientId: string;
  reference: string;
  phoneNumber: string;
  email: string;
  commune: string;
  quartier: string;
  sousQuartier: string;

  // Step 2
  contactPerson: ContactPerson;

  // Step 3
  reclamationType: string;
  motif: string;
  certifiedConforme: boolean;
}

interface ReclamationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReclamationFormData) => void;
}

// Composants de chargement
const Loader: React.FC = () => (
  <div className="flex items-center justify-center">
    <div className="relative w-5 h-5">
      <div className="absolute inset-0 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
      <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
    </div>
  </div>
);

const SubmissionOverlay: React.FC<{ isSubmitting: boolean }> = ({
  isSubmitting,
}) => (
  <AnimatePresence>
    {isSubmitting && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
      >
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 border-4 border-[#EB4F47]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#EB4F47] rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-[#EB4F47] rounded-full animate-ping"></div>
          </div>
        </div>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-700 font-medium text-lg"
        >
          Traitement en cours...
        </motion.p>
      </motion.div>
    )}
  </AnimatePresence>
);

// Composant principal
const ReclamationModal: React.FC<ReclamationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // RTK Query hooks
  const {
    data: communes = [],
    isLoading: isLoadingCommunes,
    error: communesError,
  } = useGetCommunesQuery(undefined, { skip: !isOpen });

  const {
    data: quartiers = [],
    isLoading: isLoadingQuartiers,
    error: quartiersError,
  } = useGetQuartiersQuery(undefined, { skip: !isOpen });

  const {
    data: sousQuartiers = [],
    isLoading: isLoadingSousQuartiers,
    error: sousQuartiersError,
  } = useGetSousQuartiersQuery(undefined, { skip: !isOpen });

  const isLoadingData =
    isLoadingCommunes || isLoadingQuartiers || isLoadingSousQuartiers;

  // État du formulaire
  const [formData, setFormData] = useState<ReclamationFormData>({
    forSelf: true,
    lastName: "",
    firstName: "",
    clientId: "",
    reference: "",
    phoneNumber: "",
    email: "",
    commune: "",
    quartier: "",
    sousQuartier: "",
    contactPerson: {
      lastName: "",
      firstName: "",
      phoneNumber: "",
    },
    reclamationType: "Facture",
    motif: "",
    certifiedConforme: false,
  });

  // Gestion des erreurs
  useEffect(() => {
    if (communesError || quartiersError || sousQuartiersError) {
      console.error("Erreur lors du chargement des données de référence:", {
        communesError,
        quartiersError,
        sousQuartiersError,
      });
    }
  }, [communesError, quartiersError, sousQuartiersError]);

  // Formatage des données de référence
  const formatReferenceData = (data: any[]): ReferenceData[] => {
    return data.map((item) => ({
      id: item.id,
      label: item.name,
      value: item.id,
    }));
  };

  // Gestionnaires d'événements
  const handleChange = useRef(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target as HTMLInputElement;
      const isCheckbox = type === "checkbox";
      const newValue = isCheckbox
        ? (e.target as HTMLInputElement).checked
        : value;

      setFormData((prevState) => {
        if (name.includes(".")) {
          const [parent, child] = name.split(".");
          if (parent === "contactPerson") {
            return {
              ...prevState,
              contactPerson: {
                ...prevState.contactPerson,
                [child]: newValue,
              },
            };
          }
          return prevState;
        }
        return {
          ...prevState,
          [name]: newValue,
        };
      });
    }
  ).current;

  const handleRadioChange = useRef((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      forSelf: name === "reclamationFor" ? value === "self" : prevState.forSelf,
      reclamationType:
        name === "reclamationType" ? value : prevState.reclamationType,
    }));
  }).current;

  // Réinitialisation du formulaire
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Réclamation">
      {/* Stepper */}
      <div className="w-full mb-8">
        <div className="relative flex items-center justify-between">
          {/* Ligne de progression */}
          <div className="absolute left-0 right-0 h-1 bg-gray-200 rounded">
            <div
              className="h-full bg-[#EB4F47] rounded transition-all duration-500"
              style={{
                width:
                  currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
              }}
            ></div>
          </div>
          {/* Indicateurs d'étape */}
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300 ${
                currentStep >= step ? "bg-[#EB4F47]" : "bg-gray-300"
              }`}
            >
              {currentStep > step ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                step
              )}
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="relative">
        <SubmissionOverlay isSubmitting={isSubmitting} />
        {/* Contenu du formulaire par étape */}
        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Informations personnelles
              </h3>
              <div className="mb-6 bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center space-x-8 mb-1">
                  <CustomRadio
                    name="reclamationFor"
                    value="self"
                    checked={formData.forSelf}
                    onChange={handleRadioChange}
                    label="Réclamation pour soi-même"
                  />
                  <CustomRadio
                    name="reclamationFor"
                    value="other"
                    checked={!formData.forSelf}
                    onChange={handleRadioChange}
                    label="Réclamation pour un tiers"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  label="Nom"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Nom"
                  required
                />
                <CustomInput
                  label="Prénoms"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Prénoms"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  label="Identifiant client"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  placeholder="Identifiant Client"
                />
                <CustomInput
                  label="Référence"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  placeholder="Référence"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  label="Numéro de téléphone"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Numéro De Téléphone"
                  type="tel"
                  required
                />
                <CustomInput
                  label="Adresse e-mail"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Adresse E-Mail"
                  type="email"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <DynamicSelect
                  label="Commune"
                  name="commune"
                  value={formData.commune}
                  onChange={handleChange}
                  options={formatReferenceData(communes)}
                  required
                  isLoading={isLoadingCommunes}
                  hasError={!!communesError}
                />
                <DynamicSelect
                  label="Quartier"
                  name="quartier"
                  value={formData.quartier}
                  onChange={handleChange}
                  options={formatReferenceData(quartiers)}
                  required
                  isLoading={isLoadingQuartiers}
                  hasError={!!quartiersError}
                />
                <DynamicSelect
                  label="Sous quartier"
                  name="sousQuartier"
                  value={formData.sousQuartier}
                  onChange={handleChange}
                  options={formatReferenceData(sousQuartiers)}
                  required
                  isLoading={isLoadingSousQuartiers}
                  hasError={!!sousQuartiersError}
                />
              </div>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Informations de contact
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <CustomInput
                  label="Nom"
                  name="contactPerson.lastName"
                  value={formData.contactPerson.lastName}
                  onChange={handleChange}
                  placeholder="Nom"
                />
                <CustomInput
                  label="Prénoms"
                  name="contactPerson.firstName"
                  value={formData.contactPerson.firstName}
                  onChange={handleChange}
                  placeholder="Prénoms"
                />
              </div>
              <CustomInput
                label="Numéro de téléphone"
                name="contactPerson.phoneNumber"
                value={formData.contactPerson.phoneNumber}
                onChange={handleChange}
                placeholder="Numéro De Téléphone"
                type="tel"
              />
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Détails de la réclamation
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { value: "Facture", label: "Facture" },
                  { value: "Service", label: "Service" },
                  { value: "Produits", label: "Produits" },
                  { value: "NMPF", label: "NMPF" },
                  { value: "Prepaiement", label: "Prépaiement" },
                  { value: "Achat Energie", label: "Achat Énergie" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`border-2 rounded-xl p-4 flex items-center space-x-3 cursor-pointer transition-all ${
                      formData.reclamationType === option.value
                        ? "border-[#EB4F47] bg-[#FEF0F0] shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <CustomRadio
                      name="reclamationType"
                      value={option.value}
                      checked={formData.reclamationType === option.value}
                      onChange={handleRadioChange}
                      label={option.label}
                    />
                  </label>
                ))}
              </div>

              <div className="mb-4">
                <label className="block mb-1.5 text-sm font-medium text-gray-700">
                  Motif <span className="text-[#EB4F47]">*</span>
                </label>
                <textarea
                  name="motif"
                  value={formData.motif}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB4F47]/20 focus:border-[#EB4F47] transition-all duration-200 min-h-[120px] shadow-sm"
                  placeholder="Description Ici ..."
                  required
                ></textarea>
              </div>

              <div className="mt-8">
                <CustomCheckbox
                  name="certifiedConforme"
                  checked={formData.certifiedConforme}
                  onChange={handleChange}
                  label="Certifié conforme"
                  required
                />
              </div>
            </div>
          )}
        </div>
        {/* Boutons de navigation */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#EB4F47] text-base font-medium text-white hover:bg-[#d43f37] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EB4F47] sm:ml-3 sm:w-auto sm:text-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader />
            ) : currentStep === 3 ? (
              "Soumettre"
            ) : (
              "Suivant"
            )}
          </button>
          <button
            type="button"
            onClick={goBack}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EB4F47] sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            {currentStep === 1 ? "Annuler" : "Retour"}
          </button>
        </div>
      </form>
    </Drawer>
  );
};

export default ReclamationModal;
