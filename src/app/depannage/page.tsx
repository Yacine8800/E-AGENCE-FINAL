import GenericPage from "../components/GenericPage";

export default function DepannagePage() {
  return (
    <div className="overflow-hidden -mt-[200px] -mb-[200px]">
      <GenericPage
        title="Vous avez besoin d’assistance pour un depannage?"
        description="Un problème avec votre équipement ou votre installation ? Pas de panique. Nos équipes techniques sont disponibles pour vous accompagner rapidement et efficacement. Nous mettons tout en œuvre pour rétablir votre confort dans les meilleurs délais."
      buttonText="Demander un dépannage"
        buttonLink="#"
        secondButtonText="Faites vous assister par clembot"
        secondButtonLink="#"
        imageRight="/depannage/depannage.png"
      />
    </div>  
  );
}
