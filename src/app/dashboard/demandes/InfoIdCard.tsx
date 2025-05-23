import React, { useState, useEffect } from "react";
import InputTypePiece from "../elements/inputTypePiece";

interface InfoIdCardProps {
    updateFormData?: (data: any) => void;
}

const InfoIdCard: React.FC<InfoIdCardProps> = ({ updateFormData }) => {
    const [formData, setFormData] = useState({
        id_card_number: "",
        id_card_establishment_place: "",
        id_card_establishment_date: "",
        id_card_type: "",
        id_card_image: null as string | null,
        identifier: "",
    });

    // Mettre à jour le composant parent lorsque les données changent
    useEffect(() => {
        if (updateFormData) {
            updateFormData(formData);
        }
    }, [formData, updateFormData]);

    // Handler pour le changement de carte d'identité
    const handleIdCardChange = (typePiece: string, imageBase64: string | null) => {
        setFormData(prev => ({
            ...prev,
            id_card_type: typePiece,
            id_card_image: imageBase64,
        }));
    };

    // Gérer le changement pour les champs texte
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <div className="w-full flex flex-col space-y-8 px-10">
            <div className="w-full flex flex-col gap-4">
                <label className="text-sm font-semibold text-gray-700">
                    Pièce d'identité du demandeur <span className="text-primary">*</span>
                </label>

                <div className="border border-[#EDEDED] rounded-lg p-4 space-y-6 bg-white shadow-sm">
                    <div className="w-full">
                        <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
                            Identifiant <span className="text-primary">*</span>
                        </label>
                        <input
                            type="text"
                            id="identifier"
                            name="identifier"
                            value={formData.identifier}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            placeholder="Entrez votre identifiant"
                            required
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="id_card_number" className="block text-sm font-medium text-gray-700 mb-1">
                            Numéro de la pièce <span className="text-primary">*</span>
                        </label>
                        <input
                            type="text"
                            id="id_card_number"
                            name="id_card_number"
                            value={formData.id_card_number}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            placeholder="Entrez le numéro de la pièce"
                            required
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="id_card_establishment_place" className="block text-sm font-medium text-gray-700 mb-1">
                            Lieu d'établissement <span className="text-primary">*</span>
                        </label>
                        <input
                            type="text"
                            id="id_card_establishment_place"
                            name="id_card_establishment_place"
                            value={formData.id_card_establishment_place}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            placeholder="Lieu d'établissement de la pièce"
                            required
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="id_card_establishment_date" className="block text-sm font-medium text-gray-700 mb-1">
                            Date d'établissement <span className="text-primary">*</span>
                        </label>
                        <input
                            type="date"
                            id="id_card_establishment_date"
                            name="id_card_establishment_date"
                            value={formData.id_card_establishment_date}
                            onChange={handleInputChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            required
                        />
                    </div>

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type et photo de la pièce <span className="text-primary">*</span>
                        </label>
                        <InputTypePiece
                            onChange={handleIdCardChange}
                            required
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoIdCard; 