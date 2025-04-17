"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon, HomeIcon } from "../components/icons/BreadcrumbIcons";

interface BreadcrumbProps {
    customLabels?: Record<string, string>;
    showHome?: boolean;
    mainSection?: "particulier" | "business" | "institution";
    maxItems?: number;
}

const Breadcrumb = ({
    customLabels = {},
    showHome = true,
    mainSection,
    maxItems = 3
}: BreadcrumbProps) => {
    const pathname = usePathname();
    if (!pathname) return null;

    // Déterminer la section principale
    const getMainSection = () => {
        if (mainSection) return mainSection;

        if (pathname.includes('/simulateur') || pathname.includes('/mes-demandes'))
            return "particulier";
        if (pathname.includes('/business'))
            return "business";
        if (pathname.includes('/institution'))
            return "institution";

        return "particulier"; // Par défaut
    };

    // Obtenir le libellé de la section principale
    const mainSectionLabel = {
        "particulier": "Particulier",
        "business": "Business",
        "institution": "Institution"
    }[getMainSection()];

    // Si on est sur la page d'accueil, ne pas afficher le fil d'Ariane
    if (pathname === '/') return null;

    // Traitement du chemin
    const path = pathname.replace(/^\/app/, "");
    const segments = path.split("/").filter(segment => segment !== "");

    // Mapper les segments en miettes de pain
    const crumbs = segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const label = customLabels[segment] ||
            segment.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());
        return { href, label, segment };
    });

    // Limiter le nombre d'éléments affichés
    const displayedCrumbs = [
        { href: "/", label: "Accueil", segment: "" },
        ...(crumbs.length > 0 ? [crumbs[crumbs.length - 1]] : [])
    ].slice(0, 4); // Limiter à 4 éléments max

    return (
        <div className="w-full max-w-3xl mx-auto">
            <nav
                aria-label="Fil d'Ariane"
                className="flex rounded-full bg-gradient-to-r from-[#fff] to-[#fff] p-2 overflow-hidden border border-[#000] transition-all duration-300"
            >
                {displayedCrumbs.map((crumb, index) => {
                    const isLast = index === displayedCrumbs.length - 1;
                    const isFirst = index === 0;

                    return (
                        <div key={index} className="flex items-center flex-1">
                            <Link
                                href={crumb.href}
                                className={`
                                    flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex-1
                                    ${isLast
                                        ? 'bg-[#000] text-white'
                                        : 'text-gray-600 hover:text-[#F7942E] hover:bg-white/50'
                                    }
                                `}
                            >
                                {isFirst && <HomeIcon className="w-4 h-4 mr-2" />}
                                <span>{crumb.label}</span>
                            </Link>
                            {!isLast && (
                                <div className="flex items-center justify-center">
                                    <ChevronRightIcon className="w-4 h-4 text-[#F7942E]/70" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </div>
    );
};

export default Breadcrumb; 