"use client";

import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const sectionData = {
  froid: {
    title: "Appareils de froid",
    image: "/section8/froid.png",
    description:
      "Les réfrigérateurs et congélateurs sont des appareils essentiels mais énergivores. Il est important de les utiliser efficacement pour réduire leur consommation d'énergie tout en maintenant leur performance.",
    tips: [
      {
        id: 0,
        title: "Température optimale",
        icon: "temperature",
        description:
          "Réglez la température entre 4°C et 6°C pour le réfrigérateur et -18°C pour le congélateur.",
      },
      {
        id: 1,
        title: "Dégivrage régulier",
        icon: "frost",
        description:
          "Dégivrez régulièrement vos appareils, le givre augmente la consommation d'énergie.",
      },
      {
        id: 2,
        title: "Aliments chauds",
        icon: "food",
        description:
          "Évitez de placer des aliments encore chauds dans le réfrigérateur.",
      },
    ],
  },
  eclairage: {
    title: "Éclairage",
    image: "/section8/eclairage.png",
    description:
      "L'éclairage représente une part importante de la consommation électrique. Optimiser son utilisation permet de réaliser des économies significatives tout en maintenant un confort optimal.",
    tips: [
      {
        id: 0,
        title: "Ampoules LED",
        icon: "bulb",
        description:
          "Privilégiez les ampoules LED, elles consomment peu et durent longtemps.",
      },
      {
        id: 1,
        title: "Détecteurs de présence",
        icon: "sensor",
        description:
          "Installez des détecteurs de présence dans les zones de passage.",
      },
      {
        id: 2,
        title: "Lumière naturelle",
        icon: "sun",
        description: "Profitez au maximum de la lumière naturelle.",
      },
    ],
  },
  multimedia: {
    title: "Multimédia",
    image: "/section8/multimedia.png",
    description:
      "Les appareils multimédia consomment de l'énergie même en veille. Une gestion intelligente de leur utilisation permet de réduire significativement leur impact sur la facture d'électricité.",
    tips: [
      {
        id: 0,
        title: "Éteindre complètement",
        icon: "power",
        description:
          "Éteignez complètement les appareils non utilisés et débranchez les chargeurs inutilisés.",
      },
      {
        id: 1,
        title: "Multiprises",
        icon: "plug",
        description:
          "Utilisez des multiprises avec interrupteur pour éviter les consommations en veille.",
      },
      {
        id: 2,
        title: "Écrans",
        icon: "screen",
        description:
          "Réglez la luminosité des écrans et activez les modes d'économie d'énergie.",
      },
    ],
  },
  equipements: {
    title: "Équipements",
    image: "/section8/equipement.png",
    description:
      "Les équipements électroménagers représentent une part importante de notre consommation énergétique quotidienne. Une utilisation réfléchie de ces appareils permet de réduire significativement notre impact environnemental.",
    tips: [
      {
        id: 0,
        title: "Ventilation efficace",
        icon: "fan",
        description:
          "Arrêtez le ventilateur en quittant une pièce et débranchez-le lorsqu'il n'est pas utilisé.",
      },
      {
        id: 1,
        title: "Entretien régulier",
        icon: "washer",
        description:
          "Nettoyez régulièrement vos appareils pour maintenir leur efficacité énergétique.",
      },
      {
        id: 2,
        title: "Usage optimal",
        icon: "iron",
        description:
          "Utilisez vos appareils aux heures creuses et privilégiez les programmes éco.",
      },
    ],
  },
};
// Advice Card Component
const AdviceCard = ({ item, isActive, onClick }) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    onClick={onClick}
    className={`
        bg-white 
        rounded-[20px] 
        p-6 
        cursor-pointer 
        transition-all 
        duration-300
        w-[250px]
        aspect-[1]
hover:bg-gray-50
        ${
          isActive
            ? "border-[3px] border-[#47B5B0] "
            : "border-2  hover:border-[#47B5B0]/20 "
        }
      `}
  >
    <div className="flex items-start gap-4 mb-4">
      <div
        className={`p-4 rounded-xl ${
          isActive
            ? "bg-gradient-to-br from-[#47B5B0]/10 to-[#47B5B0]/5"
            : "bg-gray-50"
        }`}
      />
    </div>
    <h3
      className={`text-lg font-semibold mb-2 ${
        isActive ? "text-[#47B5B0]" : "text-gray-700"
      }`}
    >
      {item.title}
    </h3>
    <p className="text-sm text-gray-600">{item.description}</p>
  </motion.div>
);

