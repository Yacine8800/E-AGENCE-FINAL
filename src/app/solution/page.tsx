"use client";

import { useState } from "react";
import GenericPage from "../components/GenericPage";
import EfficaciteTransfoModal from "../components/efficacitemodal";
import PageWrapper from "../components/PageWrapper";

export default function SolutionPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleButtonClick = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <PageWrapper>
                <GenericPage title="Solutions d’efficacité énergétique"
                    description="Un problème avec votre équipement ou votre installation ? Pas de panique. Nos équipes techniques sont disponibles pour vous accompagner rapidement et efficacement. Nous mettons tout en œuvre pour rétablir votre confort dans les meilleurs délais."
                    buttonText="Faire une demande"
                    // buttonLink="/contact"
                    secondButtonText="Faites vous assister par clembot"
                    secondButtonLink="#"
                    imageRight="/risque/SOLUTION  EFFICACITE ENERGETIQUE.png"
                    onButtonClick={handleButtonClick}
                />
            </PageWrapper>
            <EfficaciteTransfoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                prestationType="Solutions d’efficacité énergétique"
            />
        </>);

}
