import GenericPage from "../components/GenericPage";

export default function TravauxInstallationPage() {
  const description = `Nos équipes de professionnels qualifiés réalisent tous types de travaux électriques : 
installation complète, mise aux normes, tableau électrique, domotique, éclairage intérieur/extérieur.
Nous vous garantissons un travail soigné, conforme aux normes NF C 15-100 et réalisé avec des matériaux de qualité.`;

  return (
    <div className="overflow-hidden mt-[-150px] sm:-mt-[120px] md:-mt-[140px] lg:-mt-[160px] mb-[-170px] sm:-mb-[120px] md:-mb-[140px] lg:-mb-[160px]">

      <GenericPage
        title="Travaux et installation"
        description={description}
        buttonText="Demander un devis"
        buttonLink="/contact"
        secondButtonText="Faites vous assister par clembot"
        secondButtonLink="#"
        imageRight="/depannage/installation.png"
        highlightWord="installation"
      />
    </div>
  );
}