export default function Page() {
  const [activeAdvice, setActiveAdvice] = useState(0);
  const [activeSection, setActiveSection] = useState("froid");

  return (
    <div className="pt-10">
      {/* Section 7 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        className="
        w-full md:w-[90%] 
        mx-auto 
        mb-20 sm:mb-32 md:mb-40
        px-4 sm:px-6 md:px-8
      "
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full relative group"
        >
          <Image
            src="/section7/image.png"
            alt="Nos solutions"
            width={1200}
            height={800}
            className="
            w-full 
            h-auto 
            rounded-[40px] 
            shadow-lg 
            transform 
            group-hover:scale-[1.02] 
            transition-transform 
            duration-500
          "
          />
        </motion.div>
      </motion.section>

      {/* Section 8 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        className="
        w-full 
        md:w-[80%] 
        mx-auto 
        mb-10 sm:mb-12 md:mb-16 
        px-4 sm:px-6 md:px-8
      "
      >
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/5 w-full"
          >
            <div className="space-y-2">
              {[
                { name: "Appareils de froid", id: "froid", icon: "❄️" },
                { name: "Éclairage", id: "eclairage", icon: "💡" },
                { name: "Multimédia", id: "multimedia", icon: "🖥️" },
                { name: "Équipements", id: "equipements", icon: "⚡" },
              ].map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02, x: 4 }}
                  onClick={() => setActiveSection(item.id)}
                  className={`
                  w-full 
                  text-left 
                  px-6 py-3 
                  rounded-xl 
                  mb-2 
                  flex 
                  items-center 
                  gap-3 
                  transition-all 
                  duration-300 
                  relative
                  ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-[#47B5B0] to-[#47B5B0]/80 text-white shadow-md"
                      : "hover:bg-[#47B5B0]/5 text-[#474443]/70"
                  }
                `}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                  {activeSection === item.id && (
                    <motion.svg
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      width="15"
                      height="25"
                      viewBox="0 0 15 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute right-4"
                    >
                      <path
                        d="M11.9062 11.2189L4.35938 4.73455C3.26562 3.79705 1.5625 4.5783 1.5625 6.0158V18.9689C1.5625 20.4221 3.26562 21.1877 4.35938 20.2502L11.9062 13.7814C12.6875 13.1095 12.6875 11.8908 11.9062 11.2189Z"
                        fill="currentColor"
                      />
                    </motion.svg>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
          <div className="flex-1 w-full">
            <EnergySavingSection
              activeSection={activeSection}
              setActiveAdvice={setActiveAdvice}
              activeAdvice={activeAdvice}
            />
          </div>
        </div>
      </motion.section>
    </div>
  );
}

interface EnergySavingSectionProps {
  activeSection: any;
  setActiveAdvice: any;
  activeAdvice: any;
}

const EnergySavingSection = ({
  activeSection,
  setActiveAdvice,
  activeAdvice,
}: EnergySavingSectionProps) => {
  // Return null if section doesn't exist
  if (!sectionData[activeSection]) return null;

  const section = sectionData[activeSection];
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the active card
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 280 + 24; // card width + gap
      const scrollPosition = activeAdvice * cardWidth;

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [activeAdvice]);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center max-w-6xl -mx-12">
        <div className="relative aspect-square rounded-[30px] overflow-hidden -mb-4">
          <Image
            src={section.image}
            alt={`Illustration ${section.title}`}
            layout="fill"
            objectFit="contain"
            className="transform hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="space-y-2 w-[140%]">
          <div className="bg-white rounded-[20px] mb-8">
            <p className="text-gray-700 text-lg leading-relaxed text-justify">
              {section.description}
            </p>

            {/* Cards container with horizontal scroll */}
            <div className="mt-6">
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <div className="flex gap-2">
                  {section.tips.map((item) => (
                    <div key={item.id} className="snap-center">
                      <AdviceCard
                        item={item}
                        isActive={activeAdvice === item.id}
                        onClick={() => setActiveAdvice(item.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination directly under cards */}
              <Pagination
                activeIndex={activeAdvice}
                totalItems={section.tips.length}
                onClick={setActiveAdvice}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({ activeIndex, totalItems, onClick }: any) => (
  <div className="flex justify-center gap-1 mt-2">
    {Array.from({ length: totalItems }, (_, index) => (
      <motion.button
        key={index}
        whileHover={{ scale: 1.2 }}
        onClick={() => onClick(index)}
        className={`
            h-2 
            rounded-full 
            transition-all 
            duration-300
            ${
              activeIndex === index
                ? "w-8 bg-gradient-to-r from-[#47B5B0] to-[#47B5B0]/80"
                : "w-4 bg-[#47B5B0]/20 hover:bg-[#47B5B0]/40"
            }
          `}
      />
    ))}
  </div>
);
