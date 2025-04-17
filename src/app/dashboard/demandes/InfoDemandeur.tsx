import React, { useState } from "react";
import InputTypePiece from "../elements/inputTypePiece";

interface InfoDemandeurProps {
  endpoint: "mutation" | "reabonnement" | "branchement";
}

const InfoDemandeur: React.FC<InfoDemandeurProps> = ({ endpoint }) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    typePiece: "CNI",
    numeroPiece: "",
    date: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="w-full flex flex-col space-y-6 px-10">
      {/* Titre informatif */}
      {/* {endpoint === "reabonnement" && (
        <div className="text-center text-sm text-primary font-medium mb-2">
          Infos du nouveau client
        </div>
      )} */}
      
      {/* Informations personnelles */}
      <div className="w-full flex flex-col space-y-6">
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="nom" className="text-sm font-semibold">
            Nom <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="KONE"
            required
            className="w-full border border-[#EDEDED] rounded-lg p-3"
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label htmlFor="prenom" className="text-sm font-semibold">
            Prénom (s) <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            placeholder="DOFOUCO"
            required
            className="w-full border border-[#EDEDED] rounded-lg p-3"
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label htmlFor="telephone" className="text-sm font-semibold">
            N°Téléphone <span className="text-primary">*</span>
          </label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            placeholder="+225 05 84 47 50 17"
            required
            className="w-full border border-[#EDEDED] rounded-lg p-3"
          />
        </div>

        {/* Type de pièce */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="typePiece" className="text-sm font-semibold">
            Type de pièce <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <select
              id="typePiece"
              name="typePiece"
              value={formData.typePiece}
              onChange={handleChange}
              className="w-full border border-[#EDEDED] rounded-lg p-3 appearance-none"
              required
            >
              <option value="CNI">CNI</option>
              <option value="Passeport">Passeport</option>
              <option value="Carte Consulaire">Carte Consulaire</option>
              <option value="Carte de Séjour">Carte de Séjour</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Numéro de pièce */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="numeroPiece" className="text-sm font-semibold">
            N°pièce
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              id="numeroPiece"
              name="numeroPiece"
              value={formData.numeroPiece}
              onChange={handleChange}
              placeholder="133 455 01B"
              className="w-full border border-[#EDEDED] rounded-lg p-3"
            />
            <button className="absolute right-3 bg-gray-100 p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </button>
          </div>
          <span className="text-xs text-gray-500 mt-1">Prendre une photo</span>
        </div>

        <div className="w-full flex flex-col gap-2">
          <label htmlFor="date" className="text-sm font-semibold">
            Date établissement de la pièce <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            placeholder="12/03/2024"
            required
            className="w-full border border-[#EDEDED] rounded-lg p-3"
          />
        </div>
      </div>
    </div>
  );
};

export default InfoDemandeur;
