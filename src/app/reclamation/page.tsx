import GenericPage from "../components/GenericPage";

export default function ReclamationPage() {
  return (
    <div className="overflow-hidden -mt-[40px] sm:-mt-[120px] md:-mt-[140px] lg:-mt-[160px] -mb-[40px] sm:-mb-[120px] md:-mb-[140px] lg:-mb-[160px]">

      <GenericPage
        title="Vous avez besoin d’assistance pour une reclamation?"
        description="Une insatisfaction concernant nos services ? Nous sommes à votre écoute. Formulez votre réclamation simplement, et notre équipe s'engage à vous apporter une réponse claire et rapide."
        buttonText="Signaler une réclamation"
        buttonLink="/contact"
        secondButtonText="Faites vous assister par clembot"
        secondButtonLink="#"
        imageRight="/reclamation/reclam.png"
      />
    </div>
  );
}
