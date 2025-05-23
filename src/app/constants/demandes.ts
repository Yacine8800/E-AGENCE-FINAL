// Types pour les demandes
export type DemandeType =
  | "branchement"
  | "abonnement"
  | "reabonnement"
  | "mutation"
  | "resiliation"
  | "achat-disjoncteur"
  | "modification-branchement"
  | "maintenance-ouvrage"
  | "modification-commerciale"
  | "construction-ouvrage";
// Types à implémenter plus tard
// | "installation"
// | "puissance"
// | "raccordement"
// | "extension"
// | "tarif"
// | "connexion"

export type DemandeCategory =
  | "particulier-domicile"
  | "particulier-professionnel"
  | "entreprise";

export interface DemandeItem {
  id: DemandeType;
  src: string;
  label: string;
  width: number;
  height: number;
  category: DemandeCategory[];
  disabled: boolean;
  priority: number;
}

// Structure centralisée pour toutes les demandes
export const DEMANDES: Record<string, DemandeItem> = {
  BRANCHEMENT: {
    id: "branchement",
    src: "/demandeClient/Branchement abonnement (2)-1.png",
    label: "Branchement abonnement",
    width: 60,
    height: 60,
    category: ["particulier-domicile"],
    disabled: false,
    priority: 1,
  },
  ABONNEMENT: {
    id: "abonnement",
    src: "/demandeClient/Branchement abonnement.png",
    label: "Abonnement",
    width: 60,
    height: 60,
    category: ["particulier-domicile"],
    disabled: false,
    priority: 2,
  },
  REABONNEMENT: {
    id: "reabonnement",
    src: "/demandeClient/Reabonnement.png",
    label: "Réabonnement",
    width: 60,
    height: 60,
    category: ["particulier-domicile", "particulier-professionnel"],
    disabled: false,
    priority: 3,
  },
  MUTATION: {
    id: "mutation",
    src: "/demandeClient/Mutation.png",
    label: "Mutation",
    width: 60,
    height: 60,
    category: ["particulier-domicile", "particulier-professionnel"],
    disabled: false,
    priority: 4,
  },
  RESILIATION: {
    id: "resiliation",
    src: "/demandeClient/Résiliation.png",
    label: "Résiliation",
    width: 60,
    height: 60,
    category: ["particulier-domicile"],
    disabled: false,
    priority: 5,
  },
  ACHAT_DISJONCTEUR: {
    id: "achat-disjoncteur",
    src: "/demandeClient/Achat disjoncteur.png",
    label: "Achat disjoncteur",
    width: 50,
    height: 50,
    category: ["particulier-domicile"],
    disabled: false,
    priority: 6,
  },
  MODIFICATION_BRANCHEMENT: {
    id: "modification-branchement",
    src: "/demandeClient/Modification commercial.png",
    label: "Modification branchement",
    width: 50,
    height: 50,
    category: ["particulier-domicile"],
    disabled: true,
    priority: 7,
  },
  MAINTENANCE_OUVRAGE: {
    id: "maintenance-ouvrage",
    src: "/demandeClient/construction d'ouvrage-1.png",
    label: "Maintenance d'ouvrage",
    width: 50,
    height: 50,
    category: ["particulier-domicile"],
    disabled: true,
    priority: 8,
  },
  MODIFICATION_COMMERCIALE: {
    id: "modification-commerciale",
    src: "/demandeClient/Modification commercial.png",
    label: "Modification commerciale",
    width: 50,
    height: 50,
    category: ["particulier-domicile"],
    disabled: true,
    priority: 9,
  },
  CONSTRUCTION_OUVRAGE: {
    id: "construction-ouvrage",
    src: "/demandeClient/construction d'ouvrage-1.png",
    label: "Construction d'ouvrage",
    width: 50,
    height: 50,
    category: ["particulier-domicile"],
    disabled: true,
    priority: 10,
  },
};

// Catégories d'utilisateurs disponibles
export const TYPE_CATEGORIES = [
  { id: "particulier-domicile", label: "Particulier" },
  { id: "particulier-professionnel", label: "Professionnel" },
  { id: "entreprise", label: "Entreprise" },
];

// Fonction helper pour grouper les demandes par catégorie
export const getDemandesByCategory = (
  category: DemandeCategory
): DemandeItem[] => {
  return Object.values(DEMANDES)
    .filter((demande) => demande.category.includes(category))
    .sort((a, b) => {
      // D'abord trier par disponibilité
      if (a.disabled && !b.disabled) return 1;
      if (!a.disabled && b.disabled) return -1;
      // Puis par priorité
      return a.priority - b.priority;
    });
};

// Fonction pour obtenir le libellé d'une demande par son ID
export const getDemandeLabel = (demandeId: DemandeType | null): string => {
  if (!demandeId) return "";

  const demande = Object.values(DEMANDES).find((d) => d.id === demandeId);
  return demande ? demande.label : "";
};
