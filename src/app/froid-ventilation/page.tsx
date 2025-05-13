"use client";

import GenericPage from "../components/GenericPage";
import PageWrapper from "../components/PageWrapper";
import EfficaciteTransfoModal from "../components/efficacitemodal";
import { useState } from "react";

export default function FroidVentilationPage() {
  const description = `Spécialistes en systèmes de climatisation, ventilation et réfrigération pour particuliers et professionnels.
Nous assurons l'installation, la maintenance et le dépannage de tous types d'équipements : climatisation réversible, VMC, chambres froides, groupe froid commercial.
Solutions sur mesure adaptées à vos besoins et à votre budget.`;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  return (
    <PageWrapper>
      <GenericPage
        title="Froid et ventilation"
        description={description}
        buttonText="Demander un devis"
        onButtonClick={handleButtonClick}
        secondButtonText="Faites vous assister par clembot"
        secondButtonLink="#"
        imageRight="/depannage/climatisation.png"
        highlightWord="ventilation"
      />
      <EfficaciteTransfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prestationType="Froid et ventilation"
      />
    </PageWrapper>
  );
}
