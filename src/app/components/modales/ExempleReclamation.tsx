import React, { useState } from 'react';
import ReclamationModal from './ReclamationModal';
import ReclamationSuccess from './ReclamationSuccess';

const ExempleReclamation: React.FC = () => {
    const [isReclModalOpen, setIsReclModalOpen] = useState(false);
    const [isReclSuccessOpen, setIsReclSuccessOpen] = useState(false);
    const [requestNumber, setRequestNumber] = useState("D2025050001955RC");

    const handleReclamationSubmit = (data: any) => {
        console.log("Réclamation submitted:", data);
        // Simuler un numéro de demande
        setRequestNumber("D" + Math.floor(Math.random() * 9000000000 + 1000000000) + "RC");
        setIsReclModalOpen(false);
        setIsReclSuccessOpen(true);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Exemple d'utilisation des modales de réclamation</h2>

            <button
                onClick={() => setIsReclModalOpen(true)}
                className="px-6 py-3 bg-orange-500 rounded-lg text-white hover:bg-orange-600 transition-colors"
            >
                Ouvrir la modal de réclamation
            </button>

            {/* Modales de réclamation */}
            <ReclamationModal
                isOpen={isReclModalOpen}
                onClose={() => setIsReclModalOpen(false)}
                onSubmit={handleReclamationSubmit}
            />

            <ReclamationSuccess
                isOpen={isReclSuccessOpen}
                onClose={() => setIsReclSuccessOpen(false)}
                requestNumber={requestNumber}
            />
        </div>
    );
};

export default ExempleReclamation; 