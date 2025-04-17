import GenericPage from "../components/GenericPage";

export default function DepannagePage() {
  return (
    <GenericPage
      title="Pour un dépannage"
      description="Un problème avec votre équipement ou votre installation ? Pas de panique. Nos équipes techniques sont disponibles pour vous accompagner rapidement et efficacement. Nous mettons tout en œuvre pour rétablir votre confort dans les meilleurs délais."
      buttonText="Demander un dépannage"
      buttonLink="/contact"
      imageRight="/depannage/depannage.png"
    />
  );
}
