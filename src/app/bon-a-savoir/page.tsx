import { Suspense } from "react";
import { Metadata } from "next";
import NavMenu from "./components/NavMenu";
import SlideCarousel from "./components/SlideCarousel";

// Métadonnées pour le SEO
export const metadata: Metadata = {
  title: "Bon à savoir - E-AGENCE",
  description:
    "Informations utiles sur les compteurs, disjoncteurs et tableaux de comptage électriques.",
};

interface CompteurSlide {
  id: number;
  title: string;
  description: string;
  image: string;
}

// Cette donnée est maintenant statique et côté serveur
const compteurSlides: CompteurSlide[] = [
  {
    id: 1,
    title: "Qu'est ce qu'un compteur électrique?",
    description:
      "Les compteurs nouvelle génération offrent aux clients un meilleur contrôle de leur consommation, une facturation flexible (paiement ou prépaiement) et une utilisation simplifiée grâce à un écran et un pavé numérique.",
    image: "/compteur/compteur4.png",
  },
  {
    id: 2,
    title: "Comment lire votre compteur?",
    description:
      "L'écran affiche alternativement l'index de consommation et la puissance utilisée, navigation simple via le pavé numérique.",
    image: "/compteur/compteur4.png",
  },
  {
    id: 3,
    title: "Prépaiement vs Postpaiement",
    description:
      "Choisissez entre recharger votre compteur à l'avance ou payer après consommation selon vos préférences et habitudes.",
    image: "/compteur/compteur4.png",
  },
  {
    id: 4,
    title: "Entretien de votre compteur",
    description:
      "Gardez votre compteur accessible et protégé, contactez nos services en cas de dysfonctionnement, aucun entretien spécifique requis.",
    image: "/compteur/compteur4.png",
  },
  {
    id: 5,
    title: "Sécurité et votre compteur",
    description:
      "Ne jamais modifier ou réparer votre compteur vous-même, les compteurs sont équipés de systèmes de sécurité intégrés.",
    image: "/compteur/compteur4.png",
  },
];

// Liste des éléments du menu
const menuItems = ["Nos compteurs", "Votre disjoncteur", "Tableau de comptage"];

// La page principale est maintenant un Server Component
export default function BonASavoirPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mt-5 mb-5">
      <div className="w-[96%] bg-[#F3F3F3] rounded-[40px] py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          {/* Titre statique - rendu côté serveur */}
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold text-noir mb-6 sm:mb-8 md:mb-10 relative inline-block">
            Bon à savoir
            <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange to-transparent"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 mt-8 sm:mt-10">
            {/* NavMenu est un Client Component */}
            <Suspense
              fallback={
                <div className="w-full lg:w-72 flex-shrink-0 bg-gray-100 animate-pulse h-60"></div>
              }
            >
              <NavMenu menuItems={menuItems} />
            </Suspense>

            {/* SlideCarousel est un Client Component */}
            <Suspense
              fallback={
                <div className="flex-1 bg-gray-100 animate-pulse h-96"></div>
              }
            >
              <SlideCarousel slides={compteurSlides} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
