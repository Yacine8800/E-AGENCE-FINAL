"use client";

import { useState } from "react";
import EntretienTransfoModal from "../components/EntretienTransfoModal";
import GenericPage from "../components/GenericPage";
import PageWrapper from "../components/PageWrapper";

export default function FormationPage() {
  const description = `Formations professionnelles en électricité adaptées à tous les niveaux, des débutants aux techniciens confirmés.
Nos programmes couvrent les normes électriques, la sécurité, le dépannage, la domotique et les nouvelles technologies.
Formations certifiantes dispensées par des formateurs experts et disponibles en présentiel ou à distance, en sessions individuelles ou collectives.`;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };


  return (
    <PageWrapper>
      <GenericPage
        title="Formation professionnelle"
        description={description}
        buttonText="S'inscrire à une formation"
        secondButtonText="Faites vous assister par clembot"
        secondButtonLink="#"
        imageRight="/depannage/formation.png"
        highlightWord="professionnelle"
        onButtonClick={handleButtonClick}

      />
      <EntretienTransfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prestationType="Formation professionnelle"
      />
    </PageWrapper>
  );
}
