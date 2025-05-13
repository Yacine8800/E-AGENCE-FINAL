"use client";

import { useState } from "react";
import GenericPage from "../components/GenericPage";
import PageWrapper from "../components/PageWrapper";
import EfficaciteTransfoModal from "../components/efficacitemodal";

export default function TransitionEnergetiquePage() {
  const description = `Accompagnement personnalisé pour réduire votre empreinte énergétique et optimiser votre consommation.
Nos experts vous conseillent sur les solutions adaptées à votre situation : panneaux photovoltaïques, pompes à chaleur, 
bornes de recharge électrique, systèmes de gestion intelligente de l'énergie.
Bénéficiez d'aides financières et de crédits d'impôt grâce à nos solutions certifiées.`;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  return (
    <PageWrapper>
      <GenericPage
        title="Accompagnement à la transition énergétique"
        description={description}
        buttonText="Étudier mon projet"
        onButtonClick={handleButtonClick}
        secondButtonText="Faites vous assister par clembot"
        secondButtonLink="#"
        imageRight="/depannage/energie.png"
        highlightWord="énergétique"
      />

      <EfficaciteTransfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prestationType="Accompagnement à la transition énergétique"
      />
    </PageWrapper>
  );
}
