import React from "react";
import DemandeCard from "./DemandeCard";
import { DemandeType } from "../../constants/demandes";

interface DemandeInfo {
    title: string;
    icon: string;
    disabled?: boolean;
    description?: string;
    count?: number;
}

const demandeTypeInfo: Record<string, DemandeInfo> = {
    "branchement": {
        title: "Branchement abonnement",
        icon: "/demandeClient/Branchement abonnement (2)-1.png",
        description: "Nouvelle connexion au réseau électrique avec abonnement"
    },
    "abonnement": {
        title: "Abonnement",
        icon: "/demandeClient/Branchement abonnement.png",
        description: "Souscription à un contrat de fourniture d'électricité"
    },
    "reabonnement": {
        title: "Réabonnement",
        icon: "/demandeClient/Reabonnement.png",
        description: "Reprise d'un abonnement après suspension ou résiliation"
    },
    "mutation": {
        title: "Mutation",
        icon: "/demandeClient/Mutation.png",
        description: "Changement de titulaire d'un contrat d'abonnement"
    },
    "resiliation": {
        title: "Résiliation",
        icon: "/demandeClient/Résiliation.png",
        description: "Fin de contrat d'abonnement à l'électricité"
    },
    "achat-disjoncteur": {
        title: "Achat disjoncteur",
        icon: "/demandeClient/Achat disjoncteur.png",
        description: "Achat d'un disjoncteur pour votre installation électrique"
    },
    "modification-branchement": {
        title: "Modification branchement",
        icon: "/demandeClient/Modification commercial.png",
        description: "Changement technique de votre connexion au réseau",
        disabled: true
    },
    "maintenance-ouvrage": {
        title: "Maintenance d'ouvrage",
        icon: "/demandeClient/construction d'ouvrage-1.png",
        description: "Entretien des infrastructures et équipements existants",
        disabled: true
    },
    "modification-commerciale": {
        title: "Modification commerciale",
        icon: "/demandeClient/Modification commercial.png",
        description: "Changement des conditions commerciales de votre contrat",
        disabled: true
    },
    "construction-ouvrage": {
        title: "Construction d'ouvrage",
        icon: "/demandeClient/construction d'ouvrage-1.png",
        description: "Réalisation de nouvelles infrastructures électriques",
        disabled: true
    }
};

interface DemandeGridProps {
    onSelect: (demandeType: DemandeType, cardRect: DOMRect, title: string, icon: string) => void;
    selectedDemande?: DemandeType | null;
    category?: string;
}

const DemandeGrid: React.FC<DemandeGridProps> = ({
    onSelect,
    selectedDemande,
    category
}) => {
    // Créez un tableau à partir de l'objet pour faciliter le mappage
    const demandes = Object.entries(demandeTypeInfo)
        .map(([id, info]) => ({
            id: id as DemandeType,
            ...info
        }))
        // Trier pour mettre les demandes activées en premier
        .sort((a, b) => {
            if (a.disabled === b.disabled) return 0;
            return a.disabled ? 1 : -1;
        });

    const handleCardClick = (demande: typeof demandes[0], event: React.MouseEvent<HTMLDivElement>) => {
        if (demande.disabled) return;

        // Récupérer la position du clic
        const cardElement = event.currentTarget;
        const rect = cardElement.getBoundingClientRect();
        onSelect(demande.id, rect, demande.title, demande.icon);
    };

    return (
        <div className="w-full px-1 py-2">
            {/* Titre optionnel pour la catégorie */}
            {category && (
                <h2 className="text-lg font-semibold text-gray-800 mb-4 px-3">{category}</h2>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 md:gap-5">
                {demandes.map((demande) => (
                    <div
                        key={demande.id}
                        onClick={(e) => handleCardClick(demande, e)}
                    >
                        <DemandeCard
                            title={demande.title}
                            icon={demande.icon}
                            onClick={() => { }} // Le click est géré sur le conteneur
                            isActive={selectedDemande === demande.id}
                            disabled={demande.disabled}
                            count={demande.count}
                            description={demande.description}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DemandeGrid; 