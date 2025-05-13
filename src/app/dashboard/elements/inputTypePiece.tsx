'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface InputTypePieceProps {
  onChange?: (typePiece: string, imageBase64: string | null) => void;
  initialImage?: string | null;
  initialType?: string;
  required?: boolean;
}

const InputTypePiece: React.FC<InputTypePieceProps> = ({ onChange, initialImage, initialType, required = false }) => {
  const [typePiece, setTypePiece] = useState<string>(initialType || '');
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage || null);

  // Mettre à jour les états quand les props changent
  useEffect(() => {
    if (initialType !== undefined) {
      setTypePiece(initialType);
    }
    if (initialImage !== undefined) {
      setImagePreview(initialImage);
    }
  }, [initialType, initialImage]);

  const handleTypePieceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTypePiece(value);
    if (onChange) {
      onChange(value, imagePreview);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          const newImage = event.target.result as string;
          setImagePreview(newImage);
          if (onChange) {
            onChange(typePiece, newImage);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (onChange) {
      onChange(typePiece, null);
    }
  };

  return (
    <div className="w-full flex items-center border border-[#EDEDED] rounded-lg overflow-hidden">
      {/* Select Type de Pièce */}
      <select
        id="typePiece"
        className="flex-grow border-none p-3 outline-none bg-white text-gray-700"
        value={typePiece}
        onChange={handleTypePieceChange}
        required={required}
      >
        <option value="">Sélectionnez un type de pièce</option>
        <option value="cni">CNI</option>
        <option value="passeport">Passeport</option>
        <option value="permis">Permis de conduire</option>
        <option value="attestation">Attestation d'identité</option>
        <option value="carte_consulaire">Carte consulaire</option>
        <option value="autre">Autre</option>
      </select>

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
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        ) : (
          <label className={`flex flex-col items-center ${!typePiece ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
            <Image src="/demande/basil_camera-solid.png" alt="" width={20} height={20} />
            <span className="text-xs font-semibold text-[#858FA0]">Photo</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={!typePiece}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default InputTypePiece;
