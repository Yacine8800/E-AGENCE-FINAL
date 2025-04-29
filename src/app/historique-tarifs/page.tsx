"use client";

import { useState, useEffect } from "react";
import GenericPage from "../components/GenericPage";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaDownload, FaEye, FaSearch, FaClock, FaChevronUp, FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function HistoriqueTarifsPage() {
    // Historique complet des tarifs (à remplacer par des données réelles)
    const allTarifHistory = [
        { id: 1, name: "Tarifs 2023", url: "/test.pdf", date: "Janvier 2023", category: "Résidentiel", description: "Tarifs résidentiels en vigueur" },
        { id: 2, name: "Tarifs 2022", url: "/test.pdf", date: "Janvier 2022", category: "Résidentiel", description: "Anciens tarifs résidentiels" },
        { id: 3, name: "Tarifs 2021", url: "/test.pdf", date: "Janvier 2021", category: "Résidentiel", description: "Archives 2021" },
        { id: 4, name: "Tarifs 2020", url: "/test.pdf", date: "Janvier 2020", category: "Résidentiel", description: "Archives 2020" },
        { id: 5, name: "Tarifs 2019", url: "/test.pdf", date: "Janvier 2019", category: "Résidentiel", description: "Archives 2019" },
        { id: 6, name: "Tarifs Pro 2023", url: "/test.pdf", date: "Janvier 2023", category: "Professionnel", description: "Tarifs professionnels actuels" },
        { id: 7, name: "Tarifs Pro 2022", url: "/test.pdf", date: "Janvier 2022", category: "Professionnel", description: "Tarifs professionnels 2022" },
        { id: 8, name: "Tarifs Pro 2021", url: "/test.pdf", date: "Janvier 2021", category: "Professionnel", description: "Archives pro 2021" },
        { id: 9, name: "Tarifs Pro 2020", url: "/test.pdf", date: "Janvier 2020", category: "Professionnel", description: "Archives pro 2020" },
        { id: 10, name: "Tarifs Pro 2019", url: "/test.pdf", date: "Janvier 2019", category: "Professionnel", description: "Archives pro 2019" },
        { id: 11, name: "Tarifs Industriels 2023", url: "/test.pdf", date: "Janvier 2023", category: "Industriel", description: "Tarifs industriels actuels" },
        { id: 12, name: "Tarifs Industriels 2022", url: "/test.pdf", date: "Janvier 2022", category: "Industriel", description: "Tarifs industriels 2022" },
    ];

    const [filter, setFilter] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
    const [selectedPdfName, setSelectedPdfName] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        // Effet pour l'animation d'entrée
        const timer = setTimeout(() => {
            setShowAnimation(true);
        }, 300);

        // Réinitialiser la page actuelle lors des changements de filtre ou de recherche
        setCurrentPage(1);

        return () => clearTimeout(timer);
    }, [filter, searchTerm]);

    const filteredTarifs = allTarifHistory.filter(tarif => {
        const matchesFilter = filter ? tarif.category === filter : true;
        const matchesSearch = searchTerm
            ? tarif.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tarif.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tarif.description.toLowerCase().includes(searchTerm.toLowerCase())
            : true;

        return matchesFilter && matchesSearch;
    });

    // Grouper par année pour un meilleur affichage
    const groupedByYear = filteredTarifs.reduce((acc, tarif) => {
        const year = tarif.date.split(" ")[1]; // Extrait l'année de "Janvier 2023"
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(tarif);
        return acc;
    }, {} as Record<string, typeof filteredTarifs>);

    // Trier les années par ordre décroissant
    const sortedYears = Object.keys(groupedByYear).sort((a, b) => parseInt(b) - parseInt(a));

    // Calculer les tarifs à afficher pour la pagination
    const totalFilteredItems = filteredTarifs.length;
    const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);

    // Préparer des données paginées si nécessaire
    const paginatedTarifs = filteredTarifs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Obtenir toutes les catégories uniques
    const categories = Array.from(new Set(allTarifHistory.map(tarif => tarif.category)));

    const handleDownload = (url: string, fileName: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const openPdfModal = (url: string, name: string) => {
        setIsLoading(true);
        setSelectedPdf(url);
        setSelectedPdfName(name);
        document.body.style.overflow = 'hidden'; // Désactiver le défilement de la page
    };

    const closePdfModal = () => {
        setSelectedPdf(null);
        setSelectedPdfName("");
        document.body.style.overflow = ''; // Réactiver le défilement de la page
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll vers le haut pour voir les résultats
        window.scrollTo({
            top: document.getElementById('results-container')?.offsetTop ?? 0,
            behavior: 'smooth'
        });
    };

    // Variants pour les animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.4 }
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3, ease: "easeOut" }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.2, ease: "easeIn" }
        }
    };

    return (
        <div className="min-h-screen ">
            <div className="w-full -mt-[250px]">
                <GenericPage
                    title="Historique des Tarifs"
                    description="Consultez l'historique complet des tarifs disponibles depuis 2019."
                    buttonText="Retour aux tarifs actuels"
                    buttonLink="/tarifs"
                />

                {/* PDF Viewer Modal */}
                {selectedPdf && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        initial="hidden"
                        animate="visible"
                        variants={modalVariants}
                        onClick={closePdfModal}
                    >
                        <motion.div
                            className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col border border-gray-100"
                            style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center p-4 border-b border-gray-100">
                                <div className="flex items-center">
                                    <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-orange/10 to-orange/5 mr-3">
                                        <svg className="w-4 h-4 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold">{selectedPdfName}</h3>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleDownload(selectedPdf, `${selectedPdfName}.pdf`)}
                                        className="px-4 py-2 bg-gradient-to-r from-orange to-orange/90 hover:from-orange/95 hover:to-orange/85 text-white rounded-lg flex items-center transition-all duration-300"
                                        style={{ boxShadow: '0 4px 12px -4px rgba(255, 153, 0, 0.3)' }}
                                    >
                                        <FaDownload className="w-4 h-4 mr-1.5" />
                                        Télécharger
                                    </button>
                                    <button
                                        onClick={closePdfModal}
                                        className="text-gray-500 hover:text-noir bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-all duration-300"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="relative flex-grow overflow-hidden">
                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vert"></div>
                                    </div>
                                )}
                                <iframe
                                    src={`${selectedPdf}#toolbar=1`}
                                    className="w-full h-full"
                                    title="Aperçu du document"
                                    onLoad={() => setIsLoading(false)}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                <div className="w-[91%] mx-auto -mt-64">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <motion.div
                            variants={itemVariants}
                            className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 hover:border-gray-200 transition-all duration-300"
                            style={{ boxShadow: '0 10px 40px -15px rgba(0, 0, 0, 0.05)' }}
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                <div className="flex items-center">
                                    <div className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-r from-vert/10 to-vert/5 mr-4">
                                        <FaClock className="w-5 h-5 text-vert" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-noir">Archives des tarifs</h1>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                    <div className="relative flex-grow">
                                        <input
                                            type="text"
                                            placeholder="Rechercher..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full py-2.5 px-4 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-vert focus:border-transparent shadow-sm transition-all duration-300"
                                        />
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <FaSearch className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Filtres par catégorie */}
                            <div className="mb-8">
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${filter === null ? 'bg-gradient-to-r from-vert to-vert/90 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                        onClick={() => setFilter(null)}
                                    >
                                        Tous les tarifs
                                    </button>
                                    {categories.map(category => (
                                        <button
                                            key={category}
                                            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${filter === category ? 'bg-gradient-to-r from-vert to-vert/90 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                            onClick={() => setFilter(category)}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Affichage du nombre de résultats et de la pagination */}
                            <div className="flex justify-between items-center mb-6">
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium text-noir">{totalFilteredItems}</span> résultat{totalFilteredItems !== 1 ? 's' : ''} trouvé{totalFilteredItems !== 1 ? 's' : ''}
                                </div>
                                {totalPages > 1 && (
                                    <div className="text-sm text-gray-600">
                                        Page <span className="font-medium text-noir">{currentPage}</span> sur <span className="font-medium text-noir">{totalPages}</span>
                                    </div>
                                )}
                            </div>

                            {/* Container des résultats */}
                            <div id="results-container">
                                {filteredTarifs.length === 0 ? (
                                    <motion.div
                                        variants={itemVariants}
                                        className="text-center py-16 bg-gradient-to-b from-gray-50 to-gray-100/50 rounded-xl border border-gray-100"
                                    >
                                        <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                        <h3 className="mt-4 text-xl font-medium text-gray-900">Aucun résultat trouvé</h3>
                                        <p className="mt-2 text-gray-500 max-w-md mx-auto">Nous n'avons pas trouvé de documents correspondant à vos critères de recherche.</p>
                                        <button
                                            onClick={() => { setFilter(null); setSearchTerm(""); }}
                                            className="mt-6 px-6 py-3 bg-gradient-to-r from-vert to-vert/90 text-white rounded-xl shadow-md hover:from-vert/95 hover:to-vert/85 transition-all duration-300"
                                            style={{ boxShadow: '0 4px 12px -4px rgba(37, 160, 120, 0.3)' }}
                                        >
                                            Réinitialiser les filtres
                                        </button>
                                    </motion.div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {paginatedTarifs.map((tarif, index) => (
                                                <motion.div
                                                    key={tarif.id}
                                                    variants={itemVariants}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="bg-gradient-to-br from-[#FCFCFC] to-[#F8F9FB] rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 group transition-all duration-300"
                                                    style={{ boxShadow: '0 10px 30px -15px rgba(0, 0, 0, 0.05)' }}
                                                >
                                                    <div className="relative">
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent z-10"></div>
                                                        <div className="absolute top-3 left-3 z-20">
                                                            <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-white/90 backdrop-blur-sm text-gray-800 border border-white/60">
                                                                {tarif.category}
                                                            </span>
                                                        </div>
                                                        <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm text-gray-800 font-medium border border-white/60">
                                                            {tarif.date}
                                                        </div>

                                                        {/* Aperçu du PDF miniature */}
                                                        <div
                                                            className="w-full h-[150px] overflow-hidden bg-white group-hover:brightness-105 transition-all cursor-pointer"
                                                            onClick={() => openPdfModal(tarif.url, tarif.name)}
                                                        >
                                                            <iframe
                                                                src={`${tarif.url}#toolbar=0&view=FitH&scrollbar=0`}
                                                                className="w-full h-full pointer-events-none"
                                                                title={`Aperçu de ${tarif.name}`}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="p-6">
                                                        <h3 className="text-lg font-semibold text-noir mb-1.5">{tarif.name}</h3>
                                                        <p className="text-gray-600 text-sm mb-7">{tarif.description}</p>

                                                        <div className="flex items-center justify-between">
                                                            <button
                                                                onClick={() => openPdfModal(tarif.url, tarif.name)}
                                                                className="px-5 py-2.5 bg-gradient-to-r from-vert to-vert/90 hover:from-vert/95 hover:to-vert/85 text-white rounded-lg flex items-center transition-all duration-300"
                                                                style={{ boxShadow: '0 4px 12px -4px rgba(37, 160, 120, 0.3)' }}
                                                            >
                                                                <FaEye className="w-4 h-4 mr-2" />
                                                                Aperçu
                                                            </button>
                                                            <button
                                                                onClick={() => handleDownload(tarif.url, `${tarif.name}.pdf`)}
                                                                className="px-5 py-2.5 bg-gradient-to-r from-orange to-orange/90 hover:from-orange/95 hover:to-orange/85 text-white rounded-lg flex items-center transition-all duration-300"
                                                                style={{ boxShadow: '0 4px 12px -4px rgba(255, 153, 0, 0.3)' }}
                                                            >
                                                                <FaDownload className="w-4 h-4 mr-2" />
                                                                Télécharger
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <div className="flex justify-center mt-10">
                                                <div className="inline-flex items-center rounded-lg border border-gray-200 bg-white">
                                                    <button
                                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                                        disabled={currentPage === 1}
                                                        className={`flex items-center justify-center h-10 w-10 rounded-l-lg border-r border-gray-200 ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50'} transition-colors`}
                                                    >
                                                        <FaChevronLeft className="w-4 h-4" />
                                                    </button>

                                                    {/* Pages centrales */}
                                                    <div className="flex items-center">
                                                        {[...Array(totalPages)].map((_, i) => {
                                                            const pageNumber = i + 1;
                                                            // Afficher seulement les 5 pages centrales autour de la page actuelle
                                                            if (
                                                                pageNumber === 1 ||
                                                                pageNumber === totalPages ||
                                                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                                            ) {
                                                                return (
                                                                    <button
                                                                        key={pageNumber}
                                                                        onClick={() => handlePageChange(pageNumber)}
                                                                        className={`h-10 w-10 flex items-center justify-center ${currentPage === pageNumber
                                                                            ? 'bg-vert text-white font-medium'
                                                                            : 'text-gray-600 hover:bg-gray-50'
                                                                            } transition-colors`}
                                                                    >
                                                                        {pageNumber}
                                                                    </button>
                                                                );
                                                            } else if (
                                                                pageNumber === currentPage - 2 ||
                                                                pageNumber === currentPage + 2
                                                            ) {
                                                                return (
                                                                    <span
                                                                        key={pageNumber}
                                                                        className="h-10 w-10 flex items-center justify-center text-gray-400"
                                                                    >
                                                                        ...
                                                                    </span>
                                                                );
                                                            }
                                                            return null;
                                                        })}
                                                    </div>

                                                    <button
                                                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                                        disabled={currentPage === totalPages}
                                                        className={`flex items-center justify-center h-10 w-10 rounded-r-lg border-l border-gray-200 ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50'} transition-colors`}
                                                    >
                                                        <FaChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>

                        {/* Section de retour en haut et accès rapide */}
                        <motion.div
                            variants={itemVariants}
                            className="fixed bottom-6 right-6 flex flex-col gap-3"
                        >
                            <button
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 hover:text-noir border border-gray-100 group"
                                style={{ boxShadow: '0 5px 15px -8px rgba(0, 0, 0, 0.1)' }}
                                aria-label="Retour en haut"
                            >
                                <FaChevronUp className="w-5 h-5 transform group-hover:-translate-y-1 transition-transform duration-300" />
                            </button>
                            <Link
                                href="/tarifs"
                                className="p-3 bg-gradient-to-r from-vert to-vert/90 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-white border border-vert/10 group"
                                style={{ boxShadow: '0 5px 15px -8px rgba(37, 160, 120, 0.3)' }}
                                aria-label="Retour aux tarifs"
                            >
                                <FaArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
} 