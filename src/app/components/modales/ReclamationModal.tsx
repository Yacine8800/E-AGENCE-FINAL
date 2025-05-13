import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReclamationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const ReclamationModal: React.FC<ReclamationModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        // Step 1
        forSelf: true,
        lastName: '',
        firstName: '',
        clientId: '',
        reference: '',
        phoneNumber: '',
        email: '',
        commune: '',
        quartier: '',
        sousQuartier: '',

        // Step 2
        contactPerson: {
            lastName: '',
            firstName: '',
            phoneNumber: '',
        },

        // Step 3
        reclamationType: 'Facture',
        motif: '',
        certifiedConforme: false,
    });

    // Utiliser useRef pour stabiliser les fonctions de gestion d'événements
    const handleChangeRef = useRef((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const isCheckbox = type === 'checkbox';
        const newValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;

        setFormData(prevState => {
            if (name.includes('.')) {
                const [parent, child] = name.split('.');
                const parentKey = parent as keyof typeof prevState;
                const parentValue = prevState[parentKey];

                if (parentValue && typeof parentValue === 'object') {
                    return {
                        ...prevState,
                        [parent]: {
                            ...parentValue,
                            [child]: newValue
                        }
                    };
                }
                return prevState;
            } else {
                return {
                    ...prevState,
                    [name]: newValue
                };
            }
        });
    });

    const handleRadioChangeRef = useRef((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData(prevState => {
            if (name === 'reclamationFor') {
                return {
                    ...prevState,
                    forSelf: value === 'self'
                };
            } else if (name === 'reclamationType') {
                return {
                    ...prevState,
                    reclamationType: value
                };
            }
            return prevState;
        });
    });

    // Reset to first step when modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(1);
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            // Show loader and submit form data
            setIsSubmitting(true);

            // Simulate API delay - Replace with actual API call
            setTimeout(() => {
                onSubmit(formData);
                setIsSubmitting(false);
            }, 1500);
        }
    };

    const goBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            onClose();
        }
    };

    if (!isOpen) return null;

    // Add a loader component in the button
    const Loader = () => (
        <div className="flex items-center justify-center">
            <div className="relative w-5 h-5">
                {/* Circular spinner */}
                <div className="absolute inset-0 border-2 border-white rounded-full border-t-transparent animate-spin"></div>

                {/* Central dot */}
                <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
        </div>
    );

    // Submission overlay component
    const SubmissionOverlay = () => (
        <AnimatePresence>
            {isSubmitting && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
                >
                    <div className="relative w-16 h-16 mb-4">
                        {/* Outer circle animation */}
                        <div className="absolute inset-0 border-4 border-[#EB4F47]/20 rounded-full"></div>

                        {/* Spinning loader */}
                        <div className="absolute inset-0 border-4 border-[#EB4F47] rounded-full border-t-transparent animate-spin"></div>

                        {/* Inner pulse */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-[#EB4F47] rounded-full animate-ping"></div>
                        </div>
                    </div>
                    <motion.p
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-700 font-medium text-lg"
                    >
                        Traitement en cours...
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Custom form components with React.memo to prevent unnecessary re-renders
    const CustomRadio = React.memo(({ name, value, checked, onChange, label }: { name: string, value: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, label: string }) => (
        <label className={`flex items-center space-x-3 cursor-pointer group`}>
            <div className="relative">
                <input
                    type="radio"
                    name={name}
                    value={value}
                    checked={checked}
                    onChange={onChange}
                    className="sr-only" // Hidden but accessible
                />
                <div className={`w-5 h-5 border rounded-full transition-all ${checked ? 'border-[#EB4F47]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all ${checked ? 'bg-[#EB4F47] scale-100' : 'bg-transparent scale-0'}`}></div>
                </div>
            </div>
            <span className={`text-sm ${checked ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>{label}</span>
        </label>
    ));

    const CustomCheckbox = React.memo(({ name, checked, onChange, label, required = false }: { name: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, label: string, required?: boolean }) => (
        <label className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative">
                <input
                    type="checkbox"
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    className="sr-only" // Hidden but accessible
                    required={required}
                />
                <div className={`w-5 h-5 border rounded transition-all ${checked ? 'bg-[#EB4F47] border-[#EB4F47]' : 'border-gray-300 group-hover:border-gray-400'} flex items-center justify-center`}>
                    {checked && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
            </div>
            <span className="text-sm text-gray-700">
                {label} {required && <span className="text-[#EB4F47]">*</span>}
            </span>
        </label>
    ));

    const CustomInput = React.memo(({ label, name, value, onChange, placeholder, type = "text", required = false }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string, type?: string, required?: boolean }) => (
        <div className="mb-4">
            <label className="block mb-1.5 text-sm font-medium text-gray-700">
                {label} {required && <span className="text-[#EB4F47]">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB4F47]/20 focus:border-[#EB4F47] transition-all duration-200 bg-white shadow-sm"
                placeholder={placeholder}
                required={required}
            />
        </div>
    ));

    const CustomSelect = React.memo(({ label, name, value, onChange, options, required = false }: { label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: { value: string, label: string }[], required?: boolean }) => (
        <div className="mb-4">
            <label className="block mb-1.5 text-sm font-medium text-gray-700">
                {label} {required && <span className="text-[#EB4F47]">*</span>}
            </label>
            <div className="relative">
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="appearance-none w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB4F47]/20 focus:border-[#EB4F47] transition-all duration-200 bg-white shadow-sm text-gray-700"
                    required={required}
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    ));

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
                <div className="flex-1 overflow-auto p-6 bg-white relative">
                    {/* Submission overlay - shows when form is being submitted */}
                    {currentStep === 3 && <SubmissionOverlay />}

                    {/* Stepper with updated animation */}
                    <div className="w-full mb-10">
                        <div className="relative flex items-center justify-between">
                            {/* Line */}
                            <div className="absolute left-0 right-0 h-1 bg-gray-200 rounded">
                                <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${(currentStep - 1) * 50}%` }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                    className="h-full bg-[#EB4F47] rounded"
                                ></motion.div>
                            </div>

                            {/* Step indicators */}
                            {[1, 2, 3].map((step) => (
                                <motion.div
                                    key={step}
                                    initial={{ scale: 0.8 }}
                                    animate={{
                                        scale: currentStep >= step ? 1 : 0.9,
                                        backgroundColor: currentStep >= step ? "#EB4F47" : "#E5E7EB",
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md`}
                                >
                                    {currentStep > step ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        step
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {currentStep === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <h3 className="text-xl font-semibold mb-6 text-gray-800">Infos Demandeur</h3>

                                <div className="mb-6 bg-gray-50 p-4 rounded-xl">
                                    <div className="flex items-center space-x-8 mb-1">
                                        <label className="flex items-center space-x-3 cursor-pointer group">
                                            <div className="relative">
                                                <input
                                                    type="radio"
                                                    name="reclamationFor"
                                                    value="self"
                                                    checked={formData.forSelf}
                                                    onChange={handleRadioChangeRef.current}
                                                    className="sr-only"
                                                />
                                                <div className={`w-5 h-5 border rounded-full transition-all ${formData.forSelf ? 'border-[#EB4F47]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all ${formData.forSelf ? 'bg-[#EB4F47] scale-100' : 'bg-transparent scale-0'}`}></div>
                                                </div>
                                            </div>
                                            <span className={`text-sm ${formData.forSelf ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>Réclamation pour soi-même</span>
                                        </label>
                                        <label className="flex items-center space-x-3 cursor-pointer group">
                                            <div className="relative">
                                                <input
                                                    type="radio"
                                                    name="reclamationFor"
                                                    value="other"
                                                    checked={!formData.forSelf}
                                                    onChange={handleRadioChangeRef.current}
                                                    className="sr-only"
                                                />
                                                <div className={`w-5 h-5 border rounded-full transition-all ${!formData.forSelf ? 'border-[#EB4F47]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all ${!formData.forSelf ? 'bg-[#EB4F47] scale-100' : 'bg-transparent scale-0'}`}></div>
                                                </div>
                                            </div>
                                            <span className={`text-sm ${!formData.forSelf ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>Réclamation pour un tiers</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                                            Nom <span className="text-[#EB4F47]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChangeRef.current}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB4F47]/20 focus:border-[#EB4F47] transition-all duration-200 bg-white shadow-sm"
                                            placeholder="Nom"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                                            Prénoms <span className="text-[#EB4F47]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChangeRef.current}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB4F47]/20 focus:border-[#EB4F47] transition-all duration-200 bg-white shadow-sm"
                                            placeholder="Prénoms"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                                            Identifiant client
                                        </label>
                                        <input
                                            type="text"
                                            name="clientId"
                                            value={formData.clientId}
                                            onChange={handleChangeRef.current}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB4F47]/20 focus:border-[#EB4F47] transition-all duration-200 bg-white shadow-sm"
                                            placeholder="Identifiant Client"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                                            Référence
                                        </label>
                                        <input
                                            type="text"
                                            name="reference"
                                            value={formData.reference}
                                            onChange={handleChangeRef.current}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB4F47]/20 focus:border-[#EB4F47] transition-all duration-200 bg-white shadow-sm"
                                            placeholder="Référence"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                                            Numéro de téléphone <span className="text-[#EB4F47]">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChangeRef.current}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB4F47]/20 focus:border-[#EB4F47] transition-all duration-200 bg-white shadow-sm"
                                            placeholder="Numéro De Téléphone"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                                            Adresse e-mail
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChangeRef.current}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB4F47]/20 focus:border-[#EB4F47] transition-all duration-200 bg-white shadow-sm"
                                            placeholder="Adresse E-Mail"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="mb-4">
                                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                                            Commune <span className="text-[#EB4F47]">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="commune"
                                                value={formData.commune}
                                                onChange={handleChangeRef.current}
                                                className="appearance-none w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB4F47]/20 focus:border-[#EB4F47] transition-all duration-200 bg-white shadow-sm text-gray-700"
                                                required
                                            >
                                                <option value="">Sélectionner</option>
                                                <option value="commune1">Commune 1</option>
                                                <option value="commune2">Commune 2</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                                            Quartier <span className="text-[#EB4F47]">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="quartier"
                                                value={formData.quartier}
                                                onChange={handleChangeRef.current}
                                                className="appearance-none w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB4F47]/20 focus:border-[#EB4F47] transition-all duration-200 bg-white shadow-sm text-gray-700"
                                                required
                                            >
                                                <option value="">Sélectionner</option>
                                                <option value="quartier1">Quartier 1</option>
                                                <option value="quartier2">Quartier 2</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                                            Sous quartier <span className="text-[#EB4F47]">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="sousQuartier"
                                                value={formData.sousQuartier}
                                                onChange={handleChangeRef.current}
                                                className="appearance-none w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB4F47]/20 focus:border-[#EB4F47] transition-all duration-200 bg-white shadow-sm text-gray-700"
                                                required
                                            >
                                                <option value="">Sélectionner</option>
                                                <option value="sousQuartier1">Sous Quartier 1</option>
                                                <option value="sousQuartier2">Sous Quartier 2</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <h3 className="text-xl font-semibold mb-6 text-gray-800">Autre Personne à contacter</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                                            Nom
                                        </label>
                                        <input
                                            type="text"
                                            name="contactPerson.lastName"
                                            value={formData.contactPerson.lastName}
                                            onChange={handleChangeRef.current}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB4F47]/20 focus:border-[#EB4F47] transition-all duration-200 bg-white shadow-sm"
                                            placeholder="Nom"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                                            Prénoms
                                        </label>
                                        <input
                                            type="text"
                                            name="contactPerson.firstName"
                                            value={formData.contactPerson.firstName}
                                            onChange={handleChangeRef.current}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB4F47]/20 focus:border-[#EB4F47] transition-all duration-200 bg-white shadow-sm"
                                            placeholder="Prénoms"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block mb-1.5 text-sm font-medium text-gray-700">
                                        Numéro de téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        name="contactPerson.phoneNumber"
                                        value={formData.contactPerson.phoneNumber}
                                        onChange={handleChangeRef.current}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB4F47]/20 focus:border-[#EB4F47] transition-all duration-200 bg-white shadow-sm"
                                        placeholder="Numéro De Téléphone"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <h3 className="text-xl font-semibold mb-6 text-gray-800">Veuillez choisir votre type de réclamation</h3>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {[
                                        { value: 'Facture', label: 'Facture' },
                                        { value: 'Service', label: 'Service' },
                                        { value: 'Produits', label: 'Produits' },
                                        { value: 'NMPF', label: 'NMPF' },
                                        { value: 'Prepaiement', label: 'Prépaiement' },
                                        { value: 'Eclairage Public', label: 'Éclairage Public' },
                                        { value: 'Sinistre', label: 'Sinistre' },
                                        { value: 'Achat Energie', label: 'Achat Énergie' }
                                    ].map(option => (
                                        <label
                                            key={option.value}
                                            className={`border-2 rounded-xl p-4 flex items-center space-x-3 cursor-pointer transition-all ${formData.reclamationType === option.value
                                                ? 'border-[#EB4F47] bg-[#FEF0F0] shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="relative">
                                                <input
                                                    type="radio"
                                                    name="reclamationType"
                                                    value={option.value}
                                                    checked={formData.reclamationType === option.value}
                                                    onChange={handleRadioChangeRef.current}
                                                    className="sr-only"
                                                />
                                                <div className={`w-5 h-5 border rounded-full transition-all ${formData.reclamationType === option.value
                                                    ? 'border-[#EB4F47]'
                                                    : 'border-gray-300'
                                                    }`}>
                                                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all ${formData.reclamationType === option.value
                                                        ? 'bg-[#EB4F47] scale-100'
                                                        : 'bg-transparent scale-0'
                                                        }`}></div>
                                                </div>
                                            </div>
                                            <span className={formData.reclamationType === option.value ? 'font-medium' : ''}>{option.label}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="mb-4">
                                    <label className="block mb-1.5 text-sm font-medium text-gray-700">
                                        Motif <span className="text-[#EB4F47]">*</span>
                                    </label>
                                    <textarea
                                        name="motif"
                                        value={formData.motif}
                                        onChange={handleChangeRef.current}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB4F47]/20 focus:border-[#EB4F47] transition-all duration-200 min-h-[120px] shadow-sm"
                                        placeholder="Description Ici ..."
                                        required
                                    ></textarea>
                                </div>

                                <div className="mt-8">
                                    <label className="flex items-center space-x-3 cursor-pointer group">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                name="certifiedConforme"
                                                checked={formData.certifiedConforme}
                                                onChange={handleChangeRef.current}
                                                className="sr-only" // Hidden but accessible
                                                required
                                            />
                                            <div className={`w-5 h-5 border rounded transition-all ${formData.certifiedConforme ? 'bg-[#EB4F47] border-[#EB4F47]' : 'border-gray-300 group-hover:border-gray-400'} flex items-center justify-center`}>
                                                {formData.certifiedConforme && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-sm text-gray-700">
                                            Certifié conforme <span className="text-[#EB4F47]">*</span>
                                        </span>
                                    </label>
                                </div>
                            </motion.div>
                        )}

                        <div className="flex justify-between mt-8">
                            <button
                                type="button"
                                onClick={goBack}
                                className="px-6 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium shadow-sm flex items-center"
                                disabled={isSubmitting}
                            >
                                {currentStep === 1 ? (
                                    <>Annuler</>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                        </svg>
                                        Précédent
                                    </>
                                )}
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-[#EB4F47] rounded-lg text-white hover:bg-[#D13E37] transition-colors shadow-md font-medium flex items-center justify-center min-w-[120px]"
                            >
                                {isSubmitting && currentStep === 3 ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <Loader />
                                        <span className="ml-2">Traitement...</span>
                                    </div>
                                ) : currentStep === 3 ? (
                                    <>Valider</>
                                ) : (
                                    <>
                                        Suivant
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReclamationModal; 