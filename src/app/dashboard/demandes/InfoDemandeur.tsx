import React, { useState, useEffect } from "react";

interface InfoDemandeurProps {
  endpoint: "mutation" | "reabonnement" | "branchement" | "abonnement" | "modification-branchement" | "maintenance-ouvrage" | "modification-commerciale" | "achat-disjoncteur" | "construction-ouvrage";
  updateFormData?: (data: any) => void;
}

const InfoDemandeur: React.FC<InfoDemandeurProps> = ({ endpoint, updateFormData }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile_number: "",
    id_card_number: "",
    id_card: {
      number: "",
      establishment_country: "",
      establishment_place: "",
      establishment_date: ""
    }
  });

  // Mettre à jour le composant parent lorsque les données changent
  useEffect(() => {
    if (updateFormData) {
      updateFormData(formData);
    }
  }, [formData, updateFormData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="w-full flex flex-col space-y-6 px-10">
      <h3 className="text-primary font-medium mb-2">Informations du nouveau client</h3>

      {/* Informations personnelles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="lastname" className="text-sm font-semibold">
            Nom <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            placeholder="KONE"
            required
            className="w-full border border-[#EDEDED] rounded-lg p-3"
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label htmlFor="firstname" className="text-sm font-semibold">
            Prénom(s) <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            placeholder="DOFOUCO"
            required
            className="w-full border border-[#EDEDED] rounded-lg p-3"
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@example.com"
            className="w-full border border-[#EDEDED] rounded-lg p-3"
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label htmlFor="mobile_number" className="text-sm font-semibold">
            N° Téléphone <span className="text-primary">*</span>
          </label>
          <input
            type="tel"
            id="mobile_number"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleChange}
            placeholder="+225 05 84 47 50 17"
            required
            className="w-full border border-[#EDEDED] rounded-lg p-3"
          />
        </div>
      </div>

      {/* Informations de la pièce d'identité */}
      <div className="mt-4">
        <h4 className="text-gray-700 font-medium mb-4">Informations sur la pièce d'identité</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="id_card.number" className="text-sm font-semibold">
              Numéro de pièce <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="id_card.number"
              name="id_card.number"
              value={formData.id_card.number}
              onChange={handleChange}
              placeholder="C0034567"
              required
              className="w-full border border-[#EDEDED] rounded-lg p-3"
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="id_card.establishment_country" className="text-sm font-semibold">
              Pays d'établissement <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="id_card.establishment_country"
              name="id_card.establishment_country"
              value={formData.id_card.establishment_country}
              onChange={handleChange}
              placeholder="Côte d'Ivoire"
              required
              className="w-full border border-[#EDEDED] rounded-lg p-3"
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="id_card.establishment_place" className="text-sm font-semibold">
              Lieu d'établissement <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="id_card.establishment_place"
              name="id_card.establishment_place"
              value={formData.id_card.establishment_place}
              onChange={handleChange}
              placeholder="Abidjan"
              required
              className="w-full border border-[#EDEDED] rounded-lg p-3"
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="id_card.establishment_date" className="text-sm font-semibold">
              Date d'établissement <span className="text-primary">*</span>
            </label>
            <input
              type="date"
              id="id_card.establishment_date"
              name="id_card.establishment_date"
              value={formData.id_card.establishment_date}
              onChange={handleChange}
              required
              className="w-full border border-[#EDEDED] rounded-lg p-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoDemandeur;
