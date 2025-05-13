"use client";

import { useState } from "react";
import EntretienTransfoModal from "../components/EntretienTransfoModal";
import GenericPage from "../components/GenericPage";
import PageWrapper from "../components/PageWrapper";

export default function AuditEcoPage() {
  const description = `Nos audits énergétiques vous permettent d'identifier les sources de gaspillage et d'optimiser votre consommation d'énergie.
Analyse complète de vos installations électriques, thermiques et de votre isolation par nos experts certifiés.
Recevez un rapport détaillé avec des recommandations concrètes et un plan d'action chiffré pour réduire vos factures énergétiques jusqu'à 30%.`;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };


  return (
    <PageWrapper>
      <GenericPage
        title="Audit efficacité énergétique"
        description={description}
        buttonText="Programmer un audit"
        // buttonLink="/contact"
        secondButtonText="Faites vous assister par clembot"
        secondButtonLink="#"
        imageRight="/depannage/audit-eco.png"
        highlightWord="énergétique"
        onButtonClick={handleButtonClick}

      />

      <EntretienTransfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prestationType="Audit efficacité énergétique"
      />
    </PageWrapper>


  );
}
