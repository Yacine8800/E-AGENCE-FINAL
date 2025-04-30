import GenericPage from "../components/GenericPage";

export default function ReclamationPage() {
  return (
    <div className="overflow-hidden -mt-[200px] -mb-[200px]">
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
