import GenericPage from "../components/GenericPage";

export default function FormationPage() {
  const description = `Formations professionnelles en électricité adaptées à tous les niveaux, des débutants aux techniciens confirmés.
Nos programmes couvrent les normes électriques, la sécurité, le dépannage, la domotique et les nouvelles technologies.
Formations certifiantes dispensées par des formateurs experts et disponibles en présentiel ou à distance, en sessions individuelles ou collectives.`;

  return (
    <div className="overflow-hidden -mt-[200px] -mb-[200px]">
      <GenericPage
        title="Formation professionnelle"
        description={description}
        buttonText="S'inscrire à une formation"
        buttonLink="/contact"
        secondButtonText="Faites vous assister par clembot"
        secondButtonLink="#"
        imageRight="/depannage/formation.png"
        highlightWord="professionnelle"
      />
    </div>
  );
}
