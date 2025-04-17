import React, { useState } from "react";

interface InfoClientSuiteProps {
  endpoint: "mutation" | "reabonnement" | "branchement";
}

const InfoClientSuite: React.FC<InfoClientSuiteProps> = ({ endpoint }) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    index: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="w-full flex flex-col space-y-6 px-10">
      {/* Titre informatif en haut */}
      {/* {endpoint === "reabonnement" && (
        <div className="text-center text-sm text-primary font-medium mb-2">
          Infos de l'ancien client
        </div>
      )}
      */}
      {/* Informations personnelles */}
      <div className="w-full flex flex-col space-y-6">
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="nom" className="text-sm font-semibold">
            Nom
          </label>
          <input 
            type="text" 
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="YAMB" 
            className="w-full border border-[#EDEDED] rounded-lg p-3"
          />
        </div>
        
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="prenom" className="text-sm font-semibold">
            Prénom (s)
          </label>
          <input 
            type="text" 
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            placeholder="LANDRY" 
            className="w-full border border-[#EDEDED] rounded-lg p-3"
          />
        </div>
        
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="telephone" className="text-sm font-semibold">
            N°Téléphone
          </label>
          <input 
            type="tel" 
            id="telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            placeholder="+225 01 51 24 10 26" 
            className="w-full border border-[#EDEDED] rounded-lg p-3"
          />
        </div>
        
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="index" className="text-sm font-semibold">
            Index du jour
          </label>
          <input 
            type="text" 
            id="index"
            name="index"
            value={formData.index}
            onChange={handleChange}
            placeholder="276" 
            className="w-full border border-[#EDEDED] rounded-lg p-3"
          />
        </div>
      </div>
    </div>
  );
};

export default InfoClientSuite;
