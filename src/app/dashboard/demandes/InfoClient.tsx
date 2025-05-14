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

  return (
    <div className="w-full flex flex-col space-y-10 px-10">
      {/* checkbox - affiché uniquement pour mutation */}
      {endpoint === "mutation" && (
        <RadioSelect
          onChange={handleRadioChange}
          initialValue={formData.is_for_self}
        />
      )}

      {/* informations de la demande  */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* numéro d'abonnement */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="subscription_number" className="text-sm font-semibold">
            Numéro d'abonnement <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="subscription_number"
            name="subscription_number"
            value={formData.subscription_number}
            onChange={handleChange}
            placeholder="041590594000"
            required={endpoint !== "branchement"}
            className="w-full border border-[#EDEDED] rounded-lg p-3"
          />
        </div>

        {/* numéro de compteur */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="counter_number" className="text-sm font-semibold">
            Numéro de compteur <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="counter_number"
            name="counter_number"
            value={formData.counter_number}
            onChange={handleChange}
            placeholder="875421"
            required={endpoint !== "branchement"}
            className="w-full border border-[#EDEDED] rounded-lg p-3"
          />
        </div>

        {/* index de connexion */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="connection_index" className="text-sm font-semibold">
            Index de connexion <span className="text-primary">*</span>
          </label>
          <input
            type="number"
            id="connection_index"
            name="connection_index"
            value={formData.connection_index || ''}
            onChange={handleChange}
            placeholder="0"
            required
            className="w-full border border-[#EDEDED] rounded-lg p-3"
          />
        </div>

        {/* ancien index */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="old_index" className="text-sm font-semibold">
            Ancien index <span className="text-primary">*</span>
          </label>
          <input
            type="number"
            id="old_index"
            name="old_index"
            value={formData.old_index || ''}
            onChange={handleChange}
            placeholder="0"
            required
            className="w-full border border-[#EDEDED] rounded-lg p-3"
          />
        </div>

        {/* numéro de demande */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="demand_number" className="text-sm font-semibold">
            Numéro de demande
          </label>
          <input
            type="text"
            id="demand_number"
            name="demand_number"
            value={formData.demand_number}
            onChange={handleChange}
            placeholder="DEM-2024-00012"
            className="w-full border border-[#EDEDED] rounded-lg p-3"
          />
        </div>
      </div>
    </div>
  );
};

export default InfoClient;
