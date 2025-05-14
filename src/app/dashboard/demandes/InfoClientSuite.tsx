import React, { useState, useEffect } from "react";

interface InfoClientSuiteProps {
  endpoint: "mutation" | "reabonnement" | "branchement" | "abonnement" | "resiliation" | "modification-branchement" | "maintenance-ouvrage" | "modification-commerciale" | "achat-disjoncteur" | "construction-ouvrage";
  name?: "current_owner" | "termination_info";
  updateFormData?: (data: any) => void;
}

const InfoClientSuite: React.FC<InfoClientSuiteProps> = ({ endpoint, name = "current_owner", updateFormData }) => {
  // Check if the component is being used for termination information (résiliation)
  const isTerminationInfo = name === "termination_info";

  // Prepare different initial states based on the component's purpose
  const initialState = isTerminationInfo ? {
    cause: "",
    concern: "",
    kennel: "",
    kennel_closed: "",
    kennelKeeper: {
      firstname: "",
      lastname: "",
      mobile_number: "",
    }
  } : {
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
  };

  const [formData, setFormData] = useState(initialState);

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

  const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const [parent, child] = name.split('.');
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev] as any,
        [child]: value
      }
    }));
  };

  return (
    <div className="w-full flex flex-col space-y-8 px-10">
      {!isTerminationInfo && (
        <>
          <h3 className="text-primary font-medium mb-2">Informations de l'ancien client</h3>

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
                placeholder="KONÉ"
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
                placeholder="+225 01 51 24 10 26"
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
                  value={'id_card' in formData ? (formData.id_card as any).number : ''}
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
                  value={'id_card' in formData ? (formData.id_card as any).establishment_country : ''}
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
                  value={'id_card' in formData ? (formData.id_card as any).establishment_place : ''}
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
                  value={'id_card' in formData ? (formData.id_card as any).establishment_date : ''}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#EDEDED] rounded-lg p-3"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Champs pour les informations de résiliation */}
      {isTerminationInfo && (
        <>
          <h3 className="text-primary font-medium mb-2">Informations de résiliation</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="cause" className="block text-sm font-medium text-gray-700">
                Cause de résiliation <span className="text-primary">*</span>
              </label>
              <select
                id="cause"
                name="cause"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                value={'cause' in formData ? formData.cause as string : ''}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner une cause</option>
                <option value="demenagement">Déménagement</option>
                <option value="logement_vendu">Logement vendu</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label htmlFor="concern" className="block text-sm font-medium text-gray-700">
                Concerne <span className="text-primary">*</span>
              </label>
              <select
                id="concern"
                name="concern"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                value={'concern' in formData ? formData.concern as string : ''}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionner</option>
                <option value="abonne">Abonné</option>
                <option value="locataire">Locataire</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="kennel" className="block text-sm font-medium text-gray-700">
                Parc
              </label>
              <input
                type="text"
                name="kennel"
                id="kennel"
                className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={'kennel' in formData ? formData.kennel as string : ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="kennel_closed" className="block text-sm font-medium text-gray-700">
                Parc fermé
              </label>
              <input
                type="text"
                name="kennel_closed"
                id="kennel_closed"
                className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={'kennel_closed' in formData ? formData.kennel_closed as string : ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Informations du gardien</h3>
            <p className="mt-1 text-sm text-gray-500">
              Détails de la personne responsable du parc.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="kennelKeeper.firstname" className="block text-sm font-medium text-gray-700">
                Prénom du gardien
              </label>
              <input
                type="text"
                name="kennelKeeper.firstname"
                id="kennelKeeper.firstname"
                className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={'kennelKeeper' in formData ? (formData.kennelKeeper as any).firstname : ''}
                onChange={handleNestedChange}
              />
            </div>

            <div>
              <label htmlFor="kennelKeeper.lastname" className="block text-sm font-medium text-gray-700">
                Nom du gardien
              </label>
              <input
                type="text"
                name="kennelKeeper.lastname"
                id="kennelKeeper.lastname"
                className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={'kennelKeeper' in formData ? (formData.kennelKeeper as any).lastname : ''}
                onChange={handleNestedChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="kennelKeeper.mobile_number" className="block text-sm font-medium text-gray-700">
              Numéro de téléphone du gardien
            </label>
            <input
              type="tel"
              name="kennelKeeper.mobile_number"
              id="kennelKeeper.mobile_number"
              className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              value={'kennelKeeper' in formData ? (formData.kennelKeeper as any).mobile_number : ''}
              onChange={handleNestedChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default InfoClientSuite;
