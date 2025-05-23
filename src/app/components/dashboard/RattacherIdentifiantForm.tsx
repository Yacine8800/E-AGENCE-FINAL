import React, { useState } from "react";
import ElectricButton from "../ui/ElectricButton";

interface RattacherCompteurFormProps {
  colorTheme?: "orange" | "green";
  onSubmit: (identifiant: string, label: string, type: string) => void;
  onCancel: () => void;
}

export default function RattacherIdentifiantForm({
  colorTheme = "orange",
  onSubmit,
  onCancel,
}: RattacherCompteurFormProps) {
  const themeColors = {
    primary: colorTheme === "orange" ? "primary" : "green-600",
    light: colorTheme === "orange" ? "primary" : "green-600",
  };

  const [formData, setFormData] = useState({
    identifiant: "",
    label: "",
    type: "postpaid",
  });

  // Gère la saisie dans les champs (y compris checkbox si besoin)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  console.log(formData, "formData");

  // Empêche l'envoi direct du formulaire et délègue au Dashboard
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData.identifiant, formData.label, formData.type);
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-5">
        {/* Champ Identifiant */}
        <div className="space-y-1.5">
          <label
            htmlFor="identifiant"
            className="block text-sm font-medium text-gray-700"
          >
            Identifiant
          </label>
          <input
            type="text"
            id="identifiant"
            name="identifiant"
            required
            className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg 
                       shadow-sm focus:outline-none focus:ring-2 focus:ring-${themeColors.primary} 
                       focus:border-transparent transition-all duration-200`}
            value={formData.identifiant}
            onChange={handleChange}
            placeholder="Ex: 123456789"
          />
        </div>

        {/* Champ Label (Libellé) */}
        <div className="space-y-1.5">
          <label
            htmlFor="label"
            className="block text-sm font-medium text-gray-700"
          >
            Libellé
          </label>
          <input
            type="text"
            id="label"
            name="label"
            required
            className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-${themeColors.primary} 
                       focus:border-transparent transition-all duration-200`}
            value={formData.label}
            onChange={handleChange}
            placeholder="Ex: HOTEL AICHTI"
          />
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
        <div className="flex justify-end space-x-3 pt-5">
          <ElectricButton
            onClick={onCancel}
            variant="secondary"
            className="px-4 py-2.5 rounded-lg"
          >
            Annuler
          </ElectricButton>
          <ElectricButton
            type="submit"
            variant="primary"
            className={`px-4 py-2.5 rounded-lg ${
              colorTheme === "green"
                ? "bg-gradient-to-r from-[#56C1B5] to-[#56C1B5]/90 hover:from-[#4AB0A4] hover:to-[#4AB0A4]/90"
                : ""
            }`}
          >
            Rattacher
          </ElectricButton>
        </div>
      </form>
    </>
  );
}
