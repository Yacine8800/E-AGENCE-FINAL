import React, { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Interface pour les propriétés du composant formulaire
interface FormComponentProps {
  messageId: string;
  contentIndex: number;
  formFields: {
    id: string;
    name: string;
    required: boolean;
    value: string;
    type: string;
  }[];
  onSubmit: (messageId: string, contentIndex: number, formData: any) => void;
  theme: any;
}

const FormComponent = ({ messageId, contentIndex, formFields, onSubmit, theme }: FormComponentProps) => {
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialiser les valeurs du formulaire
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    formFields.forEach((field) => {
      initialValues[field.id] = field.value || "";
    });
    setFormValues(initialValues);
  }, [formFields]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    formFields.forEach((field) => {
      if (field.required && !formValues[field.id]) {
        newErrors[field.id] = "Ce champ est obligatoire";
        isValid = false;
      } else if (field.type === "email" && formValues[field.id]) {
        // Valider l'email avec une expression régulière simple
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formValues[field.id])) {
          newErrors[field.id] = "Format d'email invalide";
          isValid = false;
        }
      } else if (field.type === "string" && field.id === "telephone" && formValues[field.id]) {
        // Valider le numéro de téléphone
        const phoneRegex = /^\d{10,}$/;
        if (!phoneRegex.test(formValues[field.id].replace(/\s/g, ''))) {
          newErrors[field.id] = "Format de téléphone invalide";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (id: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
    
    // Effacer l'erreur lorsque l'utilisateur commence à saisir
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(messageId, contentIndex, formValues);
      setIsSubmitted(true);
      setIsExpanded(false);
    }
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative my-2 bg-black/20 rounded-lg overflow-hidden transition-all duration-300">
      {/* En-tête de formulaire avec bouton pour réduire/agrandir */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h3 className="text-lg font-medium">
          {isSubmitted ? "Formulaire soumis" : "Formulaire"}
        </h3>
        <button 
          onClick={toggleExpand} 
          className="p-1 hover:bg-gray-700 rounded-md transition-colors"
          type="button"
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
            className="transition-transform duration-300" 
            style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)' }}
          >
            {isExpanded ? (
              <path d="M19 9l-7 7-7-7" />
            ) : (
              <path d="M5 15l7-7 7 7" />
            )}
          </svg>
        </button>
      </div>

      {/* Aperçu des données soumises quand le formulaire est réduit et soumis */}
      {isSubmitted && !isExpanded && (
        <div className="p-3 text-sm">
          <div className="bg-gray-800/30 p-2 rounded-lg border border-gray-700/50">
            <div className="grid grid-cols-1 gap-2">
              {formFields
                .filter(field => formValues[field.id])
                .slice(0, 2)
                .map(field => (
                  <div key={field.id} className="flex items-center">
                    <span className="font-medium mr-2 text-xs text-gray-400">{field.name}:</span>
                    <span className="text-gray-300">{formValues[field.id]}</span>
                  </div>
                ))}
              {formFields.filter(field => formValues[field.id]).length > 2 && (
                <span className="text-gray-400 text-xs mt-1 italic">Cliquez pour voir plus...</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contenu du formulaire, visible seulement si développé */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-4 p-4 pt-2">
              {!isSubmitted && (
                <div className="space-y-3">
                  {formFields.map((field) => (
                    <div key={field.id} className="flex flex-col">
                      <label className="mb-1 text-sm font-medium flex items-center">
                        {field.name}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>

                      <input
                        type={field.type === "email" ? "email" : "text"}
                        value={formValues[field.id] || ""}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        className={`
                          bg-gray-800 border ${errors[field.id] ? "border-red-500" : "border-gray-600"}
                          rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500
                          transition-colors w-full
                        `}
                        placeholder={field.name}
                      />

                      {errors[field.id] && (
                        <span className="text-red-500 text-xs mt-1">{errors[field.id]}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Données soumises si le formulaire est développé et déjà soumis */}
              {isSubmitted && (
                <div className="space-y-2 py-2">
                  <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                    {formFields.map(field => (
                      formValues[field.id] ? (
                        <div key={field.id} className="flex flex-col mb-2 last:mb-0 border-b border-gray-700 last:border-0 pb-2 last:pb-0">
                          <span className="text-sm font-medium text-gray-400">{field.name}</span>
                          <span className="text-white">{formValues[field.id]}</span>
                        </div>
                      ) : null
                    ))}
                  </div>
                </div>
              )}

              {!isSubmitted && (
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Soumettre le formulaire
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormComponent;
