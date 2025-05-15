"use client";

import { useState } from "react";
import GenericPage from "../components/GenericPage";
import PageWrapper from "../components/PageWrapper";
import EntretienTransfoModal from "../components/EntretienTransfoModal";

export default function RdvPage() {
  const description = `Prenez rendez-vous facilement avec nos techniciens qualifiés pour tout type d'intervention électrique.
Nos experts sont disponibles dans un délai de 24 à 48h, y compris pour les urgences.
Service personnalisé avec créneau horaire précis, confirmation par SMS et technicien identifié pour une expérience client optimale.`;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };


  return (
    <PageWrapper>
      <GenericPage
        title="Prise de rendez-vous"
        description={description}
        buttonText="Prendre un RDV"

        secondButtonText="Faites vous assister par clembot"
        secondButtonLink="#"
        imageRight="/depannage/rendez-vous.png"
        highlightWord="rendez-vous"
        onButtonClick={handleButtonClick}

      />
      <EntretienTransfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prestationType="Prise de rendez-vous"
      />
    </PageWrapper>
  );
}
