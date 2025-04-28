import React, { useState } from "react";
import ElectricButton from "../ui/ElectricButton";

interface RattacherCompteurFormProps {
  onSubmit: (data: {
    identifiant: string;
    label: string;
    isAlerte: boolean;
  }) => void;
  onCancel: () => void;
  colorTheme?: "orange" | "green";
}

export default function RattacherCompteurForm({
  onSubmit,
  onCancel,
  colorTheme = "orange",
}: RattacherCompteurFormProps) {
  const [formData, setFormData] = useState({
    identifiant: "",
    label: "",
    isAlerte: false,
  });

  // Color configuration based on theme
  const themeColors = {
    primary: colorTheme === "orange" ? "#F7942E" : "#56C1B5",
    light: colorTheme === "orange" ? "orange" : "green",
  };

  // Gère la saisie dans les champs (y compris checkbox si besoin)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Empêche l'envoi direct du formulaire et délègue au Dashboard
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Champ Identifiant */}
        <div className="space-y-2">
          <label
            htmlFor="identifiant"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            <span className={`h-1 w-1 ${colorTheme === "orange"
                ? "bg-[#F7942E]"
                : "bg-[#56C1B5]"
              } rounded-full mr-2`}></span>
            Identifiant
          </label>
          <div className="relative">
            <input
              type="text"
              id="identifiant"
              name="identifiant"
              required
              className={`w-full px-4 py-3 border border-gray-200 rounded-lg 
                       shadow-sm focus:outline-none focus:ring-2 ${colorTheme === "orange"
                  ? "focus:ring-[#F7942E]/50 focus:border-[#F7942E]"
                  : "focus:ring-[#56C1B5]/50 focus:border-[#56C1B5]"
                } transition-all duration-200`}
              value={formData.identifiant}
              onChange={handleChange}
              placeholder="Ex: 123456789"
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <svg width="0" height="0" className="w-0 h-0 text-gray-400">
                <rect width="0" height="0" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Saisissez l'identifiant associé à votre compte
          </p>
        </div>

        {/* Champ Label (Libellé) */}
        <div className="space-y-2">
          <label
            htmlFor="label"
            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
          >
            <span className={`h-1 w-1 ${colorTheme === "orange"
                ? "bg-[#F7942E]"
                : "bg-[#56C1B5]"
              } rounded-full mr-2`}></span>
            Libellé
          </label>
          <div className="relative">
            <input
              type="text"
              id="label"
              name="label"
              required
              className={`w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm 
                       focus:outline-none focus:ring-2 ${colorTheme === "orange"
                  ? "focus:ring-[#F7942E]/50 focus:border-[#F7942E]"
                  : "focus:ring-[#56C1B5]/50 focus:border-[#56C1B5]"
                } transition-all duration-200`}
              value={formData.label}
              onChange={handleChange}
              placeholder="Ex: HOTEL AICHTI"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Donnez un nom facilement identifiable
          </p>
        </div>

        {/* Checkbox Alerte si besoin :
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isAlerte"
            name="isAlerte"
            checked={formData.isAlerte}
            onChange={handleChange}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="isAlerte" className="ml-2 text-sm text-gray-700">
            Signaler une alerte
          </label>
        </div> */}

        {/* Boutons du formulaire */}
        <div className="flex justify-end space-x-3 pt-6">
          <ElectricButton
            onClick={onCancel}
            variant="secondary"
            className="px-5 py-2.5 rounded-lg"
          >
            Annuler
          </ElectricButton>
          <ElectricButton
            type="submit"
            variant="primary"
            className={`px-5 py-2.5 rounded-lg ${colorTheme === "orange"
                ? "bg-gradient-to-r from-[#F7942E] to-[#F7942E]/90"
                : "bg-gradient-to-r from-[#56C1B5] to-[#56C1B5]/90 hover:from-[#4AB0A4] hover:to-[#4AB0A4]/90"
              }`}
          >
            Rattacher
          </ElectricButton>
        </div>
      </form>
    </>
  );
}
