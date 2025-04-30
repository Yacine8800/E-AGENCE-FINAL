import GenericPage from "../components/GenericPage";

export default function RdvPage() {
  const description = `Prenez rendez-vous facilement avec nos techniciens qualifiés pour tout type d'intervention électrique.
Nos experts sont disponibles dans un délai de 24 à 48h, y compris pour les urgences.
Service personnalisé avec créneau horaire précis, confirmation par SMS et technicien identifié pour une expérience client optimale.`;

  return (
    <div className="overflow-hidden mt-[-90px] sm:-mt-[120px] md:-mt-[140px] lg:-mt-[160px] mb-[-120px] sm:-mb-[120px] md:-mb-[140px] lg:-mb-[160px]">

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
    </div>
  );
}
