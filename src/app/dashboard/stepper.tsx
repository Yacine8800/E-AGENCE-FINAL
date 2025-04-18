import React, { useState } from "react";
import { clsx } from "clsx";
import InfoClient from "./demandes/InfoClient";
import InfoClientSuite from "./demandes/InfoClientSuite";
import InfoDemandeur from "./demandes/InfoDemandeur";
import InfoBranchement from "./demandes/InfoBranchement";
import Documents from "./demandes/Documents";

// Définition des étapes par type de demande
const stepsByType = {
  mutation: [
    "Infos de l'ancien client",
    "Infos de l'ancien client",
    "Infos du nouveau client",
    "Infos sur le branchement",
    "Joindre les documents",
  ],
  reabonnement: [
    "Infos de l'ancien client",
    "Infos de l'ancien client",
    "Infos du nouveau client",
    "Infos sur le branchement",
    "Joindre les documents",
  ],
  branchement: [
    "Joindre les documents du demandeur",
    "Infos du demandeur",
    "Infos localisation",
  ],
};

// Définition des composants à utiliser pour chaque étape et type
const componentsByType = {
  mutation: [
    InfoClient,
    InfoClientSuite,
    InfoDemandeur,
    InfoBranchement,
    Documents,
  ],
  reabonnement: [
    InfoClient,
    InfoClientSuite,
    InfoDemandeur,
    InfoBranchement,
    Documents,
  ],
  branchement: [
    Documents,
    InfoDemandeur,
    InfoBranchement,
  ],
};

interface StepperProps {
  type: "mutation" | "reabonnement" | "branchement";
  closeModal: () => void;
}

const Stepper: React.FC<StepperProps> = ({ type, closeModal }) => {
  const steps = stepsByType[type];
  const [currentStep, setCurrentStep] = useState(0);

  // Render the appropriate component based on the type and current step
  const renderStepContent = () => {
    const components = componentsByType[type];
    if (currentStep < components.length) {
      const StepComponent = components[currentStep];
      return <StepComponent endpoint={type} />;
    }
    return <p className="text-gray-600 text-sm">Formulaire de l'étape {currentStep + 1}</p>;
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header avec le stepper - fixé en haut */}
      <div className="sticky top-0 z-10 pt-4 pb-6 border-b bg-white">
        {/* Barre de progression */}
        <div className="flex items-center justify-center gap-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              {/* Cercle du step */}
              <div
                className={clsx(
                  "w-10 h-10 border-primary flex items-center justify-center rounded-full border-2 transition-all font-bold",
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
                    "w-10 h-1 ml-4 transition-all",
                    currentStep > index ? "bg-primary" : "bg-gray-300"
                  )}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Titre de l'étape actuelle */}
        <div className="text-center mt-4">
          <h2 className="text-lg font-semibold text-primary">
            {steps[currentStep]}
          </h2>
        </div>
      </div>

      {/* Contenu Dynamique - occupe l'espace du milieu avec défilement masqué */}
      <div className="flex-grow overflow-y-auto py-6 scrollbar-hide" 
           style={{ 
             scrollbarWidth: 'none', 
             msOverflowStyle: 'none',
             WebkitOverflowScrolling: 'touch'
           }}>
        {renderStepContent()}
      </div>

      {/* Boutons de navigation - fixés en bas en colonne */}
      <div className="mt-auto pt-6 pb-6 flex flex-row gap-4 px-6 border-t bg-white">
        <button
          className="w-full rounded-full bg-primary text-white font-semibold py-4 hover:bg-red-600"
          onClick={() =>
            currentStep === steps.length - 1 ? closeModal() : setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))
          }
        >
          {currentStep === steps.length - 1 ? "Enregistrer" : "Suivant"}
        </button>

        <button
          className="w-full rounded-full text-primary border-2 border-primary font-semibold py-4 hover:bg-gray-100"
          disabled={currentStep === 0}
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
        >
          Précédent
        </button>
      </div>
    </div>
  );
};

export default Stepper;
