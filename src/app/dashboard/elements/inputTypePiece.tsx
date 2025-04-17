'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface InputTypePieceProps {
  onChange?: (typePiece: string, numeroPiece: string) => void;
  endpoint?: "mutation" | "reabonnement" | "branchement";
}

const InputTypePiece: React.FC<InputTypePieceProps> = ({ onChange, endpoint }) => {
  const [typePiece, setTypePiece] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleTypePieceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTypePiece(value);
    if (onChange) {
      onChange(value, '');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  // Options de type de pièce en fonction du endpoint
  const getPieceOptions = () => {
    const commonOptions = [
      <option key="cni" value="cni">CNI</option>,
      <option key="passeport" value="passeport">Passeport</option>,
      <option key="permis" value="permis">Permis de conduire</option>
    ];

    if (endpoint === "reabonnement") {
      return [
        ...commonOptions,
        <option key="attestation" value="attestation">Attestation d'identité</option>
      ];
    } else if (endpoint === "branchement") {
      return [
        ...commonOptions,
        <option key="carte_consulaire" value="carte_consulaire">Carte consulaire</option>
      ];
    }

    return [
      ...commonOptions,
      <option key="autre" value="autre">Autre</option>
    ];
  };

  return (
    <div className="w-full flex items-center border border-[#EDEDED] rounded-lg overflow-hidden">
      {/* Select Type de Pièce */}
      <select
        id="typePiece"
        className="flex-grow border-none p-3 outline-none bg-white text-gray-700"
        value={typePiece}
        onChange={handleTypePieceChange}
        required
      >
        <option value="">Sélectionnez un type de pièce</option>
        {getPieceOptions()}
      </select>

      {/* Bouton Upload - masqué pour certains types de demande si nécessaire */}
      {(!endpoint || endpoint !== "branchement" || typePiece !== "carte_consulaire") && (
        <div className="relative w-[100px] h-[50px] flex items-center justify-center bg-[#F1F4FB] border-l border-[#EDEDED]">
          {imagePreview ? (
            <div className="relative w-full h-full">
              <Image
                src={imagePreview}
                alt="Aperçu"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center cursor-pointer">
              <Image src="/demande/basil_camera-solid.png" alt="" width={20} height={20} />
              <span className="text-xs font-semibold text-[#858FA0]">Photo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
};

export default InputTypePiece;
