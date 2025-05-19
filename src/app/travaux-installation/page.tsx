"use client";

import GenericPage from "../components/GenericPage";
import PageWrapper from "../components/PageWrapper";
import EfficaciteTransfoModal from "../components/efficacitemodal";
import { useState } from "react";

export default function TravauxInstallationPage() {
  const description = `Nos équipes de professionnels qualifiés réalisent tous types de travaux électriques : 
installation complète, mise aux normes, tableau électrique, domotique, éclairage intérieur/extérieur.
Nous vous garantissons un travail soigné, conforme aux normes NF C 15-100 et réalisé avec des matériaux de qualité.`;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  return (
    <PageWrapper>
      <GenericPage
        title="Travaux et installation"
        description={description}
        buttonText="Demander un devis"
        onButtonClick={handleButtonClick}
        secondButtonText="Faites vous assister par clembot"
        secondButtonLink="#"
        imageRight="/risque/TRAVAUX ET INSTALLATION.png"
        highlightWord="installation"
      />
      <EfficaciteTransfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prestationType="Travaux et installation"
      />
    </PageWrapper>
  );
}
