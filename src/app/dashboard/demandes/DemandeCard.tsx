import React, { useState } from "react";
import Image from "next/image";

interface DemandeCardProps {
    title: string;
    icon: string;
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    count?: number;
    description?: string;
}

const DemandeCard: React.FC<DemandeCardProps> = ({
    title,
    icon,
    onClick,
    isActive = false,
    disabled = false,
    count,
    description
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`
                relative bg-white rounded-lg transition-all duration-300 border overflow-hidden h-[160px]
                ${disabled
                    ? "opacity-60 cursor-not-allowed border-gray-100"
                    : isActive
                        ? "cursor-pointer border-red-200 shadow-md"
                        : isHovered
                            ? "cursor-pointer border-red-100 shadow-md transform -translate-y-1"
                            : "cursor-pointer border-gray-100 hover:border-red-50 shadow-sm"
                }
            `}
            onClick={disabled ? undefined : onClick}
            onMouseEnter={() => !disabled && setIsHovered(true)}
            onMouseLeave={() => !disabled && setIsHovered(false)}
            aria-disabled={disabled}
        >
            {/* Background shape decoration */}
            <div className={`
                absolute -right-8 -top-8 w-24 h-24 rounded-full 
                transition-all duration-300 ease-in-out
                ${isActive ? 'bg-red-500/10' : isHovered ? 'bg-red-400/10' : 'bg-gray-100'}
            `} />

            <div className={`
                absolute -left-8 -bottom-8 w-24 h-24 rounded-full 
                transition-all duration-300 ease-in-out
                ${isActive ? 'bg-red-500/5' : isHovered ? 'bg-red-400/5' : 'bg-gray-50'}
            `} />

            {/* Image, centréee en haut avec un léger padding */}
            <div className="flex justify-center pt-4 mb-1 relative z-10">
                <div className={`
                    w-16 h-16 relative flex items-center justify-center 
                    p-3 rounded-full transition-all duration-300
                    ${isActive
                        ? "bg-red-100"
                        : isHovered
                            ? "bg-red-50 transform scale-110"
                            : "bg-gray-50"
                    }
                `}>
                    <Image
                        src={icon}
                        alt={title}
                        width={40}
                        height={40}
                        className={`
                            transition-all duration-300 
                            ${isHovered && !disabled ? "scale-110" : ""}
                            ${isActive ? "scale-105" : ""}
                        `}
                    />
                </div>
            </div>

            {/* Contenu texte */}
            <div className="px-4 pt-2 pb-3 text-center relative z-10">
                <h3 className={`
                    font-medium text-sm transition-colors duration-300
                    ${isActive ? "text-red-600" : isHovered ? "text-red-500" : "text-gray-800"}
                `}>
                    {title}
                </h3>

                {count !== undefined && (
                    <span className="inline-flex items-center justify-center bg-red-100 text-red-700 text-xs rounded-full px-2 py-0.5 mt-1">
                        {count}
                    </span>
                )}

                <p className={`
                    text-xs mt-1.5 line-clamp-2 transition-colors duration-300
                    ${isActive ? "text-gray-700" : isHovered ? "text-gray-700" : "text-gray-500"}
                `}>
                    {description || "Faites une demande pour ce service..."}
                </p>
            </div>

            {/* Badge "Bientôt disponible" pour les éléments désactivés */}
            {disabled && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex items-center justify-center rounded-lg z-20">
                    <span className="px-2.5 py-1 bg-gray-800/90 text-white text-xs font-medium rounded-full">
                        Bientôt disponible
                    </span>
                </div>
            )}

            {/* Badge de sélection */}
            {isActive && (
                <div className="absolute top-3 right-3 z-20">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-medium bg-red-500 text-white shadow-sm">
                        ✓
                    </span>
                </div>
            )}
        </div>
    );
};

export default DemandeCard; 