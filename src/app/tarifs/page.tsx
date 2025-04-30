"use client";

import { useState, useEffect } from "react";
import GenericPage from "../components/GenericPage";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaDownload, FaEye, FaClock } from "react-icons/fa";

export default function TarifsPage() {
  const [currentPdfUrl, setCurrentPdfUrl] = useState("/test.pdf");
  const [isLoading, setIsLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);


  // Historique fictif des tarifs récents (les plus récents uniquement)
  const recentTarifHistory = [
    { id: 1, name: "Tarifs 2023", url: "/test.pdf", date: "Janvier 2023", description: "Grille tarifaire pour les clients résidentiels" },
    { id: 2, name: "Tarifs 2022", url: "/test.pdf", date: "Janvier 2022", description: "Ancienne grille tarifaire (pour référence)" },
  ];

  useEffect(() => {
    // Simuler un temps de chargement pour l'effet visuel
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowAnimation(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = currentPdfUrl;
    link.download = "tarifs.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewTarif = (url: string) => {
    setIsLoading(true);
    setCurrentPdfUrl(url);

    // Scroll vers le haut pour voir l'aperçu principal
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Réinitialiser l'état de chargement après un court délai
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // Variants pour les animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="w-full -mt-[290px]">
        <GenericPage
          title="Nos Tarifs"
          description="Consultez les tarifs en vigueur pour tous vos services d'eau et d'assainissement."
          buttonText="Voir l'historique des tarifs"
          buttonLink="/historique-tarifs"
        />

        <div className="w-[91%] mx-auto -mt-64">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mb-12"
          >
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl overflow-hidden p-6 mb-8 border border-gray-100 hover:border-gray-200 transition-all duration-300"
              style={{ boxShadow: '0 10px 40px -15px rgba(0, 0, 0, 0.05)' }}
            >
              <div className="flex items-center mb-7">
                <div className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-r from-vert/10 to-vert/5 mr-4">
                  <svg className="w-5 h-5 text-vert" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-noir">Tarifs en vigueur</h2>
              </div>

              <div className="flex flex-col lg:flex-row gap-10">
                {/* PDF Preview */}
                <div className="w-full lg:w-3/4 relative">
                  <div className="relative h-[600px] rounded-xl overflow-hidden bg-gray-50 border border-gray-100 transition-all duration-300"
                    style={{ boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.05)' }}>
                    {isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vert"></div>
                      </div>
                    )}
                    <iframe
                      src={`${currentPdfUrl}#toolbar=0`}
                      className="w-full h-full"
                      title="Aperçu des tarifs"
                      style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease-in-out' }}
                    />
                  </div>
                  <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm text-gray-700 font-medium border border-white/60">
                    Document officiel
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full lg:w-1/4">
                  <div className="bg-gradient-to-br from-[#FAFBFF] to-[#F7F9FD] p-7 rounded-xl border border-gray-100 transition-all duration-300"
                    style={{ boxShadow: '0 10px 30px -15px rgba(0, 0, 0, 0.03)' }}>
                    <h3 className="text-xl font-semibold mb-6 text-noir">Actions</h3>

                    <div className="space-y-4">
                      <button
                        onClick={handleDownload}
                        className="w-full bg-gradient-to-r from-orange to-orange/90 hover:from-orange/95 hover:to-orange/85 text-white font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center transition-all duration-300"
                        style={{ boxShadow: '0 5px 15px -5px rgba(255, 153, 0, 0.3)' }}
                      >
                        <FaDownload className="w-5 h-5 mr-2" />
                        Télécharger le PDF
                      </button>

                      <Link
                        href="/historique-tarifs"
                        className="w-full block bg-white hover:bg-gray-50 text-noir font-medium py-3.5 px-4 rounded-xl flex items-center justify-center transition-all duration-300 border border-gray-200"
                        style={{ boxShadow: '0 5px 15px -8px rgba(0, 0, 0, 0.05)' }}
                      >
                        <FaClock className="w-5 h-5 mr-2 text-vert" />
                        Historique complet
                      </Link>
                    </div>

                    <div className="mt-9 pt-6 border-t border-gray-100">
                      <h4 className="font-medium text-gray-700 mb-4">Informations</h4>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-start">
                          <div className="w-6 h-6 flex items-center justify-center bg-vert/5 rounded-full mr-2.5 mt-0.5">
                            <svg className="w-3.5 h-3.5 text-vert" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <span className="text-gray-600">Les tarifs sont mis à jour chaque année</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-6 h-6 flex items-center justify-center bg-vert/5 rounded-full mr-2.5 mt-0.5">
                            <svg className="w-3.5 h-3.5 text-vert" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <span className="text-gray-600">Document validé par les autorités de régulation</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Aperçu des tarifs récents */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 hover:border-gray-200 transition-all duration-300"
              style={{ boxShadow: '0 10px 40px -15px rgba(0, 0, 0, 0.05)' }}
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                  <div className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-r from-orange/10 to-orange/5 mr-4">
                    <svg className="w-5 h-5 text-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-noir">Tarifs récents</h2>
                </div>
                <Link
                  href="/historique-tarifs"
                  className="text-vert hover:text-vert/80 font-medium flex items-center transition-all duration-300 group"
                >
                  Voir tout l'historique
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recentTarifHistory.map((tarif, index) => (
                  <motion.div
                    key={tarif.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate={showAnimation ? "visible" : "hidden"}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-[#FCFCFC] to-[#F8F9FB] rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 group transition-all duration-300"
                    style={{ boxShadow: '0 10px 30px -15px rgba(0, 0, 0, 0.05)' }}
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent z-10"></div>
                      <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm text-gray-800 font-medium border border-white/60">
                        {tarif.date}
                      </div>
                      {/* Aperçu du PDF miniature */}
                      <div className="w-full h-[200px] overflow-hidden bg-white">
                        <iframe
                          src={`${tarif.url}#toolbar=0&view=FitH&scrollbar=0`}
                          className="w-full h-full"
                          title={`Aperçu de ${tarif.name}`}
                        />
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-noir mb-2">{tarif.name}</h3>
                      <p className="text-gray-600 text-sm mb-7">{tarif.description}</p>

                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleViewTarif(tarif.url)}
                          className="px-5 py-2.5 bg-vert hover:bg-vert/90 text-white rounded-lg flex items-center transition-all duration-300"
                          style={{ boxShadow: '0 4px 12px -4px rgba(37, 160, 120, 0.3)' }}
                        >
                          <FaEye className="w-4 h-4 mr-2" />
                          Afficher
                        </button>
                        <a
                          href={tarif.url}
                          download={`${tarif.name}.pdf`}
                          className="px-5 py-2.5 bg-orange hover:bg-orange/90 text-white rounded-lg flex items-center transition-all duration-300"
                          style={{ boxShadow: '0 4px 12px -4px rgba(255, 153, 0, 0.3)' }}
                        >
                          <FaDownload className="w-4 h-4 mr-2" />
                          Télécharger
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
