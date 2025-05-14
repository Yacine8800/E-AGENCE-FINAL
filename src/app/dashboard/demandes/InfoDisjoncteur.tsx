import React, { useState, useEffect } from "react";

interface InfoDisjoncteurProps {
    endpoint: "achat-disjoncteur";
    updateFormData?: (data: any) => void;
}

const InfoDisjoncteur: React.FC<InfoDisjoncteurProps> = ({ endpoint, updateFormData }) => {
    const [personalInfo, setPersonalInfo] = useState({
        client_firstname: "",
        client_lastname: "",
        client_reference: "",
        client_identifier: "",
        client_mobile_number: "",
        client_phone_number: ""
    });

    const [technicalInfo, setTechnicalInfo] = useState({
        branching_type: "",
        electricity_use: "",
        equipment_type: "",
        price_code: "",
        circuit_breaker_settings: "",
        circuit_breaker_grade: ""
    });

    // Mettre à jour le composant parent lorsque les données changent
    useEffect(() => {
        if (updateFormData) {
            updateFormData({
                personalInfo,
                technicalInfo
            });
        }
    }, [personalInfo, technicalInfo, updateFormData]);

    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPersonalInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTechnicalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTechnicalInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="w-full flex flex-col space-y-8 px-10">
            <div className="border-b border-gray-200 pb-4">
                <h3 className="text-primary font-medium">Informations personnelles</h3>
            </div>

            {/* Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="client_firstname" className="text-sm font-semibold">
                        Prénom <span className="text-primary">*</span>
                    </label>
                    <input
                        type="text"
                        id="client_firstname"
                        name="client_firstname"
                        value={personalInfo.client_firstname}
                        onChange={handlePersonalInfoChange}
                        placeholder="Jean"
                        required
                        className="w-full border border-[#EDEDED] rounded-lg p-3"
                    />
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="client_lastname" className="text-sm font-semibold">
                        Nom <span className="text-primary">*</span>
                    </label>
                    <input
                        type="text"
                        id="client_lastname"
                        name="client_lastname"
                        value={personalInfo.client_lastname}
                        onChange={handlePersonalInfoChange}
                        placeholder="DUPONT"
                        required
                        className="w-full border border-[#EDEDED] rounded-lg p-3"
                    />
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="client_reference" className="text-sm font-semibold">
                        Référence client
                    </label>
                    <input
                        type="text"
                        id="client_reference"
                        name="client_reference"
                        value={personalInfo.client_reference}
                        onChange={handlePersonalInfoChange}
                        placeholder="REF123456"
                        className="w-full border border-[#EDEDED] rounded-lg p-3"
                    />
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="client_identifier" className="text-sm font-semibold">
                        Identifiant client
                    </label>
                    <input
                        type="text"
                        id="client_identifier"
                        name="client_identifier"
                        value={personalInfo.client_identifier}
                        onChange={handlePersonalInfoChange}
                        placeholder="ID123456"
                        className="w-full border border-[#EDEDED] rounded-lg p-3"
                    />
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="client_mobile_number" className="text-sm font-semibold">
                        Numéro de mobile <span className="text-primary">*</span>
                    </label>
                    <input
                        type="tel"
                        id="client_mobile_number"
                        name="client_mobile_number"
                        value={personalInfo.client_mobile_number}
                        onChange={handlePersonalInfoChange}
                        placeholder="+225 07 XX XX XX XX"
                        required
                        className="w-full border border-[#EDEDED] rounded-lg p-3"
                    />
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="client_phone_number" className="text-sm font-semibold">
                        Numéro de téléphone fixe
                    </label>
                    <input
                        type="tel"
                        id="client_phone_number"
                        name="client_phone_number"
                        value={personalInfo.client_phone_number}
                        onChange={handlePersonalInfoChange}
                        placeholder="+225 27 XX XX XX XX"
                        className="w-full border border-[#EDEDED] rounded-lg p-3"
                    />
                </div>
            </div>

            <div className="border-b border-gray-200 pb-4 pt-6">
                <h3 className="text-primary font-medium">Informations techniques</h3>
            </div>

            {/* Informations techniques */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="branching_type" className="text-sm font-semibold">
                        Type de branchement
                    </label>
                    <select
                        id="branching_type"
                        name="branching_type"
                        value={technicalInfo.branching_type}
                        onChange={handleTechnicalInfoChange}
                        className="w-full border border-[#EDEDED] rounded-lg p-3"
                    >
                        <option value="">Sélectionner</option>
                        <option value="monophasé">Monophasé</option>
                        <option value="triphasé">Triphasé</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="electricity_use" className="text-sm font-semibold">
                        Usage électrique
                    </label>
                    <select
                        id="electricity_use"
                        name="electricity_use"
                        value={technicalInfo.electricity_use}
                        onChange={handleTechnicalInfoChange}
                        className="w-full border border-[#EDEDED] rounded-lg p-3"
                    >
                        <option value="">Sélectionner</option>
                        <option value="domestique">Domestique</option>
                        <option value="professionnel">Professionnel</option>
                        <option value="industriel">Industriel</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="equipment_type" className="text-sm font-semibold">
                        Type d'équipement
                    </label>
                    <input
                        type="text"
                        id="equipment_type"
                        name="equipment_type"
                        value={technicalInfo.equipment_type}
                        onChange={handleTechnicalInfoChange}
                        placeholder="Type d'équipement"
                        className="w-full border border-[#EDEDED] rounded-lg p-3"
                    />
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="price_code" className="text-sm font-semibold">
                        Code tarifaire
                    </label>
                    <input
                        type="text"
                        id="price_code"
                        name="price_code"
                        value={technicalInfo.price_code}
                        onChange={handleTechnicalInfoChange}
                        placeholder="CODE123"
                        className="w-full border border-[#EDEDED] rounded-lg p-3"
                    />
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="circuit_breaker_settings" className="text-sm font-semibold">
                        Réglage du disjoncteur
                    </label>
                    <select
                        id="circuit_breaker_settings"
                        name="circuit_breaker_settings"
                        value={technicalInfo.circuit_breaker_settings}
                        onChange={handleTechnicalInfoChange}
                        className="w-full border border-[#EDEDED] rounded-lg p-3"
                    >
                        <option value="">Sélectionner</option>
                        <option value="chaud">Chaud</option>
                        <option value="froid">Froid</option>
                    </select>
                </div>

                <div className="w-full flex flex-col gap-2">
                    <label htmlFor="circuit_breaker_grade" className="text-sm font-semibold">
                        Calibre du disjoncteur
                    </label>
                    <select
                        id="circuit_breaker_grade"
                        name="circuit_breaker_grade"
                        value={technicalInfo.circuit_breaker_grade}
                        onChange={handleTechnicalInfoChange}
                        className="w-full border border-[#EDEDED] rounded-lg p-3"
                    >
                        <option value="">Sélectionner</option>
                        <option value="5A">5 ampères</option>
                        <option value="10A">10 ampères</option>
                        <option value="15A">15 ampères</option>
                        <option value="20A">20 ampères</option>
                        <option value="30A">30 ampères</option>
                        <option value="45A">45 ampères</option>
                        <option value="60A">60 ampères</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default InfoDisjoncteur; 