import React, { useState } from "react";
import Image from "next/image";
import { MdOutlinePhotoCamera, MdClose } from "react-icons/md";

const JoindreDocuments = () => {
  const [documentDemandeur, setDocumentDemandeur] = useState<File | null>(null);
  const [documentProprietaire, setDocumentProprietaire] = useState<File | null>(
    null
  );
  const [isChecked, setIsChecked] = useState(false);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <div className="w-full bg-white p-6 flex flex-col gap-6 rounded-xl border-1 border-gray-200">
      {/* Document du demandeur */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-900">
          Pièce d’identité du demandeur <span className="text-red-500">*</span>
        </label>
        <div className="bg-gray-50 p-4 rounded-lg border-1 border-gray-300 flex flex-col gap-4 items-center">
          {documentDemandeur ? (
            <div className="relative w-24 h-24">
              <Image
                src={URL.createObjectURL(documentDemandeur)}
                alt="Aperçu du document"
                layout="fill"
                className="rounded-lg object-cover border"
              />
              <button
                onClick={() => setDocumentDemandeur(null)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1  hover:bg-red-600 transition"
              >
                <MdClose size={16} />
              </button>
            </div>
          ) : (
            <label
              htmlFor="documentDemandeur"
              className="flex flex-col items-center justify-center gap-2 px-6 py-4 text-gray-700 font-medium bg-white border-1 border-gray-300 rounded-md shadow-sm cursor-pointer hover:border-red-500 hover:bg-gray-100 transition"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4B5563"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
              <span className="text-sm">Importer la pièce d'identité</span>
            </label>
          )}
          <input
            type="file"
            accept="image/*"
            id="documentDemandeur"
            className="hidden"
            onChange={(e) => handleFileChange(e, setDocumentDemandeur)}
          />
        </div>
      </div>

      {/* Document du propriétaire */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-900">
          Pièce d’identité du propriétaire{" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="bg-gray-50 p-4 rounded-lg  border-1 border-gray-300 flex flex-col gap-4 items-center">
          {documentProprietaire ? (
            <div className="relative w-24 h-24">
              <Image
                src={URL.createObjectURL(documentProprietaire)}
                alt="Aperçu du document"
                layout="fill"
                className="rounded-lg object-cover border"
              />
              <button
                onClick={() => setDocumentProprietaire(null)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
              >
                <MdClose size={16} />
              </button>
            </div>
          ) : (
            <label
              htmlFor="documentProprietaire"
              className="flex flex-col items-center justify-center gap-2 px-6 py-4 text-gray-700 font-medium bg-white border-1 border-gray-300 rounded-md shadow-sm cursor-pointer hover:border-red-500 hover:bg-gray-100 transition"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4B5563"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
              <span className="text-sm">Importer la pièce d'identité</span>
            </label>
          )}
          <input
            type="file"
            accept="image/*"
            id="documentProprietaire"
            className="hidden"
            onChange={(e) => handleFileChange(e, setDocumentProprietaire)}
          />
        </div>
      </div>

      {/* Checkbox "Certifié conforme" */}
      <div
        className="flex items-center gap-3 cursor-pointer select-none"
        onClick={() => setIsChecked(!isChecked)}
      >
        {/* Custom Toggle Switch */}
        <div
          className={`w-12 h-7 flex items-center px-1 rounded-full transition-all duration-300
          ${isChecked ? "bg-red-500" : "bg-gray-300"}
        `}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 
            ${isChecked ? "translate-x-5" : "translate-x-0"}
          `}
          />
        </div>

        {/* Label Texte */}
        <label className="text-gray-800 text-sm font-medium">
          Certifié conforme
        </label>
      </div>
    </div>
  );
};

export default JoindreDocuments;
