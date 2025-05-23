"use client";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

/* ──────────────────────────
   Types & données mock
────────────────────────── */

interface Category {
  slug: string;
  label: string;
  illustration: string;
  puissance: string;
  equipements: Equipement[];
  color?: string;
}

interface Equipement {
  id: string;
  label: string;
  puissance: number;
}

interface SelectedEquipement {
  id: string;
  categorySlug: string;
  quantity: number;
  puissance: number;
  label?: string;
}

const CATEGORIES: Category[] = [
  {
    slug: "froid",
    label: "Appareils de froid",
    illustration: "/simulateur/clim.png",
    puissance: "150-500W",
    color: "#90CDF4",
    equipements: [
      { id: "refrigerateur", label: "Réfrigérateur", puissance: 150 },
      { id: "congelateur", label: "Congélateur", puissance: 200 },
      {
        id: "refrigerateur-congelateur",
        label: "Réfrigérateur-congélateur",
        puissance: 350,
      },
      { id: "cave-a-vin", label: "Cave à vin", puissance: 100 },
      { id: "mini-refrigerateur", label: "Mini-réfrigérateur", puissance: 70 },
    ],
  },
  {
    slug: "eclairage",
    label: "Éclairage",
    illustration: "/simulateur/eau.png",
    puissance: "20-100W",
    color: "#FBD38D",
    equipements: [
      { id: "ampoule-led", label: "Ampoule LED", puissance: 10 },
      {
        id: "ampoule-basse-consommation",
        label: "Ampoule basse consommation",
        puissance: 20,
      },
      { id: "ampoule-halogene", label: "Ampoule halogène", puissance: 50 },
      { id: "lampadaire", label: "Lampadaire", puissance: 60 },
      { id: "spot-encastre", label: "Spot encastré", puissance: 35 },
    ],
  },
  {
    slug: "multimedia",
    label: "Multimédia",
    illustration: "/simulateur/bureau.png",
    puissance: "50-400W",
    color: "#9AE6B4",
    equipements: [
      { id: "television", label: "Télévision", puissance: 150 },
      { id: "ordinateur", label: "Ordinateur", puissance: 250 },
      { id: "console", label: "Console de jeux", puissance: 180 },
      { id: "chaine-hifi", label: "Chaîne Hi-Fi", puissance: 80 },
      { id: "home-cinema", label: "Home Cinéma", puissance: 300 },
      { id: "box-internet", label: "Box Internet", puissance: 15 },
    ],
  },
  {
    slug: "equipements",
    label: "Équipements",
    illustration: "/simulateur/cuisine.png",
    puissance: "500-3000W",
    color: "#D53F8C",
    equipements: [
      { id: "lave-linge", label: "Lave-linge", puissance: 2000 },
      { id: "seche-linge", label: "Sèche-linge", puissance: 3000 },
      { id: "lave-vaisselle", label: "Lave-vaisselle", puissance: 1500 },
      { id: "four", label: "Four", puissance: 2500 },
      { id: "micro-onde", label: "Micro-onde", puissance: 800 },
      { id: "aspirateur", label: "Aspirateur", puissance: 700 },
      { id: "fer-repasser", label: "Fer à repasser", puissance: 1500 },
      { id: "climatiseur", label: "Climatiseur", puissance: 1500 },
      { id: "chauffe-eau", label: "Chauffe-eau électrique", puissance: 2000 },
      { id: "radiateur", label: "Radiateur électrique", puissance: 1500 },
    ],
  },
];

interface SimulatorPageProps {
  /** Titre principal (H1) */
  title?: string;
  description?: string;
  /** Couleur de la ligne décorative sous le titre */
  highlightColor?: string;
}

/* ──────────────────────────
   Composant
────────────────────────── */

