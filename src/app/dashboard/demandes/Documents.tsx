import React, { useState } from "react";
import InputTypePiece from "../elements/inputTypePiece";

interface DocumentsProps {
  endpoint: "mutation" | "reabonnement" | "branchement";
}

const Documents: React.FC<DocumentsProps> = ({ endpoint }) => {
  const [formData, setFormData] = useState({
    pieceIdentiteDemandeur: null as File | null,
    pieceIdentiteProprietaire: null as File | null,
    certificatConforme: false,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        [fieldName]: e.target.files[0],
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  // Titre différent selon le type de demande
  // const getTitre = () => {
  //   switch (endpoint) {
  //     case "mutation":
  //       return "Documents pour la mutation";
  //     case "reabonnement":
  //       return "Documents pour le réabonnement";
  //     case "branchement":
  //       return "Documents pour le branchement";
  //     default:
  //       return "Documents requis";
  //   }
  // };

  return (
    <div className="w-full flex flex-col space-y-8 px-10">
      {/* Titre spécifique au type de demande */}
      {/* <div className={`p-4 rounded-lg ${endpoint === "branchement" ? "bg-green-50" : endpoint === "reabonnement" ? "bg-blue-50" : "bg-red-50"}`}>
        <p className={`text-sm font-medium ${endpoint === "branchement" ? "text-green-700" : endpoint === "reabonnement" ? "text-blue-700" : "text-red-700"}`}>
          {getTitre()}
        </p>
      </div> */}

      {/* Pièce d'identité du demandeur */}
      <div className="w-full flex flex-col gap-2">
        <label htmlFor="typePiece" className="text-sm font-semibold">
          Pièce d'identité du demandeur <span className="text-primary">*</span>
        </label>
        <InputTypePiece/>
      </div>

      {/* Pièce d'identité du propriétaire - affiché uniquement pour mutation */}
      {endpoint === "mutation" && (
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="typePiece" className="text-sm font-semibold">
            Pièce d'identité du propriétaire <span className="text-primary">*</span>
          </label>
          <InputTypePiece/>
        </div>
      )}

      {/* Documents spécifiques au branchement */}
      {endpoint === "branchement" && (
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="typePiece" className="text-sm font-semibold">
            Titre de propriété <span className="text-primary">*</span>
          </label>
          <InputTypePiece/>
        </div>
      )}

      {/* Documents spécifiques au réabonnement */}
      {endpoint === "reabonnement" && (
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="typePiece" className="text-sm font-semibold">
            Dernière facture <span className="text-primary">*</span>
          </label>
          <InputTypePiece/>
        </div>
      )}

      {/* Certificat conforme */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="certificatConforme"
            name="certificatConforme"
            checked={formData.certificatConforme}
            onChange={handleCheckboxChange}
            className="h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="certificatConforme" className="ml-3 text-sm font-medium text-gray-700">
            Certifié conforme
          </label>
        </div>
      </div>
    </div>
  );
};

export default Documents;
