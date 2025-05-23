import React from 'react';
import DashboardCard from './DashboardCard';

// Types pour les statistiques
interface StatItem {
    id: string;
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: number;
    trendLabel?: string;
    color?: 'primary' | 'success' | 'warning' | 'info' | 'danger';
    subtitle?: string;
    onClick?: () => void;
}

interface StatsGridProps {
    stats: StatItem[];
    isLoading?: boolean;
    title?: string;
    columns?: 2 | 3 | 4;
}

const StatsGrid: React.FC<StatsGridProps> = ({
    stats,
    isLoading = false,
    title,
    columns = 4
}) => {
    // Adapter la classe CSS en fonction du nombre de colonnes
    const getGridClass = () => {
        switch (columns) {
            case 2:
                return 'grid-cols-1 sm:grid-cols-2';
            case 3:
                return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
            case 4:
            default:
                return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
        }
    };

    return (
        <div className="w-full">
            {title && (
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                    <div className="h-px flex-1 bg-gray-100 mx-4"></div>
                </div>
            )}

            <div className={`grid ${getGridClass()} gap-4`}>
                {isLoading ? (
                    // Afficher des cartes de chargement si isLoading est true
                    Array.from({ length: stats.length || 4 }).map((_, index) => (
                        <DashboardCard
                            key={`skeleton-${index}`}
                            title=""
                            value=""
                            isLoading={true}
                        />
                    ))
                ) : (
                    // Afficher les statistiques
                    stats.map((stat) => (
                        <DashboardCard
                            key={stat.id}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            trend={stat.trend}
                            trendLabel={stat.trendLabel}
                            color={stat.color}
                            subtitle={stat.subtitle}
                            onClick={stat.onClick}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default StatsGrid; 