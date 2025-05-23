import React, { useState } from 'react';

interface DashboardCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: number;
    trendLabel?: string;
    color?: 'primary' | 'success' | 'warning' | 'info' | 'danger';
    subtitle?: string;
    onClick?: () => void;
    isLoading?: boolean;
    children?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
    title,
    value,
    icon,
    trend,
    trendLabel,
    color = 'primary',
    subtitle,
    onClick,
    isLoading = false,
    children
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // Définir les couleurs en fonction de la propriété color
    const colorMap = {
        primary: {
            bgLight: 'bg-red-50',
            bgDark: 'bg-red-500',
            text: 'text-red-600',
            border: 'border-red-100',
            hoverBorder: 'hover:border-red-200',
            iconBg: 'bg-red-100'
        },
        success: {
            bgLight: 'bg-green-50',
            bgDark: 'bg-green-500',
            text: 'text-green-600',
            border: 'border-green-100',
            hoverBorder: 'hover:border-green-200',
            iconBg: 'bg-green-100'
        },
        warning: {
            bgLight: 'bg-yellow-50',
            bgDark: 'bg-yellow-500',
            text: 'text-yellow-600',
            border: 'border-yellow-100',
            hoverBorder: 'hover:border-yellow-200',
            iconBg: 'bg-yellow-100'
        },
        info: {
            bgLight: 'bg-blue-50',
            bgDark: 'bg-blue-500',
            text: 'text-blue-600',
            border: 'border-blue-100',
            hoverBorder: 'hover:border-blue-200',
            iconBg: 'bg-blue-100'
        },
        danger: {
            bgLight: 'bg-red-50',
            bgDark: 'bg-red-500',
            text: 'text-red-600',
            border: 'border-red-100',
            hoverBorder: 'hover:border-red-200',
            iconBg: 'bg-red-100'
        }
    };

    const currentColor = colorMap[color];

    // Affichage du trend (tendance)
    const renderTrend = () => {
        if (trend === undefined) return null;

        const isPositive = trend > 0;
        const isNeutral = trend === 0;

        return (
            <div className={`flex items-center mt-1 text-xs ${isPositive ? 'text-green-600' : isNeutral ? 'text-gray-500' : 'text-red-600'
                }`}>
                {!isNeutral && (
                    <svg
                        className={`w-3 h-3 mr-1 ${isPositive ? 'rotate-0' : 'rotate-180'}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M12 7a1 1 0 01-1-1V5.414L5.707 9.707a1 1 0 01-1.414-1.414l7-7a1 1 0 011.414 0l7 7a1 1 0 01-1.414 1.414L13 5.414V6a1 1 0 01-1 1z"
                            clipRule="evenodd"
                        />
                    </svg>
                )}
                <span>{isPositive ? '+' : ''}{trend}%</span>
                {trendLabel && <span className="ml-1 text-gray-500">{trendLabel}</span>}
            </div>
        );
    };

    // Composant loading skeleton
    if (isLoading) {
        return (
            <div className={`p-4 rounded-lg border ${currentColor.border} bg-white shadow-sm animate-pulse`}>
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className={`w-10 h-10 rounded-full ${currentColor.bgLight}`}></div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`
        p-4 rounded-lg border ${currentColor.border} bg-white shadow-sm
        transition-all duration-300 ease-in-out overflow-hidden
        ${onClick ? `${currentColor.hoverBorder} cursor-pointer hover:shadow-md` : ''}
        ${isHovered && onClick ? 'transform -translate-y-1' : ''}
      `}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ position: 'relative' }}
        >
            {/* Background decoration */}
            <div
                className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full opacity-10 ${currentColor.bgDark}`}
                style={{
                    transition: 'all 0.3s ease',
                    transform: isHovered ? 'scale(1.2)' : 'scale(1)'
                }}
            />

            <div className="flex justify-between items-start relative z-10">
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
                    <div className="flex items-center">
                        <span className={`text-xl font-semibold ${currentColor.text}`}>{value}</span>
                        {renderTrend()}
                    </div>
                    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
                </div>

                {icon && (
                    <div className={`
            w-10 h-10 rounded-full ${currentColor.iconBg} flex items-center justify-center
            transition-transform duration-300 ${isHovered ? 'transform rotate-12' : ''}
          `}>
                        {icon}
                    </div>
                )}
            </div>

            {children && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    {children}
                </div>
            )}
        </div>
    );
};

export default DashboardCard; 