export default function SimulatorPage({
  title = "Simulateur de puissance",
  description = "Estimez la puissance de vos appareils électriques",
  highlightColor = "orange",
}: SimulatorPageProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] =
    useState<string>("froid");
  const [selectedEquipements, setSelectedEquipements] = useState<
    SelectedEquipement[]
  >([]);
  const [step, setStep] = useState<number>(1);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [newEquipementName, setNewEquipementName] = useState("");
  const [newEquipementPower, setNewEquipementPower] = useState("");
  const [showAddEquipementForm, setShowAddEquipementForm] = useState(false);
  const [showStickyButton, setShowStickyButton] = useState(false);

  useEffect(() => {
    // Initialiser les équipements par défaut avec quantité 1 pour la première catégorie
    if (selectedEquipements.length === 0 && CATEGORIES.length > 0) {
      const initialEquipements: SelectedEquipement[] =
        CATEGORIES[0].equipements.map((eq) => ({
          id: eq.id,
          categorySlug: CATEGORIES[0].slug,
          quantity: 1,
          puissance: eq.puissance,
        }));
      setSelectedEquipements(initialEquipements);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowStickyButton(true);
      } else {
        setShowStickyButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleQuantityChange = (
    equipementId: string,
    categorySlug: string,
    puissance: number,
    change: number
  ) => {
    setSelectedEquipements((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === equipementId && item.categorySlug === categorySlug
      );

      if (existingIndex >= 0) {
        // Mise à jour d'un équipement existant
        const newQuantity = Math.max(0, prev[existingIndex].quantity + change);

        if (newQuantity === 0) {
          // Supprimer l'équipement si la quantité est 0
          return prev.filter((_, i) => i !== existingIndex);
        }

        // Mettre à jour la quantité
        const newEquipements = [...prev];
        newEquipements[existingIndex] = {
          ...newEquipements[existingIndex],
          quantity: newQuantity,
        };
        return newEquipements;
      } else if (change > 0) {
        // Ajouter un nouvel équipement
        return [
          ...prev,
          {
            id: equipementId,
            categorySlug,
            quantity: 1,
            puissance,
          },
        ];
      }

      return prev;
    });
  };

  const getEquipementQuantity = (
    equipementId: string,
    categorySlug: string
  ): number => {
    const equipement = selectedEquipements.find(
      (eq) => eq.id === equipementId && eq.categorySlug === categorySlug
    );
    return equipement ? equipement.quantity : 0;
  };

  const getTotalPuissance = (): number => {
    return selectedEquipements.reduce((total, eq) => {
      return total + eq.puissance * eq.quantity;
    }, 0);
  };

  const selectedCategory = CATEGORIES.find(
    (cat) => cat.slug === selectedCategoryTab
  );

  const calculateAmperage = (watts: number): number => {
    // Formule: I (Ampères) = P (Watts) / V (Volts)
    // En France, la tension standard est de 230V
    const volts = 230;
    return watts / volts;
  };

  const handleAddEquipement = () => {
    if (!selectedCategory || !newEquipementName || !newEquipementPower) return;

    // Créer un ID lisible basé sur le nom de l'équipement
    const cleanName = newEquipementName.toLowerCase().replace(/\s+/g, "-");
    const newId = `custom-${cleanName}`;

    // Ajouter le nouvel équipement à la catégorie actuelle
    const powerValue = parseInt(newEquipementPower, 10);

    // Ajouter directement aux équipements sélectionnés
    setSelectedEquipements((prev) => [
      ...prev,
      {
        id: newId,
        categorySlug: selectedCategoryTab,
        quantity: 1,
        puissance: powerValue,
        label: newEquipementName, // Stocker explicitement le nom saisi
      },
    ]);

    // Réinitialiser le formulaire
    setNewEquipementName("");
    setNewEquipementPower("");
    setShowAddEquipementForm(false);
  };

  const handleNext = () => {
    const currentIndex = CATEGORIES.findIndex(
      (cat) => cat.slug === selectedCategoryTab
    );

    if (currentIndex < CATEGORIES.length - 1) {
      // Passer à la catégorie suivante
      setSelectedCategoryTab(CATEGORIES[currentIndex + 1].slug);
    } else {
      // On a terminé toutes les catégories, on démarre le calcul final
      setIsCalculating(true);
      setShowModal(false);

      // Simuler un temps de calcul avec un délai
      setTimeout(() => {
        setIsCalculating(false);
        setShowResultModal(true);
      }, 1500);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  // Fonction pour compter le nombre d'équipements sélectionnés dans une catégorie
  const getCategoryEquipementCount = (categorySlug: string): number => {
    return selectedEquipements.filter(
      (eq) => eq.categorySlug === categorySlug && eq.quantity > 0
    ).length;
  };

  return (
    <>
      <div className="min-h-screen flex items-start justify-center pt-10 pb-20 -mb-[100px]">
        <div className="w-[91%]">
          <div className="bg-gradient-to-br from-[#F5F5F5] to-white rounded-[30px] overflow-hidden relative  border border-orange/10">
            {/* Titre & sous‑texte améliorés */}
            <header className="px-8 py-10 relative text-center">
              <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-noir relative inline-block">
                {title}
                <div
                  className={`absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-${highlightColor} to-transparent`}
                ></div>
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto relative">
                {description}
              </p>

              {/* Sous-titre explicatif amélioré pour contraste */}
            </header>

            {/* Contenu principal */}
            <div className="w-[70%] mx-auto px-2 py-6">
              {/* Bouton principal de simulation déplacé en haut avant le contenu */}

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Colonne de gauche: information générale */}
                <div className="w-full lg:w-3/3 bg-white rounded-xl overflow-hidden border border-gray-100 order-2 lg:order-1">
                  <div className="p-6 flex flex-col md:flex-row items-center justify-center">
                    <div className="md:w-1/3 flex flex-col justify-center items-center mb-6 md:mb-0 md:mr-6 mx-auto">
                      <div className="flex justify-center w-full">
                        <Image
                          src="/simulateur/puissance.png"
                          alt="Illustration de puissance électrique"
                          width={300}
                          height={300}
                          className="object-contain"
                        />
                      </div>

                      <div className="mt-6 w-full max-w-xs mx-auto">
                        <button
                          className="w-full py-5 bg-orange text-white font-bold text-xl rounded-xl shadow-xl transition-all duration-300 group relative overflow-hidden transform hover:scale-[1.02] hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 active:bg-orange-700"
                          onClick={() => setShowModal(true)}
                          aria-label="Lancer la simulation de puissance électrique"
                        >
                          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full animate-shimmer"></span>
                          <div className="relative flex items-center justify-center gap-3 px-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-7 w-7 animate-pulse"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="group-hover:tracking-wider transition-all text-sm duration-300">
                              LANCER LA SIMULATION
                            </span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 transform group-hover:translate-x-1 transition-transform duration-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="md:w-2/3">
                      <h2 className="text-3xl font-semibold text-gray-800 mb-8 ">
                        Comment ça marche ?
                      </h2>

                      {/* Étapes de simulation ajoutées */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm relative">
                          <div
                            className="absolute -top-2 -left-2 w-6 h-6 bg-orange text-white rounded-full flex items-center justify-center font-bold text-xs"
                            aria-hidden="true"
                          >
                            1
                          </div>
                          <h3 className="font-bold text-base mb-2 mt-1 pl-2">
                            Sélectionnez vos appareils
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Parcourez notre catalogue d'appareils électriques
                            par catégorie
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm relative">
                          <div
                            className="absolute -top-2 -left-2 w-6 h-6 bg-orange text-white rounded-full flex items-center justify-center font-bold text-xs"
                            aria-hidden="true"
                          >
                            2
                          </div>
                          <h3 className="font-bold text-base mb-2 mt-1 pl-2">
                            Ajustez les quantités
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Indiquez combien d'appareils de chaque type vous
                            utilisez
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm relative">
                          <div
                            className="absolute -top-2 -left-2 w-6 h-6 bg-orange text-white rounded-full flex items-center justify-center font-bold text-xs"
                            aria-hidden="true"
                          >
                            3
                          </div>
                          <h3 className="font-bold text-base mb-2 mt-1 pl-2">
                            Obtenez votre résultat
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Découvrez instantanément la puissance électrique
                            nécessaire
                          </p>
                        </div>
                      </div>

                      {/* Sections détaillées avec accordéon */}
                      <div className="space-y-4 mb-8">
                        <details className="group bg-gray-50 rounded-lg border border-gray-100 overflow-hidden transition-all duration-300">
                          <summary className="flex items-center gap-2 p-4 cursor-pointer list-none">
                            <span className="text-orange font-medium text-lg">
                              *
                            </span>
                            <h4 className="font-medium text-base">
                              Pourquoi faire une simulation ?
                            </h4>
                            <svg
                              className="h-5 w-5 ml-auto transform group-open:rotate-180 transition-transform duration-300"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </summary>
                          <div className="p-4 pt-0">
                            <ul className="space-y-3">
                              <li className="flex items-start gap-2">
                                <p className="text-gray-700 text-sm">
                                  <span className="font-semibold">
                                    Évitez les surcharges
                                  </span>{" "}
                                  - Déterminez si votre installation électrique
                                  est adaptée
                                </p>
                              </li>
                              <li className="flex items-start gap-2">
                                <p className="text-gray-700 text-sm">
                                  <span className="font-semibold">
                                    Optimisez votre contrat
                                  </span>{" "}
                                  - Choisissez l'abonnement adapté
                                </p>
                              </li>
                              <li className="flex items-start gap-2">
                                <p className="text-gray-700 text-sm">
                                  <span className="font-semibold">
                                    Planifiez en sécurité
                                  </span>{" "}
                                  - Anticipez vos besoins actuels et futurs
                                </p>
                              </li>
                            </ul>
                          </div>
                        </details>

                        <details className="group bg-gray-50 rounded-lg border border-gray-100 overflow-hidden transition-all duration-300">
                          <summary className="flex items-center gap-2 p-4 cursor-pointer list-none">
                            <span className="text-orange font-medium text-lg">
                              *
                            </span>
                            <h4 className="font-medium text-base">
                              Comment réduire ma consommation ?
                            </h4>
                            <svg
                              className="h-5 w-5 ml-auto transform group-open:rotate-180 transition-transform duration-300"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </summary>
                          <div className="p-4 pt-0">
                            <ul className="space-y-1.5 text-sm">
                              <li className="flex items-start gap-2">
                                <span
                                  className="text-orange-700 font-bold"
                                  aria-hidden="true"
                                >
                                  •
                                </span>
                                <p className="text-gray-700">
                                  Privilégiez les appareils de classe A+++ ou
                                  supérieure
                                </p>
                              </li>
                              <li className="flex items-start gap-2">
                                <span
                                  className="text-orange-700 font-bold"
                                  aria-hidden="true"
                                >
                                  •
                                </span>
                                <p className="text-gray-700">
                                  Éteignez complètement vos appareils en veille
                                </p>
                              </li>
                              <li className="flex items-start gap-2">
                                <span
                                  className="text-orange-700 font-bold"
                                  aria-hidden="true"
                                >
                                  •
                                </span>
                                <p className="text-gray-700">
                                  Réglez votre chauffage à des températures
                                  raisonnables
                                </p>
                              </li>
                              <li className="flex items-start gap-2">
                                <span
                                  className="text-orange-700 font-bold"
                                  aria-hidden="true"
                                >
                                  •
                                </span>
                                <p className="text-gray-700">
                                  Utilisez des multiprises avec interrupteur
                                </p>
                              </li>
                            </ul>
                          </div>
                        </details>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Colonne de droite: catégories d'appareils */}
              </div>
            </div>

            {/* Bouton sticky qui apparaît lors du défilement */}
            <AnimatePresence>
              {showStickyButton && (
                <motion.div
                  className="fixed bottom-6 right-6 z-50 shadow-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    className="flex items-center gap-2 py-3 px-6 bg-orange rounded-full text-white font-bold hover:bg-orange-600 transition-colors duration-300 shadow-lg"
                    onClick={() => {
                      setShowModal(true);
                      // Remonter en haut de la page
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    aria-label="Lancer la simulation maintenant"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 animate-pulse"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Simuler ma puissance
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modal pour la sélection d'équipements */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-start justify-center pt-32 bg-black/60 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl w-full max-w-5xl max-h-[85vh] overflow-y-auto shadow-xl mb-20 mt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-2">
                <div className="p-8 border border-gray-100 rounded-3xl">
                  <h2 className="text-2xl font-bold mb-10 text-center text-gray-900">
                    Sélectionnez une catégorie d'appareils
                  </h2>

                  {/* Tabs pour les catégories avec style amélioré */}
                  <div className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                      {CATEGORIES.map((category, index) => {
                        const isActive = selectedCategoryTab === category.slug;
                        const isPast =
                          CATEGORIES.findIndex(
                            (c) => c.slug === selectedCategoryTab
                          ) > index;
                        const categoryCount = getCategoryEquipementCount(
                          category.slug
                        );

                        return (
                          <div
                            key={category.slug}
                            className={`flex flex-col items-center relative cursor-pointer w-full mx-1 ${
                              isActive ? "z-10" : ""
                            }`}
                            onClick={() =>
                              setSelectedCategoryTab(category.slug)
                            }
                          >
                            <div className="text-center mb-1 relative">
                              <p
                                className={`text-xs md:text-sm font-medium transition-colors duration-300 ${
                                  isActive
                                    ? "text-orange"
                                    : isPast
                                    ? "text-orange/70"
                                    : "text-gray-400"
                                }`}
                              >
                                {category.label.split(" ")[0]}
                              </p>

                              {isActive && categoryCount > 0 && (
                                <div className="absolute -right-4 -top-2 w-5 h-5 bg-orange rounded-full flex items-center justify-center text-xs text-white font-medium">
                                  {categoryCount}
                                </div>
                              )}

                              {isPast && (
                                <div className="absolute -right-4 -top-2 w-5 h-5 bg-orange/80 rounded-full flex items-center justify-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3 w-3 text-white"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Barre de progression */}
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange transition-all duration-500 ease-in-out"
                        style={{
                          width: `${
                            (CATEGORIES.findIndex(
                              (c) => c.slug === selectedCategoryTab
                            ) +
                              1) *
                            (100 / CATEGORIES.length)
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Grille d'équipements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 px-4">
                    {selectedCategory?.equipements.map((equipement) => {
                      const quantity = getEquipementQuantity(
                        equipement.id,
                        selectedCategoryTab
                      );
                      const isSelected = quantity > 0;

                      return (
                        <div
                          key={equipement.id}
                          className={`
                            flex items-center justify-between rounded-xl p-5 transition-all duration-200
                            ${
                              isSelected
                                ? "border-2 border-orange/30 bg-orange/5 shadow-sm"
                                : "border border-gray-200 hover:border-orange/20 hover:bg-orange/5"
                            }
                          `}
                        >
                          <div className="font-medium text-gray-800">
                            {equipement.label}
                          </div>
                          <div className="flex items-center">
                            <button
                              className={`
                                w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange/50
                                ${
                                  quantity > 0
                                    ? "bg-orange text-white shadow-md hover:shadow-lg"
                                    : "bg-gray-200 text-gray-600 hover:bg-orange/80 hover:text-white"
                                }
                              `}
                              onClick={() =>
                                handleQuantityChange(
                                  equipement.id,
                                  selectedCategoryTab,
                                  equipement.puissance,
                                  -1
                                )
                              }
                              aria-label="Réduire la quantité"
                            >
                              <span className="text-lg font-medium">-</span>
                            </button>
                            <span className="mx-4 min-w-10 text-center font-medium text-lg">
                              {quantity || 0}
                            </span>
                            <button
                              className="w-9 h-9 flex items-center justify-center rounded-full bg-orange text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange/50"
                              onClick={() =>
                                handleQuantityChange(
                                  equipement.id,
                                  selectedCategoryTab,
                                  equipement.puissance,
                                  1
                                )
                              }
                              aria-label="Augmenter la quantité"
                            >
                              <span className="text-lg font-medium">+</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Équipements personnalisés */}
                    {selectedEquipements
                      .filter(
                        (eq) =>
                          eq.categorySlug === selectedCategoryTab &&
                          !selectedCategory?.equipements.some(
                            (e) => e.id === eq.id
                          )
                      )
                      .map((customEq) => (
                        <div
                          key={customEq.id}
                          className="flex items-center justify-between rounded-xl p-5 border-2 border-orange/30 bg-orange/5 shadow-sm"
                        >
                          <div className="font-medium text-gray-800 flex items-center">
                            <span className="text-gray-800">
                              {customEq.label || "Équipement personnalisé"}
                            </span>
                            <span className="ml-2 text-xs text-orange">
                              (Personnalisé)
                            </span>
                          </div>
                          <div className="flex items-center">
                            <button
                              className="w-9 h-9 flex items-center justify-center rounded-full bg-orange text-white transition-colors"
                              onClick={() =>
                                handleQuantityChange(
                                  customEq.id,
                                  selectedCategoryTab,
                                  customEq.puissance,
                                  -1
                                )
                              }
                            >
                              <span className="text-lg font-medium">-</span>
                            </button>
                            <span className="mx-4 min-w-10 text-center font-medium text-lg">
                              {customEq.quantity}
                            </span>
                            <button
                              className="w-9 h-9 flex items-center justify-center rounded-full bg-orange text-white transition-opacity hover:opacity-90"
                              onClick={() =>
                                handleQuantityChange(
                                  customEq.id,
                                  selectedCategoryTab,
                                  customEq.puissance,
                                  1
                                )
                              }
                            >
                              <span className="text-lg font-medium">+</span>
                            </button>
                          </div>
                        </div>
                      ))}

                    {/* Formulaire pour ajouter un équipement */}
                    {showAddEquipementForm && (
                      <div className="md:col-span-2 p-5 border-2 border-orange/30 bg-orange/5 rounded-xl">
                        <h3 className="text-lg font-medium mb-4 text-gray-800">
                          Ajouter un équipement personnalisé
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nom de l'équipement
                            </label>
                            <input
                              type="text"
                              value={newEquipementName}
                              onChange={(e) =>
                                setNewEquipementName(e.target.value)
                              }
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange/50"
                              placeholder="Ex: Machine à café"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Puissance (kWh)
                            </label>
                            <input
                              type="number"
                              value={newEquipementPower}
                              onChange={(e) =>
                                setNewEquipementPower(e.target.value)
                              }
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange/50"
                              placeholder="Ex: 1500"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            onClick={() => setShowAddEquipementForm(false)}
                          >
                            Annuler
                          </button>
                          <button
                            className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange/90 transition-colors"
                            onClick={handleAddEquipement}
                          >
                            Ajouter
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Bouton pour ajouter un équipement */}
                    {!showAddEquipementForm && (
                      <div className="flex justify-center md:col-span-2 mt-4">
                        <button
                          className="flex items-center justify-center gap-2 px-4 py-2 text-orange hover:bg-orange/10 rounded-lg transition-all duration-200 border border-transparent hover:border-orange/30 focus:outline-none focus:ring-2 focus:ring-orange/20"
                          onClick={() => setShowAddEquipementForm(true)}
                        >
                          <span className="w-6 h-6 rounded-full bg-orange text-white flex items-center justify-center shadow-sm">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                          <span className="font-medium">
                            Ajouter un équipement
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Boutons d'action */}
                  <div className="mt-8 max-w-md mx-auto">
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        className="py-3 px-4 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        onClick={handleCancel}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.707 5.293a1 1 0 010 1.414L7.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Précédent</span>
                      </button>
                      <button
                        className="py-3 px-4 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-1 transform hover:translate-y-[-1px] focus:outline-none focus:ring-2 focus:ring-green-500"
                        onClick={() => {
                          setIsCalculating(true);
                          setShowModal(false);

                          // Simuler un temps de calcul avec un délai
                          setTimeout(() => {
                            setIsCalculating(false);
                            setShowResultModal(true);
                          }, 1500);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Simuler</span>
                      </button>
                      <button
                        className="py-3 px-4 bg-orange text-white rounded-full font-medium hover:bg-orange/90 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-1 transform hover:translate-y-[-1px] focus:outline-none focus:ring-2 focus:ring-orange/50"
                        onClick={handleNext}
                      >
                        <span>Suivant</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal avec le loader pendant le calcul */}
      <AnimatePresence>
        {isCalculating && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl p-12 max-w-md shadow-xl text-center mt-20"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 border-4 border-gray-200 border-t-orange rounded-full animate-spin mx-auto mb-6"></div>
              <h3 className="text-xl font-bold mb-2">Calcul en cours...</h3>
              <p className="text-gray-600">
                Nous calculons l'ampérage nécessaire pour vos équipements.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal pour afficher les résultats */}
      <AnimatePresence>
        {showResultModal && (
          <motion.div
            className="fixed inset-0 z-[10000] flex items-start justify-center pt-32 bg-black/60 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl w-full max-w-2xl shadow-xl mb-20 mt-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-8">
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Résultats de la simulation
                  </h2>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setShowResultModal(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="bg-gradient-to-br from-orange/10 to-orange/5 rounded-2xl p-6 mb-8 shadow-md transform transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">
                  <div className="grid grid-cols-2 gap-8 mb-6">
                    <div className="flex flex-col justify-center items-center bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm transition-transform duration-300 hover:shadow-md hover:translate-y-[-2px]">
                      <p className="text-gray-500 mb-1 text-sm font-medium">
                        PUISSANCE TOTALE
                      </p>
                      <div className="flex items-baseline">
                        <span className="text-5xl font-bold text-orange mb-1">
                          {getTotalPuissance()}
                        </span>
                        <span className="text-xl text-orange ml-2">kWh</span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm transition-transform duration-300 hover:shadow-md hover:translate-y-[-2px]">
                      <p className="text-gray-500 mb-1 text-sm font-medium">
                        AMPÉRAGE REQUIS
                      </p>
                      <div className="flex items-baseline">
                        <span className="text-5xl font-bold text-orange mb-1">
                          {calculateAmperage(getTotalPuissance()).toFixed(0)}
                        </span>
                        <span className="text-xl text-orange ml-2">A</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 shadow-sm border border-orange/10">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-orange mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Informations CIE:
                    </h3>
                    <p className="text-gray-700 pl-7 border-l-2 border-orange/30">
                      Ces valeurs représentent la consommation totale lorsque
                      tous les appareils sélectionnés fonctionnent en même
                      temps. Les puissances indiquées sont celles conseillées
                      par la CIE pour les appareils sélectionnés.
                    </p>
                    <div className="mt-4 bg-gradient-to-r from-orange/5 to-orange/10 p-4 rounded-lg">
                      <p className="text-gray-700 font-medium">
                        {calculateAmperage(getTotalPuissance()) <= 16 ? (
                          <span className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Votre installation est compatible avec un abonnement
                            standard de 16A.
                          </span>
                        ) : calculateAmperage(getTotalPuissance()) <= 32 ? (
                          <span className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Nous vous recommandons un abonnement renforcé de 32A
                            pour votre installation.
                          </span>
                        ) : (
                          <span className="flex items-center"></span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-orange mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Équipements sélectionnés:
                  </h3>
                  <div className="max-h-60 overflow-y-auto pr-2 rounded-xl border border-gray-100 shadow-sm bg-white/70 backdrop-blur-sm">
                    <table className="w-full">
                      <thead className="text-left sticky top-0 bg-gray-50 border-b border-gray-100 shadow-sm">
                        <tr>
                          <th className="py-3 px-4 text-sm font-medium text-gray-600">
                            Équipement
                          </th>
                          <th className="py-3 px-4 text-sm font-medium text-gray-600">
                            Quantité
                          </th>
                          <th className="py-3 px-4 text-sm font-medium text-gray-600">
                            Puissance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedEquipements.map((eq) => {
                          const category = CATEGORIES.find(
                            (cat) => cat.slug === eq.categorySlug
                          );
                          const equipement = category?.equipements.find(
                            (e) => e.id === eq.id
                          );

                          return (
                            <tr
                              key={eq.id}
                              className="hover:bg-orange/5 transition-colors duration-150"
                            >
                              <td className="py-3 px-4 text-sm font-medium">
                                {equipement
                                  ? equipement.label
                                  : eq.label || "Équipement personnalisé"}
                              </td>
                              <td className="py-3 px-4 text-sm">
                                {eq.quantity}
                              </td>
                              <td className="py-3 px-4 text-sm font-medium text-orange">
                                {eq.puissance * eq.quantity} W
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    className="py-3 px-8 bg-orange text-white rounded-full font-medium hover:bg-orange/90 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform hover:translate-y-[-1px] focus:outline-none focus:ring-2 focus:ring-orange/50 relative overflow-hidden group"
                    onClick={() => setShowResultModal(false)}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:animate-shimmer"></span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Fermer</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ajouter les animations personnalisées en bas de fichier */}
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        @keyframes floating {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-floating {
          animation: floating 3s ease-in-out infinite;
        }
        .animate-floating-slow {
          animation: floating 5s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.85;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-rotate-slow {
          animation: rotate 60s linear infinite;
        }
        @keyframes counter-rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
        .animate-counter-rotate {
          animation: counter-rotate 60s linear infinite;
        }
      `}</style>
    </>
  );
}
