import GenericPage from "../components/GenericPage";

export default function AuditEcoPage() {
  const description = `Nos audits énergétiques vous permettent d'identifier les sources de gaspillage et d'optimiser votre consommation d'énergie.
Analyse complète de vos installations électriques, thermiques et de votre isolation par nos experts certifiés.
Recevez un rapport détaillé avec des recommandations concrètes et un plan d'action chiffré pour réduire vos factures énergétiques jusqu'à 30%.`;

  return (

    <div className="overflow-hidden mt-[-100px] sm:-mt-[120px] md:-mt-[140px] lg:-mt-[160px] mb-[-120px] sm:-mb-[120px] md:-mb-[140px] lg:-mb-[160px]">

      <GenericPage
        title="Audit efficacité énergétique"
        description={description}
        buttonText="Programmer un audit"
        buttonLink="/contact"
        secondButtonText="Faites vous assister par clembot"
        secondButtonLink="#"
        imageRight="/depannage/audit-eco.png"
        highlightWord="énergétique"

      />
    </div>

  );
}
