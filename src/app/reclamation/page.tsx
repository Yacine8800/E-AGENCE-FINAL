import GenericPage from "../components/GenericPage";

export default function ReclamationPage() {
  return (
    <GenericPage
      title="Pour une réclamation"
      description="Une insatisfaction concernant nos services ? Nous sommes à votre écoute. Formulez votre réclamation simplement, et notre équipe s'engage à vous apporter une réponse claire et rapide."
      buttonText="Signaler une réclamation"
      buttonLink="/contact"
      imageRight="/reclamation/reclam.png"
    />
  );
}
