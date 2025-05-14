import React, { useState, useEffect } from "react";
import InputTypePiece from "../elements/inputTypePiece";

interface DocumentsProps {
  endpoint: "mutation" | "reabonnement" | "branchement" | "abonnement" | "modification-branchement" | "maintenance-ouvrage" | "modification-commerciale" | "achat-disjoncteur" | "construction-ouvrage" | "resiliation";
  updateFormData?: (data: any) => void;
}

const Documents: React.FC<DocumentsProps> = ({ endpoint, updateFormData }) => {
  const [formData, setFormData] = useState({
    new_owner_id_card: null as File | null,
    current_owner_id_card: null as File | null,
    additional_documents: [] as File[],
    certificatConforme: false,
    new_owner_id_type: "",
    current_owner_id_type: "",
    // Documents spécifiques pour branchement abonnement
    securel: null as File | null,
    official_request: null as File | null,
    leaseholder_id_card: null as File | null,
    // Document spécifique pour résiliation
    id_card: null as File | null,
  });

  // Mettre à jour le composant parent lorsque les données changent
  useEffect(() => {
    if (updateFormData) {
      updateFormData(formData);
    }
  }, [formData, updateFormData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        [fieldName]: e.target.files[0],
      });
    }
  };

  const handleAdditionalDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        additional_documents: [...formData.additional_documents, ...Array.from(e.target.files)],
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

  // Convertir base64 en File pour le nouveau propriétaire
  const handleNewOwnerIdCardChange = (typePiece: string, imageBase64: string | null) => {
    setFormData(prev => ({
      ...prev,
      new_owner_id_type: typePiece,
      // Note: Ici nous enregistrons seulement l'image en base64
      // Dans une implémentation réelle, il faudrait convertir le base64 en File
    }));
  };

  // Convertir base64 en File pour l'ancien propriétaire
  const handleCurrentOwnerIdCardChange = (typePiece: string, imageBase64: string | null) => {
    setFormData(prev => ({
      ...prev,
      current_owner_id_type: typePiece,
      // Note: Ici nous enregistrons seulement l'image en base64
      // Dans une implémentation réelle, il faudrait convertir le base64 en File
    }));
  };

  // Méthode pour gérer les données des InputTypePiece
  const handleInputTypePieceChange = (id: string, file: File | null) => {
    setFormData({
      ...formData,
      [id]: file
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

      {/* Documents spécifiques pour branchement abonnement */}
      {(endpoint === "branchement" || endpoint === "abonnement") && (
        <>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="securel" className="text-sm font-semibold">
              SECUREL (certificat technique) <span className="text-primary">*</span>
            </label>
            <div className="border border-[#EDEDED] rounded-lg p-3">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-4 pb-5">
                    <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG (MAX. 5 Mo)</p>
                  </div>
                  <input
                    id="securel"
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "securel")}
                  />
                </label>
              </div>
              {formData.securel && (
                <div className="mt-2">
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <span className="text-sm truncate">{formData.securel.name}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, securel: null })}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="official_request" className="text-sm font-semibold">
              Demande officielle <span className="text-primary">*</span>
            </label>
            <div className="border border-[#EDEDED] rounded-lg p-3">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-4 pb-5">
                    <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG (MAX. 5 Mo)</p>
                  </div>
                  <input
                    id="official_request"
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "official_request")}
                  />
                </label>
              </div>
              {formData.official_request && (
                <div className="mt-2">
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <span className="text-sm truncate">{formData.official_request.name}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, official_request: null })}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="leaseholder_id_card" className="text-sm font-semibold">
              Pièce d'identité du demandeur <span className="text-primary">*</span>
            </label>
            <div className="border border-[#EDEDED] rounded-lg p-3">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-4 pb-5">
                    <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG (MAX. 5 Mo)</p>
                  </div>
                  <input
                    id="leaseholder_id_card"
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, "leaseholder_id_card")}
                  />
                </label>
              </div>
              {formData.leaseholder_id_card && (
                <div className="mt-2">
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <span className="text-sm truncate">{formData.leaseholder_id_card.name}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, leaseholder_id_card: null })}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Pièce d'identité du nouveau propriétaire - uniquement pour mutation */}
      {endpoint === "mutation" && (
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="new_owner_id_card" className="text-sm font-semibold">
            Pièce d'identité du nouveau propriétaire <span className="text-primary">*</span>
          </label>
          <InputTypePiece
            onChange={handleNewOwnerIdCardChange}
            required
          />
        </div>
      )}

      {/* Pièce d'identité de l'ancien propriétaire - uniquement pour mutation */}
      {endpoint === "mutation" && (
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="current_owner_id_card" className="text-sm font-semibold">
            Pièce d'identité de l'ancien propriétaire <span className="text-primary">*</span>
          </label>
          <InputTypePiece
            onChange={handleCurrentOwnerIdCardChange}
            required
          />
        </div>
      )}

      {/* Pièce d'identité - uniquement pour résiliation */}
      {endpoint === "resiliation" && (
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="id_card" className="text-sm font-semibold">
            Pièce d'identité <span className="text-primary">*</span>
          </label>
          <div className="border border-[#EDEDED] rounded-lg p-3">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-4 pb-5">
                  <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG (MAX. 5 Mo)</p>
                </div>
                <input
                  id="id_card"
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "id_card")}
                />
              </label>
            </div>
            {formData.id_card && (
              <div className="mt-2">
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                  <span className="text-sm truncate">{formData.id_card.name}</span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, id_card: null })}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Documents supplémentaires */}
      <div className="w-full flex flex-col gap-2">
        <label htmlFor="additionalDocs" className="text-sm font-semibold">
          Documents supplémentaires
        </label>
        <div className="border border-[#EDEDED] rounded-lg p-3">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Cliquez pour ajouter</span> ou glissez et déposez</p>
                <p className="text-xs text-gray-500">PDF, JPG, PNG (MAX. 10 Mo)</p>
              </div>
              <input
                id="additionalDocs"
                type="file"
                className="hidden"
                multiple
                onChange={handleAdditionalDocChange}
              />
            </label>
          </div>

          {formData.additional_documents.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Documents ajoutés:</p>
              <ul className="space-y-2">
                {formData.additional_documents.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <span className="text-sm truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newFiles = [...formData.additional_documents];
                        newFiles.splice(index, 1);
                        setFormData({ ...formData, additional_documents: newFiles });
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

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
            Je certifie que les documents fournis sont conformes aux originaux
          </label>
        </div>
      </div>
    </div>
  );
};

export default Documents;
