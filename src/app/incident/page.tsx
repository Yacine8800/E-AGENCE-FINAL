import GenericPage from "../components/GenericPage";

export default function IncidentPage() {
  return (
    <GenericPage
      title="Pour un incident"
      description="Vous avez remarqué une anomalie, une panne ou un dysfonctionnement ? Signalez-le-nous en quelques clics. Votre signalement nous permet d’agir plus vite et de garantir un service de qualité, en toute sécurité."
      buttonText="Signaler un incident"
      buttonLink="/contact"
      imageRight="/incident/incident.png"
    />
  );
}
