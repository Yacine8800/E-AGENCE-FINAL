/* ---------------------------------------------------------------------------
   components/SimulatorPage.tsx
--------------------------------------------------------------------------- */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
    slug: "cuisine",
    label: "Cuisine",
    illustration: "/simulateur/cuisine.png",
    puissance: "1500-5000W",
    color: "#FBD38D",
    equipements: [
      { id: "refrigerateur", label: "Réfrigérateur", puissance: 150 },
      { id: "congelateur", label: "Congélateur", puissance: 200 },
      { id: "lave-vaisselle", label: "Lave-vaisselle", puissance: 1500 },
      { id: "four", label: "Four", puissance: 2500 },
      { id: "micro-onde", label: "Micro-onde", puissance: 800 },
      { id: "cuisiniere", label: "Cuisinière", puissance: 2000 },
      { id: "grille-pain", label: "Grille-pain", puissance: 900 },
      { id: "mixeur", label: "Mixeur", puissance: 500 }
    ]
  },
  {
    slug: "bureau",
    label: "Bureau et divertissements",
    illustration: "/simulateur/bureau.png",
    puissance: "400-1000W",
    color: "#90CDF4",
    equipements: [
      { id: "ordinateur", label: "Ordinateur", puissance: 250 },
      { id: "television", label: "Télévision", puissance: 150 },
      { id: "console", label: "Console de jeux", puissance: 180 },
      { id: "imprimante", label: "Imprimante", puissance: 100 }
    ]
  },
  {
    slug: "chauffage",
    label: "Chauffage de l'eau",
    illustration: "/simulateur/eau.png",
    puissance: "1500-3000W",
    color: "#9AE6B4",
    equipements: [
      { id: "chauffe-eau", label: "Chauffe-eau électrique", puissance: 2000 },
      { id: "radiateur", label: "Radiateur électrique", puissance: 1500 },
      { id: "seche-serviette", label: "Sèche-serviette", puissance: 800 }
    ]
  },
  {
    slug: "clim",
    label: "Climatisation",
    illustration: "/simulateur/clim.png",
    puissance: "900-2500W",
    color: "#81E6D9",
    equipements: [
      { id: "climatiseur", label: "Climatiseur", puissance: 1500 },
      { id: "ventilateur", label: "Ventilateur", puissance: 100 }
    ]
  },
  {
    slug: "laver",
    label: "Lave et repassage",
    illustration: "/simulateur/laver.png",
    puissance: "2000-4000W",
    color: "#D53F8C",
    equipements: [
      { id: "lave-linge", label: "Lave-linge", puissance: 2000 },
      { id: "seche-linge", label: "Sèche-linge", puissance: 3000 },
      { id: "fer-repasser", label: "Fer à repasser", puissance: 1500 }
    ]
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
  highlightColor = "orange"
}: SimulatorPageProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("cuisine");
  const [selectedEquipements, setSelectedEquipements] = useState<SelectedEquipement[]>([]);
  const [step, setStep] = useState<number>(1);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [newEquipementName, setNewEquipementName] = useState("");
  const [newEquipementPower, setNewEquipementPower] = useState("");
  const [showAddEquipementForm, setShowAddEquipementForm] = useState(false);

  useEffect(() => {
    // Initialiser les équipements par défaut avec quantité 1 pour la première catégorie
    if (selectedEquipements.length === 0 && CATEGORIES.length > 0) {
      const initialEquipements: SelectedEquipement[] = CATEGORIES[0].equipements.map(eq => ({
        id: eq.id,
        categorySlug: CATEGORIES[0].slug,
        quantity: 1,
        puissance: eq.puissance
      }));
      setSelectedEquipements(initialEquipements);
    }
  }, []);

  const handleQuantityChange = (equipementId: string, categorySlug: string, puissance: number, change: number) => {
    setSelectedEquipements(prev => {
      const existingIndex = prev.findIndex(item => item.id === equipementId && item.categorySlug === categorySlug);

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
          quantity: newQuantity
        };
        return newEquipements;
      } else if (change > 0) {
        // Ajouter un nouvel équipement
        return [...prev, {
          id: equipementId,
          categorySlug,
          quantity: 1,
          puissance
        }];
      }

      return prev;
    });
  };

  const getEquipementQuantity = (equipementId: string, categorySlug: string): number => {
    const equipement = selectedEquipements.find(
      eq => eq.id === equipementId && eq.categorySlug === categorySlug
    );
    return equipement ? equipement.quantity : 0;
  };

  const getTotalPuissance = (): number => {
    return selectedEquipements.reduce((total, eq) => {
      return total + (eq.puissance * eq.quantity);
    }, 0);
  };

  const selectedCategory = CATEGORIES.find(cat => cat.slug === selectedCategoryTab);

  const calculateAmperage = (watts: number): number => {
    // Formule: I (Ampères) = P (Watts) / V (Volts)
    // En France, la tension standard est de 230V
    const volts = 230;
    return watts / volts;
  };

  const handleAddEquipement = () => {
    if (!selectedCategory || !newEquipementName || !newEquipementPower) return;

    // Créer un ID lisible basé sur le nom de l'équipement
    const cleanName = newEquipementName.toLowerCase().replace(/\s+/g, '-');
    const newId = `custom-${cleanName}`;

    // Ajouter le nouvel équipement à la catégorie actuelle
    const powerValue = parseInt(newEquipementPower, 10);

    // Ajouter directement aux équipements sélectionnés
    setSelectedEquipements(prev => [
      ...prev,
      {
        id: newId,
        categorySlug: selectedCategoryTab,
        quantity: 1,
        puissance: powerValue,
        label: newEquipementName // Stocker explicitement le nom saisi
      }
    ]);

    // Réinitialiser le formulaire
    setNewEquipementName("");
    setNewEquipementPower("");
    setShowAddEquipementForm(false);
  };

  const handleNext = () => {
    const currentIndex = CATEGORIES.findIndex(cat => cat.slug === selectedCategoryTab);

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
    return selectedEquipements.filter(eq => eq.categorySlug === categorySlug && eq.quantity > 0).length;
  };

  return (
    <>
      <div className="min-h-screen flex items-start justify-center pt-16 pb-28">
        <div className="w-[91%]">
          <div className="bg-gradient-to-br from-[#F5F5F5]  rounded-[40px] overflow-hidden relative ">
            {/* Titre & sous‑texte */}
            <header className="px-12 py-16 relative text-center">
              <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-noir relative inline-block">
                {title}
                <div className={`absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${highlightColor} to-transparent`}></div>
              </h1>
              <p className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto relative">
                {description}
              </p>
            </header>

            {/* Contenu principal */}
            <div className="max-w-7xl w-[91%] mx-auto px-4 py-12">
              <div className="flex flex-col lg:flex-row gap-10">
                {/* Colonne de gauche: information générale */}
                <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-800 mb-6">
                      Simulation de puissance électrique
                    </h2>

                    {/* Contenu général pour tous les appareils */}
                    <div className="space-y-8">
                      {/* Comment calculer ma puissance */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-orange font-medium">*</span>
                          <h4 className="font-medium">Comment calculer ma puissance ?</h4>
                        </div>

                        <div className="ml-6 bg-gray-50 p-4 rounded-md">
                          <ol className="list-decimal ml-4 space-y-2 text-gray-700">
                            <li>Parcourir la liste des équipements disponibles par catégorie</li>
                            <li>Sélectionner les équipements utilisés en cochant les cases correspondantes</li>
                            <li>La puissance totale sera calculée automatiquement en fonction des appareils sélectionnés</li>
                          </ol>
                        </div>
                      </div>

                      {/* Conseils d'économie */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-orange font-medium">*</span>
                          <h4 className="font-medium">Comment réduire ma consommation électrique ?</h4>
                        </div>

                        <div className="ml-6 bg-gray-50 p-4 rounded-md">
                          <ul className="space-y-2 text-gray-700">
                            <li className="flex items-start gap-2">
                              <span className="text-orange font-bold">•</span>
                              <p>Privilégiez les appareils de classe énergétique A+++ ou supérieure</p>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-orange font-bold">•</span>
                              <p>Éteignez complètement vos appareils plutôt que de les laisser en veille</p>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-orange font-bold">•</span>
                              <p>Réglez votre chauffage et climatisation à des températures raisonnables</p>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-orange font-bold">•</span>
                              <p>Utilisez des multiprises avec interrupteur pour couper l'alimentation</p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Colonne de droite: catégories d'appareils */}
                <div className="w-full lg:w-1/3">
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <p className="text-center mb-5 font-medium text-lg">Catégories d'appareils</p>

                    {/* Grille de catégories */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {CATEGORIES.map((category) => (
                        <div
                          key={category.slug}
                          className="relative flex flex-col items-center cursor-pointer p-2 rounded-lg transition hover:bg-gray-50"
                          onMouseEnter={() => setHoveredCategory(category.slug)}
                          onMouseLeave={() => setHoveredCategory(null)}
                        >
                          <div className="w-full aspect-square rounded-full overflow-hidden mb-2 flex items-center justify-center bg-gray-50">
                            <Image
                              src={category.illustration}
                              alt={category.label}
                              width={48}
                              height={48}
                              className="object-contain"
                            />
                          </div>

                          <span className="text-xs font-medium text-center">
                            {category.label.split(' ')[0]}
                          </span>

                        </div>
                      ))}
                    </div>

                    {/* Information générale modifiée pour des conseils d'économie */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-orange">Conseils :</span> Limitez l'utilisation des appareils à forte puissance. Privilégiez un usage raisonné et des appareils économes en énergie pour réduire votre facture d'électricité.
                      </p>
                    </div>
                  </div>

                  {/* Bouton de lancement */}
                  <button
                    className="w-full py-4 bg-orange hover:bg-orange/90 text-white font-bold rounded-lg shadow-md transition-all duration-300 group relative overflow-hidden"
                    onClick={() => setShowModal(true)}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full animate-shimmer group-hover:animate-shimmer"></span>
                    <div className="flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      <span>Lancer la simulation</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

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
                        const isPast = CATEGORIES.findIndex(c => c.slug === selectedCategoryTab) > index;
                        const categoryCount = getCategoryEquipementCount(category.slug);

                        return (
                          <div
                            key={category.slug}
                            className={`flex flex-col items-center relative cursor-pointer w-full mx-1 ${isActive ? 'z-10' : ''}`}
                            onClick={() => setSelectedCategoryTab(category.slug)}
                          >
                            <div className="text-center mb-1 relative">
                              <p className={`text-xs md:text-sm font-medium transition-colors duration-300 ${isActive
                                ? 'text-orange'
                                : isPast
                                  ? 'text-orange/70'
                                  : 'text-gray-400'
                                }`}>
                                {category.label.split(' ')[0]}
                              </p>

                              {isActive && categoryCount > 0 && (
                                <div className="absolute -right-4 -top-2 w-5 h-5 bg-orange rounded-full flex items-center justify-center text-xs text-white font-medium">
                                  {categoryCount}
                                </div>
                              )}

                              {isPast && (
                                <div className="absolute -right-4 -top-2 w-5 h-5 bg-orange/80 rounded-full flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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
                          width: `${(CATEGORIES.findIndex(c => c.slug === selectedCategoryTab) + 1) * (100 / CATEGORIES.length)}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Grille d'équipements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 px-4">
                    {selectedCategory?.equipements.map(equipement => {
                      const quantity = getEquipementQuantity(equipement.id, selectedCategoryTab);
                      const isSelected = quantity > 0;

                      return (
                        <div
                          key={equipement.id}
                          className={`
                            flex items-center justify-between rounded-xl p-5 transition-all duration-200
                            ${isSelected
                              ? 'border-2 border-orange/30 bg-orange/5 shadow-sm'
                              : 'border border-gray-200 hover:border-orange/20 hover:bg-orange/5'}
                          `}
                        >
                          <div className="font-medium text-gray-800">{equipement.label}</div>
                          <div className="flex items-center">
                            <button
                              className={`
                                w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange/50
                                ${quantity > 0
                                  ? 'bg-orange text-white shadow-md hover:shadow-lg'
                                  : 'bg-gray-200 text-gray-600 hover:bg-orange/80 hover:text-white'}
                              `}
                              onClick={() => handleQuantityChange(equipement.id, selectedCategoryTab, equipement.puissance, -1)}
                              aria-label="Réduire la quantité"
                            >
                              <span className="text-lg font-medium">-</span>
                            </button>
                            <span className="mx-4 min-w-10 text-center font-medium text-lg">
                              {quantity || 0}
                            </span>
                            <button
                              className="w-9 h-9 flex items-center justify-center rounded-full bg-orange text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange/50"
                              onClick={() => handleQuantityChange(equipement.id, selectedCategoryTab, equipement.puissance, 1)}
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
                      .filter(eq => eq.categorySlug === selectedCategoryTab && !selectedCategory?.equipements.some(e => e.id === eq.id))
                      .map(customEq => (
                        <div
                          key={customEq.id}
                          className="flex items-center justify-between rounded-xl p-5 border-2 border-orange/30 bg-orange/5 shadow-sm"
                        >
                          <div className="font-medium text-gray-800 flex items-center">
                            <span className="text-gray-800">{customEq.label || "Équipement personnalisé"}</span>
                            <span className="ml-2 text-xs text-orange">(Personnalisé)</span>
                          </div>
                          <div className="flex items-center">
                            <button
                              className="w-9 h-9 flex items-center justify-center rounded-full bg-orange text-white transition-colors"
                              onClick={() => handleQuantityChange(customEq.id, selectedCategoryTab, customEq.puissance, -1)}
                            >
                              <span className="text-lg font-medium">-</span>
                            </button>
                            <span className="mx-4 min-w-10 text-center font-medium text-lg">
                              {customEq.quantity}
                            </span>
                            <button
                              className="w-9 h-9 flex items-center justify-center rounded-full bg-orange text-white transition-opacity hover:opacity-90"
                              onClick={() => handleQuantityChange(customEq.id, selectedCategoryTab, customEq.puissance, 1)}
                            >
                              <span className="text-lg font-medium">+</span>
                            </button>
                          </div>
                        </div>
                      ))
                    }

                    {/* Formulaire pour ajouter un équipement */}
                    {showAddEquipementForm && (
                      <div className="md:col-span-2 p-5 border-2 border-orange/30 bg-orange/5 rounded-xl">
                        <h3 className="text-lg font-medium mb-4 text-gray-800">Ajouter un équipement personnalisé</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'équipement</label>
                            <input
                              type="text"
                              value={newEquipementName}
                              onChange={(e) => setNewEquipementName(e.target.value)}
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange/50"
                              placeholder="Ex: Machine à café"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Puissance (Watts)</label>
                            <input
                              type="number"
                              value={newEquipementPower}
                              onChange={(e) => setNewEquipementPower(e.target.value)}
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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="font-medium">Ajouter un équipement</span>
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>Annuler</span>
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Simuler</span>
                      </button>
                      <button
                        className="py-3 px-4 bg-orange text-white rounded-full font-medium hover:bg-orange/90 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-1 transform hover:translate-y-[-1px] focus:outline-none focus:ring-2 focus:ring-orange/50"
                        onClick={handleNext}
                      >
                        {CATEGORIES.findIndex(cat => cat.slug === selectedCategoryTab) < CATEGORIES.length - 1
                          ? (
                            <>
                              <span>Suivant</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </>
                          )
                          : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>Terminer</span>
                            </>
                          )
                        }
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
              <p className="text-gray-600">Nous calculons l'ampérage nécessaire pour vos équipements.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal pour afficher les résultats */}
      <AnimatePresence>
        {showResultModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-3xl w-full max-w-2xl shadow-xl mb-20"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-8">
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Résultats de la simulation</h2>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setShowResultModal(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="bg-gradient-to-br from-orange/10 to-orange/5 rounded-2xl p-6 mb-8">
                  <div className="grid grid-cols-2 gap-8 mb-6">
                    <div className="flex flex-col justify-center items-center">
                      <div className="text-5xl font-bold text-orange mb-1">{getTotalPuissance()}</div>
                      <div className="text-lg text-gray-600">Watts</div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                      <div className="text-5xl font-bold text-orange mb-1">
                        {calculateAmperage(getTotalPuissance()).toFixed(1)}
                      </div>
                      <div className="text-lg text-gray-600">Ampères</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4">
                    <h3 className="font-medium text-gray-800 mb-2">Recommandation:</h3>
                    <p className="text-gray-700">
                      {calculateAmperage(getTotalPuissance()) <= 16
                        ? "Votre installation est compatible avec un abonnement standard de 16A."
                        : calculateAmperage(getTotalPuissance()) <= 32
                          ? "Nous vous recommandons un abonnement renforcé de 32A pour votre installation."
                          : "Votre installation nécessite un contrat professionnel ou triphasé. Contactez un électricien."
                      }
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-800">Équipements sélectionnés:</h3>
                  <div className="max-h-60 overflow-y-auto pr-2">
                    <table className="w-full">
                      <thead className="text-left bg-gray-50">
                        <tr>
                          <th className="py-2 px-4 text-sm font-medium text-gray-600">Équipement</th>
                          <th className="py-2 px-4 text-sm font-medium text-gray-600">Quantité</th>
                          <th className="py-2 px-4 text-sm font-medium text-gray-600">Puissance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedEquipements.map(eq => {
                          const category = CATEGORIES.find(cat => cat.slug === eq.categorySlug);
                          const equipement = category?.equipements.find(e => e.id === eq.id);

                          return (
                            <tr key={eq.id} className="hover:bg-gray-50">
                              <td className="py-2 px-4 text-sm font-medium">
                                {equipement ? equipement.label : eq.label || "Équipement personnalisé"}
                              </td>
                              <td className="py-2 px-4 text-sm">{eq.quantity}</td>
                              <td className="py-2 px-4 text-sm">{eq.puissance * eq.quantity} W</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    className="py-3 px-8 bg-orange text-white rounded-full font-medium hover:bg-orange/90 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform hover:translate-y-[-1px] focus:outline-none focus:ring-2 focus:ring-orange/50"
                    onClick={() => setShowResultModal(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Fermer</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ajouter une classe keyframe pour l'animation shimmer */}
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </>
  );
}
