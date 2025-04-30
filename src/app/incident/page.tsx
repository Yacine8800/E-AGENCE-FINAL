import GenericPage from "../components/GenericPage";

export default function IncidentPage() {
  return (
    <div className="overflow-hidden mt-[20px] sm:-mt-[120px] md:-mt-[140px] lg:-mt-[160px] mb-[0px] sm:-mb-[120px] md:-mb-[140px] lg:-mb-[160px]">

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
