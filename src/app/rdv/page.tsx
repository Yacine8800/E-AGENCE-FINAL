import GenericPage from "../components/GenericPage";

export default function RdvPage() {
  const description = `Prenez rendez-vous facilement avec nos techniciens qualifiés pour tout type d'intervention électrique.
Nos experts sont disponibles dans un délai de 24 à 48h, y compris pour les urgences.
Service personnalisé avec créneau horaire précis, confirmation par SMS et technicien identifié pour une expérience client optimale.`;

  return (
    <GenericPage
      title="Prise de rendez-vous"
      description={description}
      buttonText="Prendre RDV en ligne"
      buttonLink="/contact"
      secondButtonText="Faites vous assister par clembot"
      secondButtonLink="#"
      imageRight="/depannage/rendez-vous.png"
      highlightWord="rendez-vous"
    />
  );
}
