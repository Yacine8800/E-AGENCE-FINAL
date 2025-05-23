"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

import { Toastify } from "@/utils/toast";

const TARIFF_CODES: string[] = [
  "5A – Tarif social",
  "6A – Tarif résidentiel",
  "15A – Professionnel",
];

// Mapping des codes tarifs vers les usages prévus
const TARIFF_TO_EXPLOIT = {
  "5A – Tarif social": "Usage domestique",
  "6A – Tarif résidentiel": "Usage domestique",
  "15A – Professionnel": "Petite entreprise",
};

const BRANCH_TYPES: string[] = ["Monophasé", "Triphasé"];
const POWERS: string[] = ["3 kVA", "6 kVA", "9 kVA", "12 kVA"];
const EXPLOITS: string[] = ["Usage domestique", "Petite entreprise", "Autre"];
const EXPLOIT_CODES: string[] = ["021", "022", "023", "051", "052", "053", "071", "072", "073"];

interface StepOneState {
  code: string;
  branch: string;
  power: string;
  exploit: string;
  exploitCode: string;
}

interface StepTwoState {
  start: string;
  end: string;
  oldIndex: string;
  newIndex: string;
}

interface ValidationErrors {
  code?: string;
  branch?: string;
  power?: string;
  exploit?: string;
  exploitCode?: string;
  start?: string;
  end?: string;
  oldIndex?: string;
  newIndex?: string;
}

interface Duration {
  years: number;
  months: number;
  days: number;
}

/* ──────────────────────────
   Fonctions utilitaires
────────────────────────── */

