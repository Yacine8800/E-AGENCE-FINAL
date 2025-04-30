import GenericPage from "../components/GenericPage";

export default function TransitionEnergetiquePage() {
  const description = `Accompagnement personnalisé pour réduire votre empreinte énergétique et optimiser votre consommation.
Nos experts vous conseillent sur les solutions adaptées à votre situation : panneaux photovoltaïques, pompes à chaleur, 
bornes de recharge électrique, systèmes de gestion intelligente de l'énergie.
Bénéficiez d'aides financières et de crédits d'impôt grâce à nos solutions certifiées.`;

  return (
    <div className="overflow-hidden mt-[-90px] sm:-mt-[120px] md:-mt-[140px] lg:-mt-[160px] mb-[-120px] sm:-mb-[120px] md:-mb-[140px] lg:-mb-[160px]">

      <GenericPage
        title="Accompagnement à la transition énergétique"
        description={description}
        buttonText="Étudier mon projet"
        buttonLink="/contact"
        secondButtonText="Faites vous assister par clembot"
        secondButtonLink="#"
        imageRight="/depannage/energie.png"
        highlightWord="énergétique"
      />
    </div>
  );
}
