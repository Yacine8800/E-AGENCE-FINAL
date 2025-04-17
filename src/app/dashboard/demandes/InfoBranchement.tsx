import React, { useState } from "react";

interface InfoBranchementProps {
  endpoint: "mutation" | "reabonnement" | "branchement";
}

const InfoBranchement: React.FC<InfoBranchementProps> = ({ endpoint }) => {
  const [formData, setFormData] = useState({
    usageElectrique: "domestique", // "domestique" ou "professionnel"
    typeBranchement: "monophasé", // "monophasé" ou "triphasé"
    reglageDisjoncteur: "chaud", // "chaud" ou "froid"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOptionSelect = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="w-full flex flex-col space-y-8 px-10">
      {/* Message spécifique au type de demande */}
      {/* {endpoint && (
        <div className={`p-4 rounded-lg mb-4 ${endpoint === "branchement" ? "bg-green-50" : endpoint === "reabonnement" ? "bg-blue-50" : "bg-red-50"}`}>
          <p className={`text-sm font-medium ${endpoint === "branchement" ? "text-green-700" : endpoint === "reabonnement" ? "text-blue-700" : "text-red-700"}`}>
            Informations sur le branchement pour un {endpoint}
          </p>
        </div>
      )} */}

      {/* Usage électrique - affiché pour tous les types */}
      <div className="w-full flex flex-col gap-2">
        <label htmlFor="usageElectrique" className="text-sm font-semibold">
          Usage électrique
        </label>
        <div className="relative">
          <select
            id="usageElectrique"
            name="usageElectrique"
            value={formData.usageElectrique}
            onChange={handleChange}             
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
      <div className="w-full flex flex-col gap-2">
        <label htmlFor="typeBranchement" className="text-sm font-semibold">
          Type de branchement
        </label>
        <div className="relative">
          <select
            id="typeBranchement"
            name="typeBranchement"
            value={formData.typeBranchement}
            onChange={handleChange}             
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
              value={formData.reglageDisjoncteur}
              onChange={handleChange}
              className="w-full border border-[#EDEDED] rounded-lg p-3 appearance-none"
              required
            >
              <option value="chaud">Choisir</option>
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

      {/* Champs spécifiques au branchement */}
      {endpoint === "branchement" && (
        <div className="w-full flex flex-col gap-4 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700">Informations supplémentaires</h3>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="puissanceDemandee" className="text-sm font-semibold">
              Puissance demandée (kVA)
            </label>
            <input
              type="number"
              id="puissanceDemandee"
              name="puissanceDemandee"
              placeholder="Ex: 5"
              className="w-full border border-[#EDEDED] rounded-lg p-3"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoBranchement;