function calculateDuration(startDate: string, endDate: string): Duration {
  const start = new Date(startDate);
  const end = new Date(endDate);

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  // Ajuster les mois et les années si les jours sont négatifs
  if (days < 0) {
    months -= 1;
    // Obtenir le dernier jour du mois précédent
    const lastDayOfMonth = new Date(
      end.getFullYear(),
      end.getMonth(),
      0
    ).getDate();
    days += lastDayOfMonth;
  }

  // Ajuster les années si les mois sont négatifs
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

function formatDuration(duration: Duration): string {
  const parts: string[] = [];

  if (duration.years > 0) {
    parts.push(`${duration.years} ${duration.years === 1 ? "an" : "ans"}`);
  }

  if (duration.months > 0) {
    parts.push(`${duration.months} ${duration.months === 1 ? "mois" : "mois"}`);
  }

  if (duration.days > 0) {
    parts.push(`${duration.days} ${duration.days === 1 ? "jour" : "jours"}`);
  }

  if (parts.length === 0) {
    return "0 jour";
  }

  return parts.join(", ");
}

// Données du graphique de consommation mensuelle
const MONTHLY_DATA = [
  { month: 'Jan', primary: 42000, secondary: 34000, tertiary: 28000 },
  { month: 'Fév', primary: 62000, secondary: 48000, tertiary: 36000 },
  { month: 'Mar', primary: 58000, secondary: 45000, tertiary: 32000 },
  { month: 'Avr', primary: 48000, secondary: 36000, tertiary: 28000 },
  { month: 'Mai', primary: 52000, secondary: 42000, tertiary: 30000 },
  { month: 'Juin', primary: 38000, secondary: 30000, tertiary: 22000 },
  { month: 'Juil', primary: 62185, secondary: 48000, tertiary: 34000 },
  { month: 'Août', primary: 44000, secondary: 36000, tertiary: 26000 },
  { month: 'Sep', primary: 48000, secondary: 38000, tertiary: 28000 },
];

/**
 * Composant de graphique de consommation
 */

/* ──────────────────────────
   Composant principal
────────────────────────── */

const simulateurLabels = {
  "simulateur-facture": "Simulateur de facture"
};

/* Styles globaux à ajouter pour améliorer l'apparence des inputs date */
const globalStyles = `
  input[type="date"]::-webkit-calendar-picker-indicator {
    background-color: transparent;
    padding-right: 4px;
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    cursor: pointer;
    opacity: 0.7;
  }
  
  input[type="date"] {
    position: relative;
  }
  
  input[type="date"]::-webkit-datetime-edit {
    padding-right: 24px;
  }
`;

export default function SimulateurFacturePage() {
  // Ajouter les styles globaux au composant
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = globalStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const [isSimulating, setIsSimulating] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  // État unifié du formulaire
  const [formData, setFormData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("simulatorData");
      return saved
        ? JSON.parse(saved)
        : {
          code: "",
          branch: "",
          power: "",
          exploit: "",
          exploitCode: "",
          start: "",
          end: "",
          oldIndex: "",
          newIndex: "",
        };
    }
    return {
      code: "",
      branch: "",
      power: "",
      exploit: "",
      exploitCode: "",
      start: "",
      end: "",
      oldIndex: "",
      newIndex: "",
    };
  });

  // Sauvegarder les données
  const saveToLocalStorage = useCallback((data: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("simulatorData", JSON.stringify(data));
    }
  }, []);

  // Validation des données
  const validateForm = useCallback(() => {
    const errors: ValidationErrors = {};
    if (!formData.code) errors.code = "Le code tarif est requis";
    if (!formData.branch) errors.branch = "Le type de branchement est requis";
    if (!formData.power) errors.power = "La puissance est requise";
    if (!formData.exploit) errors.exploit = "Le type d'exploitation est requis";
    if (!formData.exploitCode) errors.exploitCode = "Le code d'exploitation est requis";
    if (!formData.start) errors.start = "La date de début est requise";
    if (!formData.end) errors.end = "La date de fin est requise";
    if (!formData.oldIndex) errors.oldIndex = "L'ancien index est requis";
    if (!formData.newIndex) errors.newIndex = "Le nouvel index est requis";

    // Check if newIndex is greater than oldIndex
    if (formData.oldIndex && formData.newIndex && Number(formData.newIndex) <= Number(formData.oldIndex)) {
      errors.newIndex = "Le nouvel index doit être supérieur à l'ancien index";
    }

    if (formData.start && formData.end && formData.end < formData.start) {
      errors.end = "La date de fin doit être postérieure à la date de début";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleChange = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => {
        const updated = { ...prev, [field]: value };

        // Si le code tarif change, mettre à jour automatiquement l'exploitation
        if (field === "code") {
          updated.exploit = TARIFF_TO_EXPLOIT[value as keyof typeof TARIFF_TO_EXPLOIT] || "";
        }

        // Si la date de début change, calculer automatiquement la date de fin (+ 2 mois)
        if (field === "start" && value) {
          const startDate = new Date(value);
          const endDate = new Date(startDate);
          endDate.setMonth(startDate.getMonth() + 2);
          // Formater la date au format YYYY-MM-DD pour l'input date
          updated.end = endDate.toISOString().split('T')[0];
        }

        saveToLocalStorage(updated);
        return updated;
      });
    },
    [saveToLocalStorage]
  );

  const handleSimulate = useCallback(() => {
    if (!validateForm()) {
      Toastify("error", "Veuillez remplir tous les champs requis");
      return;
    }

    setIsSimulating(true);
    setLoadingStep(1);

    const steps = [700, 1400, 2000, 2600];
    steps.forEach((delay, index) => {
      setTimeout(() => setLoadingStep(index + 1), delay);
    });

    setTimeout(() => {
      setIsSimulating(false);
      setIsSimulated(true);
      setLoadingStep(0);
    }, 2600);
  }, [validateForm]);

  const resetForm = useCallback(() => {
    setFormData({
      code: "",
      branch: "",
      power: "",
      exploit: "",
      exploitCode: "",
      start: "",
      end: "",
      oldIndex: "",
      newIndex: "",
    });
    setIsSimulated(false);
    setValidationErrors({});
    localStorage.removeItem("simulatorData");
  }, []);

  return (
    <div className="min-h-screen flex items-start justify-center pt-10 pb-10 -mb-[200px]">
      <div className="w-[91%]">
        {/* Fil d'Ariane avec design segmenté */}

        <div className="bg-gradient-to-br from-[#F5F5F5] rounded-[40px] overflow-hidden relative">
          {/* Titre & sous‑texte */}
          <header className="px-8 py-8 relative text-center">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-noir relative inline-block">
              Simulateur de Facture
              <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange to-transparent"></div>
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto relative">
              Estimez avec précision votre prochaine facturation sur la base de
              votre consommation.
            </p>
          </header>

          {/* Contenu principal - Optimisé pour tenir sur une page */}
          <div className="px-6 py-6 sm:px-8 md:px-10">
            <div className="max-w-6xl mx-auto">


              {isSimulated ? (
                // Récapitulatif centré
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-semibold text-noir mb-6 text-center">
                    Récapitulatif de votre simulation
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-sm border border-gray-100 hover:border-orange/30 transition-all">
                      <h3 className="text-lg font-medium text-noir mb-4 flex items-center">
                        <span className="h-7 w-7 rounded-full bg-orange/10 flex items-center justify-center mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        </span>
                        Informations de facturation
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Code tarif :</span>
                          <span className="font-medium">{formData.code}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="text-gray-600">
                            Type de branchement :
                          </span>
                          <span className="font-medium">{formData.branch}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="text-gray-600">
                            Puissance souscrite :
                          </span>
                          <span className="font-medium">{formData.power}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Exploitation :</span>
                          <span className="font-medium">
                            {formData.exploit} ({formData.exploitCode})
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-sm border border-gray-100 hover:border-orange/30 transition-all">
                      <h3 className="text-lg font-medium text-noir mb-4 flex items-center">
                        <span className="h-7 w-7 rounded-full bg-orange/10 flex items-center justify-center mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </span>
                        Période de consommation
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Date de début :</span>
                          <span className="font-medium">
                            {new Date(formData.start).toLocaleDateString(
                              "fr-FR"
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Date de fin :</span>
                          <span className="font-medium">
                            {new Date(formData.end).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Durée :</span>
                          <span className="font-medium text-orange">
                            {formatDuration(
                              calculateDuration(formData.start, formData.end)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Aperçu de facture détaillé */}
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
                    <div className="bg-gradient-to-r from-orange/10 to-orange/5 px-6 py-4 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0v3H7V4h6zm-6 8v-2h8v2H7z" clipRule="evenodd" />
                          </svg>
                          Facture d'électricité
                        </h3>
                        <div className="text-sm text-gray-500 flex flex-col items-end">
                          <div>N° Facture: 04/2024</div>
                          <div>Période: 04/02/2024 - 04/04/2024</div>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-4">
                      {/* En-tête de facture */}
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <div className="text-gray-600 text-sm">Client:</div>
                          <div className="font-medium">{formData.code === "5A – Tarif social" ? "Client Tarif Social" : formData.code === "6A – Tarif résidentiel" ? "Client Résidentiel" : "Client Professionnel"}</div>
                          <div className="text-sm text-gray-500">N° Compteur: {Math.floor(10000000 + Math.random() * 90000000)}</div>
                          <div className="text-sm text-gray-500">Type: {formData.exploit}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-600 text-sm">Branchement:</div>
                          <div className="font-medium">{formData.branch} - {formData.power}</div>
                          <div className="text-sm text-gray-500">Tarif: {formData.code}</div>
                        </div>
                      </div>

                      {/* Tableau des consommations */}
                      <div className="border rounded-lg overflow-hidden mb-6">
                        <table className="w-full">
                          <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                            <tr>
                              <th className="px-4 py-2 border-b text-left"></th>
                              <th className="px-4 py-2 border-b text-right">Consommation (kWh)</th>
                              <th className="px-4 py-2 border-b text-right">Prix unitaire HT</th>
                              <th className="px-4 py-2 border-b text-right">Montant (FCFA)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            <tr>
                              <td className="px-4 py-3 text-sm">Tranche 1</td>
                              <td className="px-4 py-3 text-sm text-right">584</td>
                              <td className="px-4 py-3 text-sm text-right">81 FCFA</td>
                              <td className="px-4 py-3 text-sm text-right">47 320 FCFA</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm">Tranche 2</td>
                              <td className="px-4 py-3 text-sm text-right">144</td>
                              <td className="px-4 py-3 text-sm text-right">70 FCFA</td>
                              <td className="px-4 py-3 text-sm text-right">10 110 FCFA</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm">Prime Fixe</td>
                              <td className="px-4 py-3 text-sm text-right">-</td>
                              <td className="px-4 py-3 text-sm text-right">-</td>
                              <td className="px-4 py-3 text-sm text-right">4 895 FCFA</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm">TVA (18%)</td>
                              <td className="px-4 py-3 text-sm text-right">-</td>
                              <td className="px-4 py-3 text-sm text-right">-</td>
                              <td className="px-4 py-3 text-sm text-right">11 220 FCFA</td>
                            </tr>
                            <tr className="bg-orange/5 font-medium">
                              <td colSpan={3} className="px-4 py-3 text-sm text-right">Total Facture Energie de la période TTC</td>
                              <td className="px-4 py-3 text-sm text-right">73 545 FCFA</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Taxes et Redevances */}
                      <div className="border rounded-lg overflow-hidden mb-6">
                        <div className="bg-gray-50 px-4 py-2 border-b">
                          <h4 className="text-xs uppercase font-bold text-gray-600">Taxes et Redevances</h4>
                        </div>
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-2 text-xs text-left text-gray-600"></th>
                              <th className="px-4 py-2 border-b text-right">Montant (FCFA)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            <tr>
                              <td className="px-4 py-3 text-sm">Redevance Electrification Rurale</td>
                              <td className="px-4 py-3 text-sm text-right">955 FCFA</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm">Taxes rémunératoire pour l'Enlèvement des Ordures Ménagères</td>
                              <td className="px-4 py-3 text-sm text-right">2 020 FCFA</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm">Redevance RTI</td>
                              <td className="px-4 py-3 text-sm text-right">2 000 FCFA</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm">Frais de timbre (Si règlement en espèces)</td>
                              <td className="px-4 py-3 text-sm text-right">100 FCFA</td>
                            </tr>
                            <tr className="bg-gray-50 font-medium">
                              <td className="px-4 py-3 text-sm text-right">Total Taxes et Redevances</td>
                              <td className="px-4 py-3 text-sm text-right">5 075 FCFA</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Total Facture */}
                      <div className="bg-orange/10 p-4 rounded-lg mb-6 border border-orange/20">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-gray-800">Total Facture </h4>
                          <span className="font-bold text-xl text-orange">78 235 FCFA</span>
                        </div>
                        {/* <p className="text-sm text-gray-600 mt-2">
                          Passée la date limite de paiement, il sera perçu 10% du solde dû de cette facture
                        </p> */}
                      </div>

                      {/* Informations sur la consommation */}
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="flex flex-col items-center">
                            <div className="text-sm text-gray-600 mb-1">Période facturée</div>
                            <div className="text-md font-medium">
                              {new Date(formData.start).toLocaleDateString("fr-FR")} - {new Date(formData.end).toLocaleDateString("fr-FR")}
                            </div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="text-sm text-gray-600 mb-1">Index ancien</div>
                            <div className="text-xl font-bold text-gray-800">{formData.oldIndex || "-"}</div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="text-sm text-gray-600 mb-1">Index nouveau</div>
                            <div className="text-xl font-bold text-gray-800">{formData.newIndex || "-"}</div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="text-sm text-gray-600 mb-1">Consommation totale</div>
                            <div className="text-xl font-bold text-orange">
                              {formData.oldIndex && formData.newIndex ?
                                `${Number(formData.newIndex) - Number(formData.oldIndex)} kWh` :
                                "-"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Informations de paiement */}
                      {/* <div className="bg-white border border-gray-100 rounded-lg p-4 mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Information importante</h4>
                         <div className="text-sm text-red-600 font-medium mb-2">
                          Passée la date limite de paiement, il sera perçu 10% du solde dû de cette facture
                        </div> 
                        <div className="flex items-center mt-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-600">Pour toute réclamation, veuillez contacter notre service client au 179</span>
                        </div>
                      </div> */}

                      {/* Note de bas de facture */}
                      <div className="text-xs text-gray-500 border-t border-gray-100 pt-4">
                        <p className="mb-1">* Cette simulation est basée sur les données de consommation réelles et les tarifs en vigueur.</p>
                        <p className="mb-1">Tarif appliqué: Domestique (DOM) - {formData.code} - {formData.power}</p>
                        <p className="mb-1">Pour signaler une coupure ou une urgence: 179 (appel gratuit)</p>
                        <p>Pour toute information supplémentaire: Centre de relation client au 179 de 7h30 à 16h30</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-center">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setIsSimulated(false)}
                        className="bg-white text-orange hover:text-noir border border-orange hover:border-noir transition-all duration-300 font-semibold text-lg rounded-full px-8 py-3 shadow-sm hover:shadow-md flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Retour
                      </button>
                      <button
                        onClick={resetForm}
                        className="bg-white text-orange hover:text-noir border border-orange hover:border-noir transition-all duration-300 font-semibold text-lg rounded-full px-8 py-3 shadow-sm hover:shadow-md flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Nouvelle simulation
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // Formulaire et illustration dans une seule carte
                <div className="bg-gradient-to-br from-white to-gray-50/90 backdrop-blur-sm p-10 rounded-[24px] shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-14">
                    {/* Sections de formulaire sur 2 colonnes */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12">
                      {/* Informations techniques */}
                      <div className="space-y-7">
                        <h3 className="text-xl font-semibold text-noir mb-7 pb-2 border-b border-gray-200 flex items-center">
                          <span className="h-7 w-7 rounded-full bg-orange/10 flex items-center justify-center mr-2 text-orange text-xs font-bold">1</span>
                          Informations techniques
                        </h3>
                        <div className="space-y-6">
                          <SelectField
                            label="Code tarif"
                            value={formData.code}
                            onChange={(e) => handleChange("code", e.target.value)}
                            options={TARIFF_CODES}
                            error={validationErrors.code}
                          />
                          <SelectField
                            label="Type de branchement"
                            value={formData.branch}
                            onChange={(e) =>
                              handleChange("branch", e.target.value)
                            }
                            options={BRANCH_TYPES}
                            error={validationErrors.branch}
                          />
                          <SelectField
                            label="Puissance souscrite"
                            value={formData.power}
                            onChange={(e) =>
                              handleChange("power", e.target.value)
                            }
                            options={POWERS}
                            error={validationErrors.power}
                          />

                          <InputField
                            label="Ancien Index (kWh)"
                            value={formData.oldIndex}
                            onChange={(e) => handleChange("oldIndex", e.target.value)}
                            type="number"
                            placeholder="Ancien Index (kWh)"
                            error={validationErrors.oldIndex}
                          />
                          <InputField
                            label="Nouvel Index (kWh)"
                            value={formData.newIndex}
                            onChange={(e) => handleChange("newIndex", e.target.value)}
                            type="number"
                            placeholder="Nouvel Index (kWh)"
                            error={validationErrors.newIndex}
                          />
                        </div>
                      </div>

                      {/* Combinaison de Type d'exploitation et Période */}
                      <div className="space-y-7">
                        {/* Type d'exploitation */}
                        <div>
                          <h3 className="text-xl font-semibold text-noir mb-7 pb-2 border-b border-gray-200 flex items-center">
                            <span className="h-7 w-7 rounded-full bg-orange/10 flex items-center justify-center mr-2 text-orange text-xs font-bold">2</span>
                            Usage
                          </h3>
                          <div className="space-y-6">
                            <div className="relative group">
                              <label className="block mb-2 text-sm font-medium text-gray-700 group-hover:text-orange transition-colors duration-200">
                                Usage prévu (déterminé par le code tarif)
                              </label>
                              <div className="w-full px-4 py-3 text-sm text-gray-700 bg-gray-100/80 border rounded-xl border-gray-200 shadow-inner">
                                {formData.exploit || "Sélectionnez d'abord un code tarif"}
                              </div>
                            </div>
                            <SelectField
                              label="Code d'exploitation"
                              value={formData.exploitCode}
                              onChange={(e) => handleChange("exploitCode", e.target.value)}
                              options={EXPLOIT_CODES}
                              error={validationErrors.exploitCode}
                            />
                          </div>
                        </div>

                        {/* Période de consommation */}
                        <div className="mt-9">
                          <h3 className="text-xl font-semibold text-noir mb-7 pb-2 border-b border-gray-200 flex items-center">
                            <span className="h-7 w-7 rounded-full bg-orange/10 flex items-center justify-center mr-2 text-orange text-xs font-bold">3</span>
                            Période de consommation
                          </h3>
                          <div className="space-y-6">
                            <DateField
                              label="Date de début"
                              value={formData.start}
                              onChange={(e) =>
                                handleChange("start", e.target.value)
                              }
                              error={validationErrors.start}
                            />
                            <div className="relative group">
                              <label className="block mb-2 text-sm font-medium text-gray-700 group-hover:text-orange transition-colors duration-200">
                                Date de fin
                              </label>
                              <div className="w-full px-4 py-3 text-sm text-gray-700 bg-gray-100/80 border rounded-xl border-gray-200 shadow-inner">
                                {formData.end ? new Date(formData.end).toLocaleDateString("fr-FR") : "Sélectionnez d'abord une date de début"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bouton de simulation - Placement amélioré */}
                      <div className="md:col-span-2 pt-8">
                        <button
                          disabled={isSimulating}
                          onClick={handleSimulate}
                          className="w-full bg-gradient-to-r from-orange to-orange/90 disabled:opacity-50 hover:from-noir hover:to-noir/90 transition-all duration-300 text-white font-semibold text-lg rounded-full px-10 py-5 shadow-lg hover:shadow-xl disabled:shadow-none relative overflow-hidden group"
                        >
                          <span className="relative z-10 flex items-center justify-center">
                            {isSimulating ? (
                              <>
                                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Traitement...
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Simuler
                              </>
                            )}
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-orange/20 to-orange/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                      </div>
                    </div>

                    {/* Illustration - Une colonne verticale */}
                    <div className="lg:col-span-1 flex items-center justify-center relative">
                      <div className="relative z-10 drop-shadow-xl transform transition-all duration-300 hover:scale-105">
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange/20 to-orange/5 rounded-3xl blur-lg opacity-70"></div>
                        <Image
                          src="/facture/simul.png"
                          alt="Illustration du simulateur de facture"
                          width={400}
                          height={400}
                          className="max-w-full h-auto relative z-20"
                        />
                      </div>
                      <div className="absolute top-0 right-0 w-40 h-40 bg-orange/5 rounded-full filter blur-3xl opacity-60"></div>
                      <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange/5 rounded-full filter blur-3xl opacity-60"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Sous‑composants
--------------------------------------------------------------------------- */

function StepperItem({
  number,
  title,
  description,
  active,
  completed,
  onClick,
}: {
  number: number;
  title: string;
  description: string;
  active: boolean;
  completed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-start gap-4 text-left group transition-all duration-300 ${active ? "scale-105" : "hover:scale-102"
        }`}
    >
      {/* Pastille */}
      <span
        className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center font-bold text-white text-lg transition-all duration-300 ${completed
          ? "bg-orange shadow-lg shadow-orange/30"
          : active
            ? "bg-orange shadow-lg shadow-orange/30"
            : "bg-gray-300 group-hover:bg-orange/70"
          }`}
      >
        {completed ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          number
        )}
      </span>

      {/* Libellé */}
      <span className="flex flex-col gap-1">
        <h3
          className={`text-lg md:text-xl font-semibold transition-colors duration-300 ${completed
            ? "text-orange"
            : active
              ? "text-orange"
              : "text-gray-800 group-hover:text-orange/80"
            }`}
        >
          {title}
        </h3>
        <p className="text-gray-600 text-sm max-w-[200px]">{description}</p>
      </span>
    </button>
  );
}

/* ───────── Étape 1 ───────── */

function StepOneForm({
  state,
  onChange,
  errors,
}: {
  state: StepOneState;
  onChange: (
    field: keyof StepOneState
  ) => (e: React.ChangeEvent<HTMLSelectElement>) => void;
  errors: ValidationErrors;
}) {
  return (
    <form className="space-y-8">
      <SelectField
        label="Code tarif"
        value={state.code}
        onChange={onChange("code")}
        options={TARIFF_CODES}
        error={errors.code}
      />
      <SelectField
        label="Type de branchement"
        value={state.branch}
        onChange={onChange("branch")}
        options={BRANCH_TYPES}
        error={errors.branch}
      />
      <SelectField
        label="Puissance souscrite"
        value={state.power}
        onChange={onChange("power")}
        options={POWERS}
        error={errors.power}
      />
      <div className="relative group">
        <label className="block mb-1 text-sm font-medium text-gray-700 group-hover:text-orange transition-colors duration-200">
          Usage prévu (déterminé par le code tarif)
        </label>
        <div className="w-full px-4 py-3 text-sm text-gray-700 bg-gray-100/80 border rounded-xl border-gray-200 shadow-inner">
          {state.exploit || "Sélectionnez d'abord un code tarif"}
        </div>
      </div>
      <SelectField
        label="Code d'exploitation"
        value={state.exploitCode}
        onChange={onChange("exploitCode")}
        options={EXPLOIT_CODES}
        error={errors.exploitCode}
      />
    </form>
  );
}

/* ───────── Étape 2 ───────── */

function StepTwoForm({
  state,
  onChange,
  errors,
}: {
  state: StepTwoState;
  onChange: (
    field: keyof StepTwoState
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: ValidationErrors;
}) {
  return (
    <form className="space-y-8">
      <DateField
        label="Date de début"
        value={state.start}
        onChange={onChange("start")}
        error={errors.start}
      />
      <div className="relative group">
        <label className="block mb-1 text-sm font-medium text-gray-700 group-hover:text-orange transition-colors duration-200">
          Date de fin (calculée automatiquement, +2 mois)
        </label>
        <div className="w-full px-4 py-2.5 text-sm text-gray-700 bg-gray-100 border rounded-xl border-gray-200">
          {state.end ? new Date(state.end).toLocaleDateString("fr-FR") : "Sélectionnez d'abord une date de début"}
        </div>
      </div>
      <InputField
        label="Ancien Index (kWh)"
        value={state.oldIndex}
        onChange={onChange("oldIndex")}
        type="number"
        placeholder="Ancien Index (kWh)"
        error={errors.oldIndex}
      />
      <InputField
        label="Nouvel Index (kWh)"
        value={state.newIndex}
        onChange={onChange("newIndex")}
        type="number"
        placeholder="Nouvel Index (kWh)"
        error={errors.newIndex}
      />
    </form>
  );
}

/* ───────── Champs génériques ───────── */

function SelectField({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  error?: string;
}) {
  return (
    <div className="relative group">
      <label className="block mb-2 text-sm font-medium text-gray-700 group-hover:text-orange transition-colors duration-200">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={`w-full px-5 py-3.5 text-sm text-gray-700 bg-white border rounded-xl focus:outline-none focus:ring-1 appearance-none pr-9 cursor-pointer transition-all duration-200 ${error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-gray-200 hover:border-orange/30 focus:border-orange focus:ring-orange/20"
            }`}
        >
          <option value="" className="text-gray-400 py-2 text-sm">
            Sélectionnez une option
          </option>
          {options.map((opt) => (
            <option
              key={opt}
              value={opt}
              className="py-2 px-3 hover:bg-orange/10 cursor-pointer text-sm"
            >
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400 group-hover:text-orange transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && (
        <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
  min,
  error,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: string;
  error?: string;
}) {
  return (
    <div className="relative group">
      <label className="block mb-2 text-sm font-medium text-gray-700 group-hover:text-orange transition-colors duration-200">
        {label}
      </label>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={onChange}
          min={min || ''}
          className={`w-full border rounded-xl px-5 py-3.5 text-sm text-gray-700 focus:outline-none focus:ring-1 appearance-none transition-all ${error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-gray-200 hover:border-orange/30 focus:border-orange focus:ring-orange/20"
            }`}
          style={{ colorScheme: 'light' }}
        />
      </div>
      {error && (
        <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div className="relative group">
      <label className="block mb-2 text-sm font-medium text-gray-700 group-hover:text-orange transition-colors duration-200">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder || ""}
          className={`w-full border rounded-xl px-5 py-3.5 text-sm text-gray-700 focus:outline-none focus:ring-1 appearance-none transition-all ${error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-gray-200 hover:border-orange/30 focus:border-orange focus:ring-orange/20"
            }`}
        />
      </div>
      {error && (
        <div className="mt-1 flex items-center gap-1 text-xs text-red-500">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}

/* ───────── Aperçu facture ───────── */

function InvoicePreview({
  formData,
  isSimulating,
  isSimulated,
  loadingStep,
  onReset,
}: {
  formData: StepOneState & StepTwoState;
  isSimulating: boolean;
  isSimulated: boolean;
  loadingStep: number;
  onReset: () => void;
}) {
  const loadingMessages = [
    "Récupération des données...",
    "Calcul de consommation...",
    "Application des tarifs...",
    "Génération de la facture...",
  ];

  return (
    <div className="relative bg-gray-50 rounded-2xl p-4 w-full max-w-md shadow-md">
      <div className="flex items-start gap-4">
        <button
          onClick={onReset}
          className="h-10 w-10 bg-white rounded-full shadow flex items-center justify-center text-gray-500 hover:bg-orange hover:text-white transition-all duration-200"
          aria-label="Réinitialiser le formulaire"
          title="Réinitialiser le formulaire"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>

        <div className="flex-1 flex items-center justify-center">
          {isSimulating ? (
            <div className="flex flex-col items-center justify-center py-10 w-full">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-20 h-20 border-4 border-gray-200 rounded-full"></div>
                <div
                  className="w-20 h-20 border-4 border-t-transparent border-orange rounded-full animate-spin"
                  style={{
                    boxShadow: "0 0 15px rgba(255, 125, 0, 0.3)",
                  }}
                ></div>
                <div className="absolute flex items-center justify-center w-full h-full text-orange font-bold">
                  {Math.round((loadingStep / 4) * 100)}%
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-800 font-medium">
                  {loadingMessages[loadingStep - 1] || "Initialisation..."}
                </p>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-orange h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(loadingStep / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <Image
              src="/facture/facture.jpeg"
              alt="Aperçu facture"
              width={500}
              height={700}
              className={`w-full h-auto rounded-lg my-auto mx-auto block transition-all duration-500 ease-in-out ${isSimulated
                ? ""
                : !formData.code ||
                  !formData.branch ||
                  !formData.power ||
                  !formData.exploit
                  ? "blur-sm"
                  : "blur-[2px]"
                }`}
              style={{
                opacity: typeof window !== 'undefined' ? (isSimulated
                  ? 1
                  : formData.code &&
                    formData.branch &&
                    formData.power &&
                    formData.exploit
                    ? 0.8
                    : 0.5) : 0.5,
                boxShadow: typeof window !== 'undefined' ? (isSimulated
                  ? "0 10px 25px rgba(0, 0, 0, 0.1)"
                  : "none") : "none",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────── Icônes ───────── */

function RotateIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M12 2v2a8 8 0 018 8h2c0-5.523-4.477-10-10-10zm-1 0C5.477 2 1 6.477 1 12h2a8 8 0 018-8V2zm9 10a8 8 0 01-8 8v2c5.523 0 10-4.477 10-10h-2zm-9 8a8 8 0 01-8-8H1c0 5.523 4.477 10 10 10v-2z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path
        d="M12 3v12m0 0l-4-4m4 4l4-4m-9 9h10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}