import GenericPage from "../components/GenericPage";

export default function LocationGroupePage() {
  const description = `Solution fiable pour tous vos besoins temporaires en électricité : chantiers, événements, secours électrique.
Large gamme de groupes électrogènes de 10 à 500 kVA disponibles immédiatement pour location courte ou longue durée.
Service clé en main incluant livraison, installation, mise en service et assistance technique 24h/24 par nos techniciens spécialisés.`;

  return (
    <div className="overflow-hidden -mt-[200px] -mb-[200px]">
      <GenericPage
        title="Location groupe électrogène"
        description={description}
        buttonText="Réserver maintenant"
        buttonLink="/contact"
        secondButtonText="Faites vous assister par clembot"
        secondButtonLink="#"
        imageRight="/depannage/groupe-electrogene.png"
        highlightWord="électrogène"
      />
    </div>
  );
}
