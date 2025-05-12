import GenericPage from "../components/GenericPage";
import PageWrapper from "../components/PageWrapper";

export default function FroidVentilationPage() {
  const description = `Spécialistes en systèmes de climatisation, ventilation et réfrigération pour particuliers et professionnels.
Nous assurons l'installation, la maintenance et le dépannage de tous types d'équipements : climatisation réversible, VMC, chambres froides, groupe froid commercial.
Solutions sur mesure adaptées à vos besoins et à votre budget.`;

  return (
    <PageWrapper>
      <GenericPage
        title="Froid et ventilation"
        description={description}
        buttonText="Demander un devis"
        buttonLink="/contact"
        secondButtonText="Faites vous assister par clembot"
        secondButtonLink="#"
        imageRight="/depannage/climatisation.png"
        highlightWord="ventilation"
      />
    </PageWrapper>
  );
}
