import React, { useState, useEffect } from "react";

interface InfoBranchementProps {
  endpoint: "mutation" | "reabonnement" | "branchement" | "abonnement" | "modification-branchement" | "maintenance-ouvrage" | "modification-commerciale" | "achat-disjoncteur" | "construction-ouvrage";
  updateFormData?: (data: any) => void;
}

const InfoBranchement: React.FC<InfoBranchementProps> = ({ endpoint, updateFormData }) => {
  const [locationData, setLocationData] = useState({
    address: "",
    city: "",
    postal_code: "",
    gps_coordinates: {
      latitude: 0,
      longitude: 0
    }
  });

  const [mutationData, setMutationData] = useState({
    reason: "",
    details: "",
    mutation_date: ""
  });

  const [branchementData, setbranchementData] = useState({
    usageElectrique: "domestique", // "domestique" ou "professionnel"
    typeBranchement: "monophasé", // "monophasé" ou "triphasé"
    reglageDisjoncteur: "chaud", // "chaud" ou "froid"
  });

  // Mettre à jour le composant parent lorsque les données changent
  useEffect(() => {
    if (updateFormData) {
      updateFormData({
        locationData,
        mutationData,
        branchementData
      });
    }
  }, [locationData, mutationData, branchementData, updateFormData]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setLocationData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: child === 'latitude' || child === 'longitude'
            ? (value === '' ? 0 : parseFloat(value))
            : value
        }
      }));
    } else {
      setLocationData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMutationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMutationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBranchementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setbranchementData({
      ...branchementData,
      [name]: value,
    });
  };

  return (
    <div className="w-full flex flex-col space-y-8 px-10">
      {/* Informations de localisation */}
      <div className="w-full">
        <h3 className="text-primary font-medium mb-4">Informations de localisation</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="address" className="text-sm font-semibold">
              Adresse <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={locationData.address}
              onChange={handleLocationChange}
              placeholder="Rue 12 Avenue 8"
              required
              className="w-full border border-[#EDEDED] rounded-lg p-3"
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="city" className="text-sm font-semibold">
              Ville <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={locationData.city}
              onChange={handleLocationChange}
              placeholder="Abidjan"
              required
              className="w-full border border-[#EDEDED] rounded-lg p-3"
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="postal_code" className="text-sm font-semibold">
              Code postal
            </label>
            <input
              type="text"
              id="postal_code"
              name="postal_code"
              value={locationData.postal_code}
              onChange={handleLocationChange}
              placeholder="01 BP 1234"
              className="w-full border border-[#EDEDED] rounded-lg p-3"
            />
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-gray-700 font-medium mb-2">Coordonnées GPS</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="gps_coordinates.latitude" className="text-sm font-semibold">
                Latitude
              </label>
              <input
                type="number"
                step="0.000001"
                id="gps_coordinates.latitude"
                name="gps_coordinates.latitude"
                value={locationData.gps_coordinates.latitude || ''}
                onChange={handleLocationChange}
                placeholder="5.349390"
                className="w-full border border-[#EDEDED] rounded-lg p-3"
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              <label htmlFor="gps_coordinates.longitude" className="text-sm font-semibold">
                Longitude
              </label>
              <input
                type="number"
                step="0.000001"
                id="gps_coordinates.longitude"
                name="gps_coordinates.longitude"
                value={locationData.gps_coordinates.longitude || ''}
                onChange={handleLocationChange}
                placeholder="-4.008256"
                className="w-full border border-[#EDEDED] rounded-lg p-3"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Informations de mutation - affiché uniquement pour mutation */}
      {endpoint === "mutation" && (
        <div className="w-full">
          <h3 className="text-primary font-medium mb-4">Informations de mutation</h3>

          <div className="grid grid-cols-1 gap-6">
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="reason" className="text-sm font-semibold">
                Motif de la mutation <span className="text-primary">*</span>
              </label>
              <select
                id="reason"
                name="reason"
                value={mutationData.reason}
                onChange={handleMutationChange}
                className="w-full border border-[#EDEDED] rounded-lg p-3 appearance-none"
                required
              >
                <option value="">Sélectionnez un motif</option>
                <option value="deces">Décès</option>
                <option value="vente">Vente</option>
                <option value="donation">Donation</option>
                <option value="heritage">Héritage</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div className="w-full flex flex-col gap-2">
              <label htmlFor="details" className="text-sm font-semibold">
                Détails supplémentaires
              </label>
              <textarea
                id="details"
                name="details"
                value={mutationData.details}
                onChange={handleMutationChange}
                placeholder="Informations supplémentaires concernant la mutation..."
                rows={3}
                className="w-full border border-[#EDEDED] rounded-lg p-3 resize-none"
              />
            </div>

            <div className="w-full flex flex-col gap-2">
              <label htmlFor="mutation_date" className="text-sm font-semibold">
                Date de mutation <span className="text-primary">*</span>
              </label>
              <input
                type="date"
                id="mutation_date"
                name="mutation_date"
                value={mutationData.mutation_date}
                onChange={handleMutationChange}
                required
                className="w-full border border-[#EDEDED] rounded-lg p-3"
              />
            </div>
          </div>
        </div>
      )}

      {/* Informations sur le branchement */}
      <div className="w-full">
        <h3 className="text-primary font-medium mb-4">Informations sur le branchement</h3>

        {/* Usage électrique - affiché pour tous les types */}
        <div className="w-full flex flex-col gap-2 mb-6">
          <label htmlFor="usageElectrique" className="text-sm font-semibold">
            Usage électrique
          </label>
          <div className="relative">
            <select
              id="usageElectrique"
              name="usageElectrique"
              value={branchementData.usageElectrique}
              onChange={handleBranchementChange}
              className="w-full border border-[#EDEDED] rounded-lg p-3 appearance-none"
              required
            >
              <option value="domestique">Domestique</option>
              <option value="professionnel">Professionnel</option>
              {endpoint === "branchement" && <option value="industriel">Industriel</option>}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Type de branchement - affiché pour tous les types */}
        <div className="w-full flex flex-col gap-2 mb-6">
          <label htmlFor="typeBranchement" className="text-sm font-semibold">
            Type de branchement
          </label>
          <div className="relative">
            <select
              id="typeBranchement"
              name="typeBranchement"
              value={branchementData.typeBranchement}
              onChange={handleBranchementChange}
              className="w-full border border-[#EDEDED] rounded-lg p-3 appearance-none"
              required
            >
              <option value="monophasé">Monophasé</option>
              <option value="triphasé">Triphasé</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Réglage disjoncteur - affiché uniquement pour mutation et reabonnement */}
        {(endpoint === "mutation" || endpoint === "reabonnement") && (
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="reglageDisjoncteur" className="text-sm font-semibold">
              Réglage disjoncteur
            </label>
            <div className="relative">
              <select
                id="reglageDisjoncteur"
                name="reglageDisjoncteur"
                value={branchementData.reglageDisjoncteur}
                onChange={handleBranchementChange}
                className="w-full border border-[#EDEDED] rounded-lg p-3 appearance-none"
                required
              >
                <option value="chaud">Chaud</option>
                <option value="froid">Froid</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoBranchement;
