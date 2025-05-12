"use client";

import { useState } from "react";
import GenericPage from "../components/GenericPage";
import EntretienTransfoModal from "../components/EntretienTransfoModal";
import PageWrapper from "../components/PageWrapper";

export default function EntretienTransfoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <PageWrapper>
        <GenericPage title="Entretien transformateur"
          description="Un problème avec votre équipement ou votre installation ? Pas de panique. Nos équipes techniques sont disponibles pour vous accompagner rapidement et efficacement. Nous mettons tout en œuvre pour rétablir votre confort dans les meilleurs délais."
          buttonText="Faire une demande"
          // buttonLink="/contact"
          secondButtonText="Faites vous assister par clembot"
          secondButtonLink="#"
          imageRight="/depannage/depannage.png"
          onButtonClick={handleButtonClick}
        />
      </PageWrapper>
      <EntretienTransfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prestationType="Entretien transformateur"
      />
    </>
  );
}
