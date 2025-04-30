import GenericPage from "../components/GenericPage";

export default function IncidentPage() {
  return (
    <div className="overflow-hidden -mt-[180px] -mb-[200px]">
      <GenericPage
        title="Vous avez besoin d’assistance pour signaler un incident?"
        description="Vous avez remarqué une anomalie, une panne ou un dysfonctionnement ? Signalez-le-nous en quelques clics. Votre signalement nous permet d’agir plus vite et de garantir un service de qualité, en toute sécurité.Vous avez remarqué une anomalie, une panne ou un dysfonctionnement ? Signalez-le-nous en quelques clics. Votre signalement nous permet d’agir plus vite et de garantir un service de qualité, en toute sécurité."
      buttonText="Signaler un incident"
      buttonLink="/contact"
        secondButtonText="Faites vous assister par clembot"
        secondButtonLink="#"
        imageRight="/incident/incident.png"
      />
    </div>
  );   
}
