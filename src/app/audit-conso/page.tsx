import GenericPage from "../components/GenericPage";

export default function AuditConsoPage() {
  const description = `Respectez les distances autour des lignes électriques :
7 m pour les lignes 15 à 33 kV
15 m pour celles de 90 kV
18 m pour les 225 kV  ⚠️ Tenez compte des objets manipulés (outils, perches...).  Ne touchez jamais aux pylônes, poteaux ou câbles, même de loin.`;

  return (

    <div className=" overflow-hidden">
      <GenericPage
        title="Audit de consommation électrique"
        description={description}
        buttonText="Faire une demande"
        buttonLink="#"
        secondButtonText="Faites vous assister par clembot"
        secondButtonLink="#"
        imageRight="/depannage/audit.png"
      />
    </div>

  );
} 