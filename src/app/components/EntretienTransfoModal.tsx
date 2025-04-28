"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/src/store/hooks"; // Import du hook de sélection du store Redux

interface EntretienTransfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    prestationType?: string;
}

export default function EntretienTransfoModal({
    isOpen,
    onClose,
    prestationType = "Entretien transformateur",
}: EntretienTransfoModalProps) {
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        entreprise: "",
        telephone: "",
        email: "",
        typePrestation: prestationType,
        besoin: "",
    });

    // Récupérer les informations de l'utilisateur connecté depuis Redux store
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

    // Récupérer les informations de l'utilisateur stockées dans localStorage si Redux n'est pas disponible
    useEffect(() => {
        const fetchUserData = () => {
            try {
                // Vérifier si l'utilisateur est déjà authentifié via Redux
                if (isAuthenticated && user) {
                    setFormData(prevData => ({
                        ...prevData,
                        nom: user.firstname || "",
                        prenom: user.lastname || "",
                        telephone: user.contact || "",
                        email: user.email || ""
                    }));
                    return;
                }

                // Sinon, essayer de récupérer depuis localStorage
                if (typeof window !== "undefined") {
                    const storedUser = localStorage.getItem("user");
                    if (storedUser) {
                        const userData = JSON.parse(storedUser);
                        setFormData(prevData => ({
                            ...prevData,
                            nom: userData.firstname || "",
                            prenom: userData.lastname || "",
                            telephone: userData.contact || "",
                            email: userData.email || ""
                        }));
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données utilisateur:", error);
            }
        };

        if (isOpen) {
            fetchUserData();
        }
    }, [isOpen, user, isAuthenticated]);

    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFocusedField(e.target.name);
    };

    const handleBlur = () => {
        setFocusedField(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simuler un délai d'envoi pour montrer l'animation de chargement
        setTimeout(() => {
            console.log("Formulaire soumis:", formData);
            // Ici, vous pouvez ajouter la logique pour envoyer les données
            setIsSubmitting(false);
            onClose();
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
            {/* Overlay avec effet de flou */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-scaleIn mx-4">
                {/* Header avec dégradé et motif */}
                <div className="bg-gradient-to-r from-[#3E4C70] to-[#2C3650] text-white py-8 px-8 relative overflow-hidden">
                    {/* Motif décoratif */}
                    <div className="absolute top-0 right-0 w-60 h-60 opacity-10">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <path fill="white" d="M42.7,-62.9C57.8,-53.8,73.8,-44.6,81.4,-30.6C89,-16.6,88.2,2.3,82.6,19.2C76.9,36.1,66.5,50.9,52.4,59.7C38.2,68.4,20.3,71.1,1.9,68.6C-16.5,66.2,-33,58.7,-46,47.4C-59,36.1,-68.6,21,-71.9,4.1C-75.3,-12.8,-72.5,-31.5,-62.9,-44.9C-53.3,-58.3,-37.1,-66.4,-21.8,-75.4C-6.5,-84.3,7.8,-94.1,22.1,-90.4C36.3,-86.7,50.5,-69.5,57.7,-56.4C64.9,-43.3,65.1,-34.2,65.9,-25.5C66.7,-16.7,68.1,-8.4,69.9,0.7C71.8,9.7,74.1,19.4,73.3,30.2C72.5,41,68.7,52.8,59.5,58.2C50.4,63.5,35.9,62.3,22.3,63.7C8.8,65.1,-3.9,69.2,-17,69.2C-30.1,69.3,-43.6,65.3,-54.2,57.1C-64.8,48.9,-72.3,36.4,-77.1,22.8C-82,9.1,-84.2,-5.8,-79.8,-17.7C-75.4,-29.6,-64.4,-38.5,-52.6,-45.8C-40.8,-53.2,-28.3,-59,-15.8,-64.5C-3.4,-70,9,-75.3,21.9,-74.1C34.8,-73,48.2,-65.4,42.7,-62.9Z" transform="translate(100 100)" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center mb-2">
                            <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full mr-3">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">{prestationType}</h2>
                        </div>
                        <p className="text-gray-200 ml-[3.25rem] font-light text-sm">
                            Vous pouvez prendre rendez-vous pour toutes prestations
                        </p>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all duration-200"
                        aria-label="Fermer"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="form-group relative">
                            <label
                                htmlFor="nom"
                                className={`flex items-center text-sm font-medium transition-all duration-200 ${focusedField === 'nom' ? 'text-[#EC4F48]' : 'text-gray-700'
                                    }`}
                            >
                                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                </svg>
                                Nom
                            </label>
                            <div className="relative mt-1 group">
                                <input
                                    type="text"
                                    id="nom"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC4F48] focus:border-transparent transition-all duration-200 shadow-sm group-hover:border-gray-400"
                                    placeholder="Votre nom"
                                />
                                <div className={`absolute bottom-0 left-0 h-0.5 bg-[#EC4F48] transition-all duration-300 ${focusedField === 'nom' ? 'w-full' : 'w-0'
                                    }`}></div>
                            </div>
                        </div>

                        <div className="form-group relative">
                            <label
                                htmlFor="prenom"
                                className={`flex items-center text-sm font-medium transition-all duration-200 ${focusedField === 'prenom' ? 'text-[#EC4F48]' : 'text-gray-700'
                                    }`}
                            >
                                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                                </svg>
                                Prénoms
                            </label>
                            <div className="relative mt-1 group">
                                <input
                                    type="text"
                                    id="prenom"
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC4F48] focus:border-transparent transition-all duration-200 shadow-sm group-hover:border-gray-400"
                                    placeholder="Votre prénom"
                                />
                                <div className={`absolute bottom-0 left-0 h-0.5 bg-[#EC4F48] transition-all duration-300 ${focusedField === 'prenom' ? 'w-full' : 'w-0'
                                    }`}></div>
                            </div>
                        </div>
                    </div>

                    <div className="form-group relative">
                        <label
                            htmlFor="entreprise"
                            className={`flex items-center text-sm font-medium transition-all duration-200 ${focusedField === 'entreprise' ? 'text-[#EC4F48]' : 'text-gray-700'
                                }`}
                        >
                            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"></path>
                            </svg>
                            Entreprise
                        </label>
                        <div className="relative mt-1 group">
                            <input
                                type="text"
                                id="entreprise"
                                name="entreprise"
                                value={formData.entreprise}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC4F48] focus:border-transparent transition-all duration-200 shadow-sm group-hover:border-gray-400"
                                placeholder="Nom de votre entreprise"
                            />
                            <div className={`absolute bottom-0 left-0 h-0.5 bg-[#EC4F48] transition-all duration-300 ${focusedField === 'entreprise' ? 'w-full' : 'w-0'
                                }`}></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="form-group relative">
                            <label
                                htmlFor="telephone"
                                className={`flex items-center text-sm font-medium transition-all duration-200 ${focusedField === 'telephone' ? 'text-[#EC4F48]' : 'text-gray-700'
                                    }`}
                            >
                                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                                </svg>
                                N° Téléphone <span className="text-[#EC4F48]">*</span>
                            </label>
                            <div className="relative mt-1 group">
                                <input
                                    type="tel"
                                    id="telephone"
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    required
                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC4F48] focus:border-transparent transition-all duration-200 shadow-sm group-hover:border-gray-400"
                                    placeholder="01 23 45 67 89"
                                />
                                <div className={`absolute bottom-0 left-0 h-0.5 bg-[#EC4F48] transition-all duration-300 ${focusedField === 'telephone' ? 'w-full' : 'w-0'
                                    }`}></div>
                            </div>
                        </div>

                        <div className="form-group relative">
                            <label
                                htmlFor="email"
                                className={`flex items-center text-sm font-medium transition-all duration-200 ${focusedField === 'email' ? 'text-[#EC4F48]' : 'text-gray-700'
                                    }`}
                            >
                                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                </svg>
                                Email <span className="text-[#EC4F48]">*</span>
                            </label>
                            <div className="relative mt-1 group">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    required
                                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC4F48] focus:border-transparent transition-all duration-200 shadow-sm group-hover:border-gray-400"
                                    placeholder="exemple@email.com"
                                />
                                <div className={`absolute bottom-0 left-0 h-0.5 bg-[#EC4F48] transition-all duration-300 ${focusedField === 'email' ? 'w-full' : 'w-0'
                                    }`}></div>
                            </div>
                        </div>
                    </div>

                    <div className="form-group relative">
                        <label
                            htmlFor="typePrestation"
                            className="flex items-center text-sm font-medium text-gray-700"
                        >
                            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
                            </svg>
                            Type de prestation
                        </label>
                        <div className="relative mt-1">
                            <input
                                type="text"
                                id="typePrestation"
                                name="typePrestation"
                                value={formData.typePrestation}
                                onChange={handleChange}
                                readOnly
                                className="w-full px-4 py-3.5 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="form-group relative">
                        <label
                            htmlFor="besoin"
                            className={`flex items-center text-sm font-medium transition-all duration-200 ${focusedField === 'besoin' ? 'text-[#EC4F48]' : 'text-gray-700'
                                }`}
                        >
                            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                            </svg>
                            Décrivez votre besoin
                        </label>
                        <div className="relative mt-1 group">
                            <textarea
                                id="besoin"
                                name="besoin"
                                value={formData.besoin}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                rows={4}
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EC4F48] focus:border-transparent transition-all duration-200 shadow-sm group-hover:border-gray-400"
                                placeholder="Précisez votre demande ici..."
                            />
                            <div className={`absolute bottom-0 left-0 h-0.5 bg-[#EC4F48] transition-all duration-300 ${focusedField === 'besoin' ? 'w-full' : 'w-0'
                                }`}></div>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 flex items-center">
                        <svg className="w-4 h-4 mr-1.5 text-[#EC4F48]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-[#EC4F48] font-medium">*</span> Champs obligatoires
                    </p>

                    <div className="flex justify-between items-center pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-3.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium hover:shadow-md flex items-center justify-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            Annuler
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-10 py-3.5 bg-gradient-to-r from-[#EC4F48] to-[#e13e37] text-white rounded-lg transition-all duration-300 font-medium flex items-center justify-center ${isSubmitting
                                ? 'opacity-90 cursor-wait'
                                : 'hover:shadow-lg hover:translate-y-[-1px]'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Envoi en cours...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                    </svg>
                                    Envoyer
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 