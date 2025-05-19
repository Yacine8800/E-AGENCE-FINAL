"use client";

import { useState } from "react";
import GenericPage from "../components/GenericPage";
import PageWrapper from "../components/PageWrapper";
import EntretienTransfoModal from "../components/EntretienTransfoModal";

export default function LocationGroupePage() {
  const description = `Solution fiable pour tous vos besoins temporaires en électricité : chantiers, événements, secours électrique.
Large gamme de groupes électrogènes de 10 à 500 kVA disponibles immédiatement pour location courte ou longue durée.
Service clé en main incluant livraison, installation, mise en service et assistance technique 24h/24 par nos techniciens spécialisés.`;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };


  return (
    <PageWrapper>
      <GenericPage
        title="Location groupe électrogène"
        description={description}
        buttonText="Réserver maintenant"

        secondButtonText="Faites vous assister par clembot"
        secondButtonLink="#"
        imageRight="/demande/groupe electrogene.png"
        highlightWord="électrogène"
        onButtonClick={handleButtonClick}

      />
      <EntretienTransfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prestationType="Location groupe électrogène"
      />
    </PageWrapper>
  );
}
