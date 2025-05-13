"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/* 1. Données structurées par section :                               */
/* ------------------------------------------------------------------ */
type Row = { label: string; ht?: string; ttc?: string };

const rows: Record<string, { title: string; sections: { header: string; rows: Row[] }[] }> = {
    social: {
        title: "Domestique social basse tension",
        sections: [
            {
                header: "Tranches",
                rows: [
                    { label: "PRIX kWh Tranche 1", ht: "28,84", ttc: "28,84" },
                    { label: "PRIX kWh Tranche 2", ht: "50,16", ttc: "59,19" },
                ],
            },
            {
                header: "Frais fixes",
                rows: [
                    { label: "PRIME FIXE", ht: "559", ttc: "559" },
                ],
            },
            {
                header: "Redevances & taxes variables",
                rows: [
                    { label: "REDEVANCE RTI", ht: "2 F/kWh" },
                    { label: "REDEV. ELECT. RURAL (VARIABLE)", ht: "1 F/kWh" },
                    { label: "TREOM (ABIDJAN)", ht: "2,5 F/kWh" },
                    { label: "TREOM (AUTRES COMMUNES)", ht: "1 F/kWh" },
                ],
            },
            {
                header: "Redevances fixes",
                rows: [
                    { label: "REDEV. ELECT. RURAL (FIXE)", ht: "100" },
                ],
            },
        ],
    },
    "5a": {
        title: "Domestique général 5A",
        sections: [
            {
                header: "Tranches",
                rows: [
                    { label: "PRIX kWh Tranche 1", ht: "70,00", ttc: "84,00" },
                    { label: "PRIX kWh Tranche 2", ht: "90,00", ttc: "108,00" },
                ],
            },
            {
                header: "Frais fixes",
                rows: [
                    { label: "PRIME FIXE", ht: "800", ttc: "800" },
                ],
            },
            {
                header: "Redevances & taxes variables",
                rows: [
                    { label: "REDEVANCE RTI", ht: "2 F/kWh" },
                    { label: "REDEV. ELECT. RURAL (VARIABLE)", ht: "1 F/kWh" },
                    { label: "TREOM (ABIDJAN)", ht: "2,5 F/kWh" },
                    { label: "TREOM (AUTRES COMMUNES)", ht: "1 F/kWh" },
                ],
            },
            {
                header: "Redevances fixes",
                rows: [
                    { label: "REDEV. ELECT. RURAL (FIXE)", ht: "100" },
                ],
            },
        ],
    },
    "10a": {
        title: "Domestique général 10A",
        sections: [
            {
                header: "Tranches",
                rows: [
                    { label: "PRIX kWh Tranche 1", ht: "80,00", ttc: "96,00" },
                    { label: "PRIX kWh Tranche 2", ht: "100,00", ttc: "120,00" },
                ],
            },
            {
                header: "Frais fixes",
                rows: [
                    { label: "PRIME FIXE", ht: "1000", ttc: "1000" },
                ],
            },
            {
                header: "Redevances & taxes variables",
                rows: [
                    { label: "REDEVANCE RTI", ht: "2 F/kWh" },
                    { label: "REDEV. ELECT. RURAL (VARIABLE)", ht: "1 F/kWh" },
                    { label: "TREOM (ABIDJAN)", ht: "2,5 F/kWh" },
                    { label: "TREOM (AUTRES COMMUNES)", ht: "1 F/kWh" },
                ],
            },
            {
                header: "Redevances fixes",
                rows: [
                    { label: "REDEV. ELECT. RURAL (FIXE)", ht: "100" },
                ],
            },
        ],
    },
    "15a": {
        title: "Domestique général 15A et plus",
        sections: [
            {
                header: "Tranches",
                rows: [
                    { label: "PRIX kWh Tranche 1", ht: "90,00", ttc: "108,00" },
                    { label: "PRIX kWh Tranche 2", ht: "110,00", ttc: "132,00" },
                ],
            },
            {
                header: "Frais fixes",
                rows: [
                    { label: "PRIME FIXE", ht: "1200", ttc: "1200" },
                ],
            },
            {
                header: "Redevances & taxes variables",
                rows: [
                    { label: "REDEVANCE RTI", ht: "2 F/kWh" },
                    { label: "REDEV. ELECT. RURAL (VARIABLE)", ht: "1 F/kWh" },
                    { label: "TREOM (ABIDJAN)", ht: "2,5 F/kWh" },
                    { label: "TREOM (AUTRES COMMUNES)", ht: "1 F/kWh" },
                ],
            },
            {
                header: "Redevances fixes",
                rows: [
                    { label: "REDEV. ELECT. RURAL (FIXE)", ht: "100" },
                ],
            },
        ],
    },
    pro: {
        title: "Professionnel général",
        sections: [
            {
                header: "Tranches",
                rows: [
                    { label: "PRIX kWh Tranche 1", ht: "120,00", ttc: "144,00" },
                    { label: "PRIX kWh Tranche 2", ht: "140,00", ttc: "168,00" },
                ],
            },
            {
                header: "Frais fixes",
                rows: [
                    { label: "PRIME FIXE", ht: "2000", ttc: "2000" },
                ],
            },
            {
                header: "Redevances & taxes variables",
                rows: [
                    { label: "REDEVANCE RTI", ht: "2 F/kWh" },
                    { label: "REDEV. ELECT. RURAL (VARIABLE)", ht: "1 F/kWh" },
                    { label: "TREOM (ABIDJAN)", ht: "2,5 F/kWh" },
                    { label: "TREOM (AUTRES COMMUNES)", ht: "1 F/kWh" },
                ],
            },
            {
                header: "Redevances fixes",
                rows: [
                    { label: "REDEV. ELECT. RURAL (FIXE)", ht: "100" },
                ],
            },
        ],
    },
};

