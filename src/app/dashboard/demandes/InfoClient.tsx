import React, { useState, useEffect } from "react";
import RadioSelect from "../elements/radioSelect";

interface InfoClientProps {
  endpoint: "mutation" | "reabonnement" | "branchement" | "abonnement" | "modification-branchement" | "maintenance-ouvrage" | "modification-commerciale" | "achat-disjoncteur" | "construction-ouvrage";
  updateFormData?: (data: any) => void;
}

const InfoClient: React.FC<InfoClientProps> = ({ endpoint, updateFormData }) => {
  const [formData, setFormData] = useState({
    country: "784",
    connection_index: 0,
    subscription_number: "",
    counter_number: "",
    old_index: 0,
    demand_number: "",
    is_for_self: true // pour savoir si c'est une demande pour soi-même ou pour un tiers
  });

  // Mettre à jour le composant parent lorsque les données changent
  useEffect(() => {
    if (updateFormData) {
      updateFormData(formData);
    }
  }, [formData, updateFormData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Convert to number if the field should be a number
    if (name === 'connection_index' || name === 'old_index') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : parseInt(value, 10)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Gérer la mise à jour de RadioSelect (pour moi / pour tiers)
  const handleRadioChange = (isForSelf: boolean) => {
    setFormData({
      ...formData,
      is_for_self: isForSelf
    });
  };

  // Fonction pour générer le className des inputs
  const inputClassName = "w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-700 text-sm transition-all duration-200 focus:ring-2 focus:ring-red-100 focus:border-red-300 focus:bg-white outline-none";

  return (
    <div className="w-full flex flex-col space-y-8">
      {/* checkbox - affiché uniquement pour mutation */}
      {endpoint === "mutation" && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <RadioSelect
            onChange={handleRadioChange}
            initialValue={formData.is_for_self}
          />
        </div>
      )}

      {/* Titre de section */}
      <div className="border-b border-gray-100 pb-2">
        <h3 className="text-gray-800 font-medium">Informations de l'abonnement</h3>
        <p className="text-gray-500 text-xs mt-1">Veuillez remplir les informations relatives à votre abonnement.</p>
      </div>

      {/* informations de la demande */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* numéro d'abonnement */}
        <div className="w-full flex flex-col gap-1.5">
          <label htmlFor="subscription_number" className="text-sm font-medium text-gray-700 flex items-center">
            Numéro d'abonnement
            {endpoint !== "branchement" && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            id="subscription_number"
            name="subscription_number"
            value={formData.subscription_number}
            onChange={handleChange}
            placeholder="Exemple: 041590594000"
            required={endpoint !== "branchement"}
            className={inputClassName}
          />
          <p className="text-xs text-gray-500 mt-1">Numéro d'identification de votre abonnement</p>
        </div>

        {/* numéro de compteur */}
        <div className="w-full flex flex-col gap-1.5">
          <label htmlFor="counter_number" className="text-sm font-medium text-gray-700 flex items-center">
            Numéro de compteur
            {endpoint !== "branchement" && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type="text"
            id="counter_number"
            name="counter_number"
            value={formData.counter_number}
            onChange={handleChange}
            placeholder="Exemple: 875421"
            required={endpoint !== "branchement"}
            className={inputClassName}
          />
          <p className="text-xs text-gray-500 mt-1">Identifiant unique de votre compteur</p>
        </div>

        {/* index de connexion */}
        <div className="w-full flex flex-col gap-1.5">
          <label htmlFor="connection_index" className="text-sm font-medium text-gray-700 flex items-center">
            Index de connexion
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="number"
            id="connection_index"
            name="connection_index"
            value={formData.connection_index || ''}
            onChange={handleChange}
            placeholder="0"
            required
            className={inputClassName}
          />
          <p className="text-xs text-gray-500 mt-1">Valeur actuelle de votre compteur</p>
        </div>

        {/* ancien index */}
        <div className="w-full flex flex-col gap-1.5">
          <label htmlFor="old_index" className="text-sm font-medium text-gray-700 flex items-center">
            Ancien index
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="number"
            id="old_index"
            name="old_index"
            value={formData.old_index || ''}
            onChange={handleChange}
            placeholder="0"
            required
            className={inputClassName}
          />
          <p className="text-xs text-gray-500 mt-1">Dernière valeur relevée officiellement</p>
        </div>

        {/* numéro de demande */}
        <div className="w-full flex flex-col gap-1.5">
          <label htmlFor="demand_number" className="text-sm font-medium text-gray-700">
            Numéro de demande
          </label>
          <input
            type="text"
            id="demand_number"
            name="demand_number"
            value={formData.demand_number}
            onChange={handleChange}
            placeholder="Exemple: DEM-2024-00012"
            className={inputClassName}
          />
          <p className="text-xs text-gray-500 mt-1">Si vous avez déjà un numéro de demande</p>
        </div>
      </div>
    </div>
  );
};

export default InfoClient;
