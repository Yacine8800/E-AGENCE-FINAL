import React from 'react';
import { motion } from 'framer-motion';

interface ReclamationSuccessProps {
    isOpen: boolean;
    onClose: () => void;
    requestNumber: string;
}

const ReclamationSuccess: React.FC<ReclamationSuccessProps> = ({
    isOpen,
    onClose,
    requestNumber
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
                onClick={onClose}
            ></div>

            <div className="relative w-[600px] bg-white h-full shadow-2xl overflow-auto flex flex-col rounded-l-3xl transform transition-all duration-500 animate-slideInRight">
                {/* HEADER */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-[#FFFFFF] shadow-sm">
                    <h2 className="text-2xl font-semibold text-center flex-1 text-gray-800">
                        Réclamation
                    </h2>
                    {/* Bouton de fermeture */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer transition-all duration-200"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-gray-500"
                        >
                            <path
                                d="M18 6L6 18M6 6L18 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                {/* CONTENU */}
                <div className="flex-1 overflow-auto p-6 bg-white">
                    <div className="flex flex-col items-center justify-center h-full">
                        {/* Stepper complété */}
                        <div className="w-full mb-12">
                            <div className="relative flex items-center justify-between">
                                {/* Line */}
                                <div className="absolute left-0 right-0 h-1 bg-[#EB4F47] rounded"></div>

                                {/* Step indicators */}
                                {[1, 2, 3].map((step) => (
                                    <motion.div
                                        key={step}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: step * 0.2, duration: 0.3 }}
                                        className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center bg-[#EB4F47] text-white shadow-md"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Success Icon - Paper plane with enhanced animation */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, rotate: -10, y: 20 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0, y: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 15,
                                delay: 0.4
                            }}
                            className="mb-10 relative"
                        >
                            <div className="absolute w-40 h-40 rounded-full bg-[#FEF0F0] -z-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                            <svg width="160" height="160" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="70" cy="70" r="70" fill="#FEF0F0" />
                                <motion.path
                                    d="M40 60L110 40L90 105L65 75L40 60Z"
                                    fill="#EB4F47"
                                    opacity="0.1"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1, delay: 0.6 }}
                                />
                                <motion.path
                                    d="M40 60L110 40L90 105L65 75L40 60Z"
                                    fill="#EB4F47"
                                    stroke="#EB4F47"
                                    strokeWidth="2.5"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1, delay: 0.6 }}
                                />
                                <motion.path
                                    d="M65 75L110 40"
                                    stroke="#EB4F47"
                                    strokeWidth="2.5"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.8, delay: 0.8 }}
                                />
                                <motion.path
                                    d="M63 77L68 96L78 85"
                                    stroke="#EB4F47"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.8, delay: 1 }}
                                />
                            </svg>
                        </motion.div>

                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="text-center max-w-lg bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                        >
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">
                                Votre demande de Réclamation <br /><span className="text-[#EB4F47]">N° {requestNumber}</span><br /> a bien été enregistrée.
                            </h3>
                            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                                Vous recevrez une notification pour suivre son évolution.
                                Vous pouvez consulter le statut de votre demande dans
                            </p>
                            <div className="flex items-center justify-center mb-8">
                                <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#FEF0F0] text-[#EB4F47] font-semibold text-base">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    "Historique de demande"
                                </span>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="px-8 py-3.5 bg-[#EB4F47] rounded-xl text-white hover:bg-[#D13E37] transition-colors shadow-md font-medium"
                            >
                                Faire une nouvelle demande
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReclamationSuccess; 