// Types pour les bulles d'énergie
interface EnergyBubbleProps {
    id: number;
    size: number;
    speed: number;
    delay: number;
    color: string;
    left: number;
}

// Composant de bulle d'énergie électrique
const EnergyBubble = ({ delay, size, speed, color, left }: Omit<EnergyBubbleProps, 'id'>) => {
    return (
        <div
            className={`absolute rounded-full ${color} animate-float opacity-70 blur-sm pointer-events-none z-0`}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${speed}s`,
            }}
        >
            <div className="absolute inset-0 animate-pulse" style={{ animationDelay: `${delay * 0.5}s` }}></div>
        </div>
    );
};

/* ------------------------------------------------------------------ */
/* 2. Page :                                                          */
/* ------------------------------------------------------------------ */
export default function TarifDetail() {
    const { categorie } = useParams();
    const data = rows[categorie as string];
    const [isVisible, setIsVisible] = useState(false);
    const [bubbles, setBubbles] = useState<EnergyBubbleProps[]>([]);
    const [activeTab, setActiveTab] = useState(0);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        // Effet de scroll pour animations subtiles
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);

        // Générer les bulles d'énergie électrique
        const generatedBubbles: EnergyBubbleProps[] = [];
        const baseColor = getColor();
        const colors = [
            `bg-[${baseColor}]/30`,

        ];

        for (let i = 0; i < 15; i++) {
            generatedBubbles.push({
                id: i,
                size: Math.random() * 40 + 15, // Entre 15 et 55px
                speed: Math.random() * 8 + 8, // Entre 8 et 16 secondes
                delay: Math.random() * 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                left: Math.random() * 100,
            });
        }

        setBubbles(generatedBubbles);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (!data)
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="p-8 bg-white rounded-xl shadow-lg text-center border border-gray-100">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Catégorie non trouvée</h2>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto">La catégorie tarifaire que vous recherchez n'existe pas ou a été modifiée.</p>
                    <Link href="/tarifs" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300 inline-flex items-center group">
                        <span className="absolute inset-0 w-full h-full rounded-lg bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <svg className="w-5 h-5 mr-2 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="relative">Retour aux tarifs</span>
                    </Link>
                </div>
            </div>
        );

    const getColor = () => {
        switch (categorie) {


            case 'social': return '#FF8F2B'; // orange plus vif
            case '5a': return '#FF8F2B'; // vert plus vif
            case '10a': return '#FF8F2B'; // bleu plus vif
            case '15a': return '#FF8F2B'; // jaune ambre
            case 'pro': return '#FF8F2B'; // violet plus vif
            default: return '#FF8F2B';

            // case 'social': return '#FF8F2B'; // orange plus vif
            // case '5a': return '#17ADAA'; // vert plus vif
            // case '10a': return '#EC4F48'; // bleu plus vif
            // case '15a': return '#F59E0B'; // jaune ambre
            // case 'pro': return '#94C33E'; // violet plus vif
            // default: return '#FF8F2B';

        }
    };

    const color = getColor();
    const colorLight = `${color}15`; // Version très légère de la couleur pour l'arrière-plan

    // Variantes d'animation pour les éléments
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                duration: 0.5
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="min-h-screen pt-12 pb-12 w-[96%] mx-auto relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
            {/* Filtre de verre pour effet glacé */}
            <div className="absolute inset-0 backdrop-blur-[150px] bg-white/30 opacity-30 pointer-events-none"></div>

            {/* Effet de halo lumineux */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 animate-pulse"
                    style={{ backgroundColor: `${color}20`, animationDuration: '7s' }}></div>
                <div className="absolute bottom-1/3 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 animate-pulse"
                    style={{ backgroundColor: `${color}15`, animationDuration: '10s', animationDelay: '1s' }}></div>

                {/* Lignes dynamiques */}
                <div className="absolute top-[15%] right-0 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-40"></div>
                <div className="absolute top-[35%] left-0 w-[40%] h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-30"></div>
                <div className="absolute bottom-[25%] right-0 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-30"></div>
            </div>

            {/* Bulles d'énergie électrique */}
            <div className="absolute inset-0 overflow-hidden">
                {bubbles.map((bubble) => (
                    <EnergyBubble
                        key={bubble.id}
                        size={bubble.size}
                        speed={bubble.speed}
                        delay={bubble.delay}
                        color={bubble.color}
                        left={bubble.left}
                    />
                ))}
            </div>

            {/* Particules d'énergie */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
                <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1.5s' }}></div>
                <div className="absolute bottom-40 left-40 w-1 h-1 bg-yellow-300 rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
            </div>

            <div className={`w-full max-w-6xl mx-auto px-4 sm:px-6 relative z-10 transition-all duration-700`}>
                {/* Navigation avec effet de transition */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-6 sticky top-4 z-50 transition-all duration-300 ${scrolled ? 'opacity-100' : ''}`}>
                    <div className={`inline-flex items-center transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md px-3 py-2 rounded-full shadow-sm' : ''}`}>
                        <Link
                            href="/tarifs"
                            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors group"
                        >
                            <span className="flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-white shadow-sm group-hover:shadow group-hover:bg-orange-50 transition-all duration-300 relative overflow-hidden">
                                {/* Effet de brillance au survol */}
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></span>
                                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </span>
                            <span className="relative">
                                Retour aux tarifs
                                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
                            </span>
                        </Link>
                    </div>
                </motion.div>

                {/* Carte principale avec effet de déplacement */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100/80"
                    whileHover={{
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)",
                        y: -2,
                        transition: { duration: 0.3 }
                    }}
                >
                    {/* Header avec effet de grille */}
                    <div
                        className="relative overflow-hidden"
                        style={{ backgroundColor: colorLight }}
                    >
                        {/* Motifs de lignes électriques */}
                        <div className="absolute inset-0 opacity-10">
                            <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke={color} strokeWidth="0.5" opacity="0.5" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill={`url(#grid)`} />
                            </svg>
                        </div>

                        {/* Éléments décoratifs */}
                        <div className="absolute top-5 right-10 w-20 h-20 rounded-full blur-xl opacity-20"
                            style={{ backgroundColor: color }}></div>
                        <div className="absolute bottom-0 left-1/4 w-40 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-40"></div>

                        <div className="relative px-6 md:px-10 py-12">
                            {/* Contenu du header */}
                            <div className="flex flex-col md:flex-row items-center justify-between">
                                {/* Header avec animations séquentielles */}
                                <div className="w-full md:w-3/5 mb-8 md:mb-0">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                                        transition={{ duration: 0.5 }}
                                        className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium mb-4 relative overflow-hidden"
                                        style={{ backgroundColor: `${color}20`, color }}
                                    >
                                        {/* Effet de pulsation */}
                                        <span className="absolute inset-0 rounded-full animate-pulse"
                                            style={{ backgroundColor: `${color}10`, animationDuration: '3s' }}></span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="relative">Tarif en vigueur</span>
                                    </motion.div>

                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                                        transition={{ duration: 0.5, delay: 0.1 }}
                                        className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight"
                                    >
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                                            {data.title}
                                        </span>
                                    </motion.h1>

                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="text-base text-gray-600 max-w-xl leading-relaxed"
                                    >
                                        Tarifs applicables selon l'arrêté interministériel n° 0644/MMPE/MEF/MBPE du 07/06/2023
                                    </motion.p>
                                </div>

                                {/* Illustration avec animation d'éclair */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="relative w-24 h-24 md:w-32 md:h-32"
                                >
                                    <div className="absolute inset-0 rounded-full opacity-20 animate-pulse"
                                        style={{ backgroundColor: color, animationDuration: '3s' }}></div>
                                    <div className="absolute inset-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center overflow-hidden">
                                        {/* Effet de brillance */}
                                        <div className="absolute -inset-10 bg-white/40 rotate-45 transform -translate-x-full animate-shimmer"
                                            style={{ animationDuration: '3s' }}></div>
                                        <motion.svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-12 h-12 md:w-16 md:h-16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke={color}
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            initial={{ scale: 1 }}
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                filter: ["drop-shadow(0 0 0px rgba(255,255,255,0))", "drop-shadow(0 0 3px rgba(255,255,255,.8))", "drop-shadow(0 0 0px rgba(255,255,255,0))"]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                repeatType: "loop",
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                                        </motion.svg>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Tableau de tarifs avec animations améliorées */}
                    <div className="px-6 md:px-10 py-8">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate={isVisible ? "visible" : "hidden"}
                            className="overflow-hidden rounded-2xl border border-gray-200/80 shadow-sm"
                        >
                            <div className="overflow-x-auto">
                                <table className="w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr style={{ background: `linear-gradient(to right, ${color}, ${color}cc)` }} className="text-white">
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                Libellé
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider border-l border-white/30">
                                                Hors Taxes<br /><span className="font-normal opacity-80">(F CFA)</span>
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider border-l border-white/30">
                                                TTC<br /><span className="font-normal opacity-80">(F CFA)</span>
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {data.sections.map(({ header, rows: sectionRows }, sectionIndex) => (
                                            <React.Fragment key={header}>
                                                {/* Ligne de groupe */}


                                                {/* Lignes réelles */}
                                                {sectionRows.map(({ label, ht, ttc }, idx) => (
                                                    <motion.tr
                                                        key={idx}
                                                        variants={itemVariants}
                                                        className="hover:bg-gray-50 transition-colors duration-150"
                                                        whileHover={{ backgroundColor: `${color}05` }}
                                                    >
                                                        <td className="px-6 py-4 font-medium text-gray-700">{label}</td>
                                                        {label.includes("REDEVANCE") || label.includes("REDEV.") || label.includes("TREOM") ? (
                                                            <td className="px-6 py-4 text-gray-600 font-bold text-center border-l border-gray-200" colSpan={2}>
                                                                {ht ?? "—"}
                                                            </td>
                                                        ) : (
                                                            <>
                                                                <td className="px-6 py-4 text-gray-600 font-bold border-l border-gray-200">{ht ?? "—"}</td>
                                                                <td className="px-6 py-4 text-gray-600 font-bold border-l border-gray-200">
                                                                    {ttc ? (
                                                                        <div className="flex items-center">
                                                                            <span className="">{ttc}</span>
                                                                        </div>
                                                                    ) : "—"}
                                                                </td>
                                                            </>
                                                        )}
                                                    </motion.tr>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>

                        {/* Note de bas de page */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="mt-8 rounded-xl bg-white/90 backdrop-blur-sm p-5 text-sm text-gray-600 leading-relaxed border border-gray-100/80 shadow-sm"
                        >
                            <div className="flex items-center mb-3" style={{ color }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span className="font-semibold">Informations complémentaires</span>
                            </div>
                            <div className="p-3 bg-gray-50/80 backdrop-blur-sm rounded-lg">
                                <p className="text-sm flex flex-wrap gap-x-4 gap-y-2">
                                    <span className="inline-flex items-center">
                                        <span className="font-semibold mr-1">* REDEV :</span> Redevance
                                    </span>
                                    <span className="inline-flex items-center">
                                        <span className="font-semibold mr-1">** TREOM :</span> Taxe de Ramassage et
                                        Enlèvement des Ordures Ménagères
                                    </span>
                                </p>
                            </div>
                            <p className="mt-3 text-xs text-gray-500 italic">
                                Conforme à l'arrêté interministériel n° 0644/MMPE/MEF/MBPE du 07/06/2023 — Ma CIE (Juil. 2023)
                            </p>
                        </motion.div>
                    </div>
                </motion.div>


            </div >
        </div >
    );
}
