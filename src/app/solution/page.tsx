"use client";

import { useState } from "react";
import GenericPage from "../components/GenericPage";
import EntretienTransfoModal from "../components/EntretienTransfoModal";

export default function SolutionPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleButtonClick = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <GenericPage title="Solutions d’efficacité énergétique"
                description="Un problème avec votre équipement ou votre installation ? Pas de panique. Nos équipes techniques sont disponibles pour vous accompagner rapidement et efficacement. Nous mettons tout en œuvre pour rétablir votre confort dans les meilleurs délais."
                buttonText="Faire une demande"
                // buttonLink="/contact"
                secondButtonText="Faites vous assister par clembot"
                secondButtonLink="#"
                imageRight="/depannage/depannage.png"
                onButtonClick={handleButtonClick}

            />;

            <EntretienTransfoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                prestationType="Solutions d’efficacité énergétique"
            />
        </>);

}
