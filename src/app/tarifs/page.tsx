"use client";

import { useRouter } from "next/navigation";
import {
  BoltIcon,
  HomeIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  BriefcaseIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* -- Data ----------------------------------------------------------------- */
const categories = [
  {
    key: "social",
    label: "Domestique social basse tension",
    icon: HomeIcon,
    color: "bg-gradient-to-br from-orange-50 to-orange-100 text-orange-500",
    hoverColor: "group-hover:from-orange-100 group-hover:to-orange-200",
    description: "Pour les foyers à faible consommation et revenus modestes",
    mainColor: "#FF8F2B",
  },
  {
    key: "5a",
    label: "Domestique général 5A",
    icon: BoltIcon,
    color: "bg-gradient-to-br from-vertFonce/5 to-vertFonce/15 text-vertFonce",
    hoverColor: "group-hover:from-vertFonce/15 group-hover:to-vertFonce/25",
    description: "Idéal pour les petits logements avec consommation limitée",
    mainColor: "#FF8F2B",
  },
  {
    key: "10a",
    label: "Domestique général 10A",
    icon: BoltIcon,
    color: "bg-gradient-to-br from-eco/5 to-eco/15 text-eco",
    hoverColor: "group-hover:from-eco/15 group-hover:to-eco/25",
    description: "Adapté aux logements de taille moyenne avec équipements standard",
    mainColor: "#FF8F2B",
  },
  {
    key: "15a",
    label: "Domestique général 15A et plus",
    icon: BoltIcon,
    color: "bg-gradient-to-br from-jaune/5 to-jaune/15 text-jaune",
    hoverColor: "group-hover:from-jaune/15 group-hover:to-jaune/25",
    description: "Pour les grands logements avec nombreux équipements électriques",
    mainColor: "#FF8F2B",
  },
  {
    key: "pro",
    label: "Professionnel général",
    icon: BriefcaseIcon,
    color: "bg-gradient-to-br from-primary/5 to-primary/15 text-primary",
    hoverColor: "group-hover:from-primary/15 group-hover:to-primary/25",
    description: "Solutions adaptées aux besoins des entreprises et commerces",
    mainColor: "#FF8F2B",
  },
];

// Types pour les bulles d'énergie
interface EnergyBubbleProps {
  id: number;
  size: number;
  speed: number;
  delay: number;
  color: string;
  left: number;
}

// Composant de bulle d'énergie électrique
const EnergyBubble = ({ delay, size, speed, color, left }: Omit<EnergyBubbleProps, 'id'>) => {
  return (
    <div
      className={`absolute rounded-full ${color} animate-float opacity-70 blur-sm pointer-events-none z-0`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${speed}s`,
      }}
    >
      <div className="absolute inset-0 animate-pulse" style={{ animationDelay: `${delay * 0.5}s` }}></div>
    </div>
  );
};

/* -- Component ------------------------------------------------------------ */
export default function Page() {
  const router = useRouter();
  const [bubbles, setBubbles] = useState<EnergyBubbleProps[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Générer les bulles d'énergie électrique
  useEffect(() => {
    const generatedBubbles: EnergyBubbleProps[] = [];
    const colors = [
      'bg-orange-200/40',

    ];

    for (let i = 0; i < 12; i++) {
      generatedBubbles.push({
        id: i,
        size: Math.random() * 60 + 20, // Entre 20 et 80px
        speed: Math.random() * 8 + 8, // Entre 8 et 16 secondes
        delay: Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: Math.random() * 100,
      });
    }

    setBubbles(generatedBubbles);

    // Animation de visibilité
    setIsVisible(true);
  }, []);

  // Variantes d'animation pour le container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };

  // Variantes d'animation pour les cartes
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start py-24 px-6 lg:px-0  relative overflow-hidden">
      {/* Bulles d'énergie électrique */}
      {/* <div className="absolute inset-0 overflow-hidden">
        {bubbles.map((bubble) => (
          <EnergyBubble
            key={bubble.id}
            size={bubble.size}
            speed={bubble.speed}
            delay={bubble.delay}
            color={bubble.color}
            left={bubble.left}
          />
        ))}
      </div> */}

      {/* Effet d'éclair discret */}
      <div className="absolute w-[400px] h-[400px] -right-20 top-40 bg-orange-500/5 rounded-full blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute w-[300px] h-[300px] -left-10 bottom-40 bg-vertFonce/5 rounded-full blur-3xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-6xl w-full relative z-10">
        {/* Titre --------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >



          <h1 className="text-4xl font-bold tracking-tight text-noir mb-4">
            Nos <span className="text-orange-500 relative">tarifs</span>
          </h1>

          <p className="text-smallText max-w-2xl mx-auto">
            Sélectionnez la catégorie qui correspond à vos besoins pour découvrir nos offres
          </p>


        </motion.div>

        {/* Grille -------------------------------------------------------- */}
        <motion.ul
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 relative z-10"
        >
          {categories.map(({ key, label, icon: Icon, color, hoverColor, description, mainColor }, index) => (
            <motion.li
              key={key}
              variants={cardVariants}
              custom={index}
              onClick={() => router.push(`/tarifs/${key}`)}
              className="group relative cursor-pointer rounded-3xl bg-white/90 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100/80 overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Ligne décorative colorée en haut */}
              <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: mainColor }}></div>

              {/* Contenu de la carte ---------------------------------- */}
              <div className="p-7 flex flex-col gap-5 h-full">
                {/* Icone */}
                <div
                  className={`w-14 h-14 ${color} ${hoverColor} rounded-2xl grid place-content-center shadow-sm transition-all duration-300`}
                  style={{ boxShadow: `0 4px 14px ${mainColor}15` }}
                >
                  <Icon className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
                </div>

                {/* Libellé */}
                <h3 className="text-xl font-semibold text-noir leading-snug group-hover:text-orange-500 transition-colors duration-300">
                  {label}
                </h3>

                {/* Description */}
                <p className="text-base text-smallText/90 leading-relaxed">
                  {description}
                </p>

                {/* Bouton ------------------------------------------ */}
                <div className="mt-auto pt-4 flex justify-end">
                  <div className="flex items-center gap-2 text-orange-500 font-medium text-sm">
                    <span className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      Voir les détails
                    </span>
                    <div className="w-8 h-8 rounded-full bg-orange-50 grid place-content-center transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
                      <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Effet de surbrillance subtil sur hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-orange-50/10 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300 pointer-events-none" />

              {/* Décoration au fond */}
              <div
                className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-5 transition-opacity duration-300 group-hover:opacity-10"
                style={{ backgroundColor: mainColor }}
              ></div>
            </motion.li>
          ))}
        </motion.ul>

        {/* Indication légale */}

      </div>
    </div>
  );
}

// Ajouter l'animation float au fichier globals.css
// @keyframes float {
//   0% { transform: translateY(100vh); }
//   100% { transform: translateY(-100px); }
// }
