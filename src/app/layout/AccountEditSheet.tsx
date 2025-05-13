import React, { useState, useEffect } from "react";
import InputTypePiece from "../dashboard/elements/inputTypePiece";
import Image from "next/image";
import { Pencil } from "lucide-react";

interface AccountEditSheetProps {
  open: boolean;
  onClose: () => void;
  mode: "all" | "phone" | "email" | "id";
  initialValues?: {
    phone?: string;
    email?: string;
    idFile?: string;
    firstname?: string;
    lastname?: string;
    profileImage?: string;
  };
  onSubmit: (data: { 
    phone?: string; 
    email?: string; 
    idFile?: string;
    firstname?: string;
    lastname?: string;
    profileImage?: string;
  }) => void;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  idVerified?: boolean;
  onModeChange?: (mode: "all" | "phone" | "email" | "id") => void;
}

const AccountEditSheet: React.FC<AccountEditSheetProps> = ({ open, onClose, mode, initialValues, onSubmit, phoneVerified, emailVerified, idVerified, onModeChange }) => {
  if (!open) return null;

  // State pour la pièce d'identité (type et image)
  const [pieceType, setPieceType] = useState<string>("");
  const [pieceImage, setPieceImage] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    phone: initialValues?.phone || '',
    email: initialValues?.email || '',
    firstname: initialValues?.firstname || '',
    lastname: initialValues?.lastname || '',
  });
  const [profileImage, setProfileImage] = useState<string>(initialValues?.profileImage || '/assets/personne.png');
  const [isPhoneVerified, setIsPhoneVerified] = useState(phoneVerified || false);
  const [isEmailVerified, setIsEmailVerified] = useState(emailVerified || false);
  const [isIdUploaded, setIsIdUploaded] = useState(idVerified || false);
  const [isProfileVerified, setIsProfileVerified] = useState(false);

  // Charger les valeurs depuis localStorage au montage et quand le modal s'ouvre
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const status = localStorage.getItem('accountStatus');
      if (status) {
        try {
          const parsed = JSON.parse(status);
          // Mettre à jour les valeurs du formulaire
          setFormValues(prev => ({
            ...prev,
            firstname: parsed.firstnameValue || initialValues?.firstname || '',
            lastname: parsed.lastnameValue || initialValues?.lastname || '',
            phone: parsed.phoneValue || initialValues?.phone || '',
            email: parsed.emailValue || initialValues?.email || '',
          }));
          // Mettre à jour l'image de profil
          if (parsed.profileImageValue) {
            setProfileImage(parsed.profileImageValue);
          } else if (initialValues?.profileImage) {
            setProfileImage(initialValues.profileImage);
          }
          // Mettre à jour l'état de vérification
          setIsProfileVerified(!!parsed.profileVerified);
        } catch {}
      } else {
        // Si pas de localStorage, utiliser les valeurs initiales
        setFormValues({
          phone: initialValues?.phone || '',
          email: initialValues?.email || '',
          firstname: initialValues?.firstname || '',
          lastname: initialValues?.lastname || '',
        });
        if (initialValues?.profileImage) {
          setProfileImage(initialValues.profileImage);
        }
      }
    }
  }, [initialValues, open]);

  // Charger l'image et le type sauvegardés si présents
  useEffect(() => {
    // On tente de charger depuis localStorage si présent
    let storedIdFile = null;
    let storedIdType = '';
    if (typeof window !== 'undefined') {
      const status = localStorage.getItem('accountStatus');
      if (status) {
        try {
          const parsed = JSON.parse(status);
          storedIdFile = parsed.idFileValue || null;
          storedIdType = parsed.idTypeValue || '';
        } catch {}
      }
    }
    if (initialValues?.idFile) {
      setPieceImage(initialValues.idFile);
    } else if (storedIdFile) {
      setPieceImage(storedIdFile);
    } else {
      setPieceImage(null);
    }
    if (storedIdType) {
      setPieceType(storedIdType);
    } else {
      setPieceType('');
    }
  }, [initialValues?.idFile, open]);

  // Charger les états de vérification depuis localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const status = localStorage.getItem('accountStatus');
      if (status) {
        try {
          const parsed = JSON.parse(status);
          setIsPhoneVerified(parsed.phoneVerified || false);
          setIsEmailVerified(parsed.emailVerified || false);
          setIsIdUploaded(parsed.idVerified || false);
          setIsProfileVerified(parsed.profileVerified || false);
        } catch {}
      }
    }
  }, [open]);

  // Mettre à jour les états quand les props changent
  useEffect(() => {
    setIsPhoneVerified(phoneVerified || false);
    setIsEmailVerified(emailVerified || false);
    setIsIdUploaded(idVerified || false);
  }, [phoneVerified, emailVerified, idVerified]);

  // Gestionnaire de changement des champs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Mettre à jour le localStorage immédiatement
    if (typeof window !== 'undefined') {
      const status = localStorage.getItem('accountStatus');
      let parsed = {};
      if (status) {
        try {
          parsed = JSON.parse(status);
        } catch {}
      }
      
      parsed = { 
        ...parsed, 
        [`${name}Value`]: value
      };
      localStorage.setItem('accountStatus', JSON.stringify(parsed));
    }
  };

  // Gestionnaire pour le changement de photo de profil
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileImage(result);
        setIsProfileVerified(false);
        
        // Sauvegarder dans localStorage
        if (typeof window !== 'undefined') {
          const status = localStorage.getItem('accountStatus');
          let parsed = {};
          if (status) {
            try {
              parsed = JSON.parse(status);
            } catch {}
          }
          parsed = { 
            ...parsed, 
            profileImageValue: result,
            profileVerified: false
          };
          localStorage.setItem('accountStatus', JSON.stringify(parsed));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Callback pour InputTypePiece
  const handlePieceChange = (type: string, image: string | null) => {
    setPieceType(type);
    setPieceImage(image);
    setIsIdUploaded(false);

    // Sauvegarde immédiate dans localStorage
    if (typeof window !== 'undefined') {
      const status = localStorage.getItem('accountStatus');
      let parsed = {};
      if (status) {
        try {
          parsed = JSON.parse(status);
        } catch {}
      }
      parsed = { 
        ...parsed, 
        idFileValue: image, 
        idTypeValue: type,
        idVerified: false 
      };
      localStorage.setItem('accountStatus', JSON.stringify(parsed));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: { 
      phone?: string; 
      email?: string; 
      idFile?: string;
      firstname?: string;
      lastname?: string;
      profileImage?: string;
    } = {};
    
    // Sauvegarder les valeurs dans localStorage
    const currentStatus = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('accountStatus') || '{}') : {};
    
    if (mode === "all") {
      // En mode 'all', on marque comme non vérifié les champs modifiés
      if (formValues.phone !== initialValues?.phone) {
        data.phone = formValues.phone;
        currentStatus.phoneValue = formValues.phone;
        currentStatus.phoneVerified = false;
        setIsPhoneVerified(false);
      }
      if (formValues.email !== initialValues?.email) {
        data.email = formValues.email;
        currentStatus.emailValue = formValues.email;
        currentStatus.emailVerified = false;
        setIsEmailVerified(false);
      }
      if (pieceImage !== initialValues?.idFile) {
        data.idFile = pieceImage || undefined;
        currentStatus.idFileValue = pieceImage;
        currentStatus.idTypeValue = pieceType;
        currentStatus.idVerified = false;
        setIsIdUploaded(false);
      }
      if (formValues.firstname !== initialValues?.firstname || 
          formValues.lastname !== initialValues?.lastname || 
          profileImage !== initialValues?.profileImage) {
        data.firstname = formValues.firstname;
        data.lastname = formValues.lastname;
        data.profileImage = profileImage;
        currentStatus.firstnameValue = formValues.firstname;
        currentStatus.lastnameValue = formValues.lastname;
        currentStatus.profileImageValue = profileImage;
        currentStatus.profileVerified = false;
        setIsProfileVerified(false);
      }
    } else {
      // En mode spécifique, on vérifie le champ correspondant
      if (mode === "phone") {
        data.phone = formValues.phone;
        currentStatus.phoneValue = formValues.phone;
        currentStatus.phoneVerified = true;
        setIsPhoneVerified(true);
      }
      if (mode === "email") {
        data.email = formValues.email;
        currentStatus.emailValue = formValues.email;
        currentStatus.emailVerified = true;
        setIsEmailVerified(true);
      }
      if (mode === "id") {
        data.idFile = pieceImage || undefined;
        currentStatus.idFileValue = pieceImage;
        currentStatus.idTypeValue = pieceType;
        currentStatus.idVerified = true;
        setIsIdUploaded(true);
      }
    }

    // Sauvegarder dans localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('accountStatus', JSON.stringify(currentStatus));
    }

    onSubmit(data);
  };

  // Vérifier si des modifications ont été apportées
  const hasChanges = () => {
    if (mode === 'all') {
      const phoneChanged = formValues.phone !== initialValues?.phone;
      const emailChanged = formValues.email !== initialValues?.email;
      const idChanged = pieceImage !== initialValues?.idFile;
      const firstnameChanged = formValues.firstname !== initialValues?.firstname;
      const lastnameChanged = formValues.lastname !== initialValues?.lastname;
      const profileImageChanged = profileImage !== initialValues?.profileImage;
      return phoneChanged || emailChanged || idChanged || firstnameChanged || lastnameChanged || profileImageChanged;
    }
    return true;
  };

  // Vérifier si le formulaire est valide
  const isFormValid = () => {
    if (mode === 'all') {
      // En mode 'all', on vérifie que les champs modifiés ne sont pas vides
      const phoneValid = !formValues.phone || formValues.phone.trim() !== '';
      const emailValid = !formValues.email || formValues.email.trim() !== '';
      const firstnameValid = !formValues.firstname || formValues.firstname.trim() !== '';
      const lastnameValid = !formValues.lastname || formValues.lastname.trim() !== '';
      return phoneValid && emailValid && firstnameValid && lastnameValid;
    }
    return true;
  };

  // Ajout d'une condition pour désactiver le bouton si pièce incomplète uniquement en mode id
  const isPieceIncomplete = (mode === 'id') && (!pieceType || !pieceImage);
  const isSubmitDisabled = !hasChanges();

  const handleModeChange = (newMode: "all" | "phone" | "email" | "id") => {
    onClose();
    setTimeout(() => {
      if (onModeChange) {
        onModeChange(newMode);
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl overflow-auto flex flex-col rounded-l-2xl transition-all duration-500">
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800 text-center flex-1">
            Modifier mon compte
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full shadow-md cursor-pointer pointer-events-auto bg-gray-100 text-gray-600 hover:text-gray-800"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <form className="flex flex-col gap-6 p-6" onSubmit={handleSubmit}>
          {/* Introduction selon le mode */}
          {mode !== 'all' && (
            <div className="bg-gray-50 p-4 rounded-lg mb-2">
              {mode === 'phone' && (
                <p className="text-sm text-gray-600">
                  Pour vérifier votre numéro de téléphone, veuillez confirmer ou modifier le numéro ci-dessous. 
                  Une fois validé, ce numéro sera utilisé pour vos communications importantes.
                </p>
              )}
              {mode === 'email' && (
                <p className="text-sm text-gray-600">
                  Pour vérifier votre adresse email, veuillez confirmer ou modifier l'adresse ci-dessous. 
                  Cette adresse sera utilisée pour vos notifications et communications importantes.
                </p>
              )}
              {mode === 'id' && (
                <p className="text-sm text-gray-600">
                  Pour enregistrer votre pièce d'identité, veuillez sélectionner un document valide. 
                  Format accepté : PDF, JPG, PNG. Taille maximale : 5MB.
                </p>
              )}
            </div>
          )}

          {/* Profile Image Upload - Only in 'all' mode */}
          {mode === "all" && (
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={profileImage}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <label
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50"
                >
                  <Pencil size={16} className="text-gray-600" />
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageChange}
                  />
                </label>
              </div>
              {isProfileVerified && (
                <span className="flex items-center gap-1 text-green-600 text-xs font-normal">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8 15.5513C8.98491 15.5513 9.96018 15.3573 10.8701 14.9804C11.7801 14.6035 12.6069 14.051 13.3033 13.3546C13.9997 12.6581 14.5522 11.8313 14.9291 10.9214C15.306 10.0115 15.5 9.03618 15.5 8.05127C15.5 7.06636 15.306 6.09109 14.9291 5.18114C14.5522 4.2712 13.9997 3.44441 13.3033 2.74797C12.6069 2.05153 11.7801 1.49908 10.8701 1.12217C9.96018 0.745263 8.98491 0.55127 8 0.55127C6.01088 0.55127 4.10322 1.34145 2.6967 2.74797C1.29018 4.15449 0.5 6.06215 0.5 8.05127C0.5 10.0404 1.29018 11.948 2.6967 13.3546C4.10322 14.7611 6.01088 15.5513 8 15.5513ZM7.80667 11.0846L11.9733 6.0846L10.6933 5.01794L7.11 9.3171L5.25583 7.4621L4.0775 8.64044L6.5775 11.1404L7.2225 11.7854L7.80667 11.0846Z" fill="#2DAE9F"/>
                  </svg>
                  Profil vérifié
                </span>
              )}
            </div>
          )}

          {/* Name Fields - Only in 'all' mode */}
          {mode === "all" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="firstname" className="text-sm font-semibold flex items-center gap-2">
                  Prénom <span className="text-primary">*</span>
                  {isProfileVerified && (
                    <span className="flex items-center gap-1 text-green-600 text-xs font-normal">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8 15.5513C8.98491 15.5513 9.96018 15.3573 10.8701 14.9804C11.7801 14.6035 12.6069 14.051 13.3033 13.3546C13.9997 12.6581 14.5522 11.8313 14.9291 10.9214C15.306 10.0115 15.5 9.03618 15.5 8.05127C15.5 7.06636 15.306 6.09109 14.9291 5.18114C14.5522 4.2712 13.9997 3.44441 13.3033 2.74797C12.6069 2.05153 11.7801 1.49908 10.8701 1.12217C9.96018 0.745263 8.98491 0.55127 8 0.55127C6.01088 0.55127 4.10322 1.34145 2.6967 2.74797C1.29018 4.15449 0.5 6.06215 0.5 8.05127C0.5 10.0404 1.29018 11.948 2.6967 13.3546C4.10322 14.7611 6.01088 15.5513 8 15.5513ZM7.80667 11.0846L11.9733 6.0846L10.6933 5.01794L7.11 9.3171L5.25583 7.4621L4.0775 8.64044L6.5775 11.1404L7.2225 11.7854L7.80667 11.0846Z" fill="#2DAE9F"/>
                      </svg>
                    </span>
                  )}
                </label>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  value={formValues.firstname}
                  onChange={handleInputChange}
                  className="w-full border border-[#EDEDED] rounded-lg p-3"
                  placeholder="Votre prénom"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="lastname" className="text-sm font-semibold flex items-center gap-2">
                  Nom <span className="text-primary">*</span>
                  {isProfileVerified && (
                    <span className="flex items-center gap-1 text-green-600 text-xs font-normal">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8 15.5513C8.98491 15.5513 9.96018 15.3573 10.8701 14.9804C11.7801 14.6035 12.6069 14.051 13.3033 13.3546C13.9997 12.6581 14.5522 11.8313 14.9291 10.9214C15.306 10.0115 15.5 9.03618 15.5 8.05127C15.5 7.06636 15.306 6.09109 14.9291 5.18114C14.5522 4.2712 13.9997 3.44441 13.3033 2.74797C12.6069 2.05153 11.7801 1.49908 10.8701 1.12217C9.96018 0.745263 8.98491 0.55127 8 0.55127C6.01088 0.55127 4.10322 1.34145 2.6967 2.74797C1.29018 4.15449 0.5 6.06215 0.5 8.05127C0.5 10.0404 1.29018 11.948 2.6967 13.3546C4.10322 14.7611 6.01088 15.5513 8 15.5513ZM7.80667 11.0846L11.9733 6.0846L10.6933 5.01794L7.11 9.3171L5.25583 7.4621L4.0775 8.64044L6.5775 11.1404L7.2225 11.7854L7.80667 11.0846Z" fill="#2DAE9F"/>
                      </svg>
                    </span>
                  )}
                </label>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  value={formValues.lastname}
                  onChange={handleInputChange}
                  className="w-full border border-[#EDEDED] rounded-lg p-3"
                  placeholder="Votre nom"
                />
              </div>
            </div>
          )}

          {(mode === "all" || mode === "phone") && (
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2">
                N° téléphone
                {isPhoneVerified ? (
                  <span className="flex items-center gap-1 text-green-600 text-xs font-normal">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8 15.5513C8.98491 15.5513 9.96018 15.3573 10.8701 14.9804C11.7801 14.6035 12.6069 14.051 13.3033 13.3546C13.9997 12.6581 14.5522 11.8313 14.9291 10.9214C15.306 10.0115 15.5 9.03618 15.5 8.05127C15.5 7.06636 15.306 6.09109 14.9291 5.18114C14.5522 4.2712 13.9997 3.44441 13.3033 2.74797C12.6069 2.05153 11.7801 1.49908 10.8701 1.12217C9.96018 0.745263 8.98491 0.55127 8 0.55127C6.01088 0.55127 4.10322 1.34145 2.6967 2.74797C1.29018 4.15449 0.5 6.06215 0.5 8.05127C0.5 10.0404 1.29018 11.948 2.6967 13.3546C4.10322 14.7611 6.01088 15.5513 8 15.5513ZM7.80667 11.0846L11.9733 6.0846L10.6933 5.01794L7.11 9.3171L5.25583 7.4621L4.0775 8.64044L6.5775 11.1404L7.2225 11.7854L7.80667 11.0846Z" fill="#2DAE9F"/>
                    </svg>
                    Vérifier
                  </span>
                ) : mode === 'all' && (
                  <button
                    type="button"
                    onClick={() => handleModeChange("phone")}
                    className="flex items-center gap-1 text-red-500 text-xs font-normal hover:underline"
                  >
                    Non vérifié
                  </button>
                )}
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formValues.phone}
                onChange={handleInputChange}
                className="w-full border border-[#EDEDED] rounded-lg p-3"
                placeholder="Votre numéro de téléphone"
              />
            </div>
          )}
          {(mode === "all" || mode === "email") && (
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                Email
                {isEmailVerified ? (
                  <span className="flex items-center gap-1 text-green-600 text-xs font-normal">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8 15.5513C8.98491 15.5513 9.96018 15.3573 10.8701 14.9804C11.7801 14.6035 12.6069 14.051 13.3033 13.3546C13.9997 12.6581 14.5522 11.8313 14.9291 10.9214C15.306 10.0115 15.5 9.03618 15.5 8.05127C15.5 7.06636 15.306 6.09109 14.9291 5.18114C14.5522 4.2712 13.9997 3.44441 13.3033 2.74797C12.6069 2.05153 11.7801 1.49908 10.8701 1.12217C9.96018 0.745263 8.98491 0.55127 8 0.55127C6.01088 0.55127 4.10322 1.34145 2.6967 2.74797C1.29018 4.15449 0.5 6.06215 0.5 8.05127C0.5 10.0404 1.29018 11.948 2.6967 13.3546C4.10322 14.7611 6.01088 15.5513 8 15.5513ZM7.80667 11.0846L11.9733 6.0846L10.6933 5.01794L7.11 9.3171L5.25583 7.4621L4.0775 8.64044L6.5775 11.1404L7.2225 11.7854L7.80667 11.0846Z" fill="#2DAE9F"/>
                    </svg>
                    Vérifier
                  </span>
                ) : mode === 'all' && (
                  <button
                    type="button"
                    onClick={() => handleModeChange("email")}
                    className="flex items-center gap-1 text-red-500 text-xs font-normal hover:underline"
                  >
                    Non vérifié
                  </button>
                )}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleInputChange}
                className="w-full border border-[#EDEDED] rounded-lg p-3"
                placeholder="Votre email"
              />
            </div>
          )}
          {(mode === "all" || mode === "id") && (
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="idFile" className="text-sm font-semibold flex items-center gap-2">
                Pièce de l'utilisateur {mode === 'id' && <span className="text-primary">*</span>}
                {isIdUploaded ? (
                  <span className="flex items-center gap-1 text-green-600 text-xs font-normal">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8 15.5513C8.98491 15.5513 9.96018 15.3573 10.8701 14.9804C11.7801 14.6035 12.6069 14.051 13.3033 13.3546C13.9997 12.6581 14.5522 11.8313 14.9291 10.9214C15.306 10.0115 15.5 9.03618 15.5 8.05127C15.5 7.06636 15.306 6.09109 14.9291 5.18114C14.5522 4.2712 13.9997 3.44441 13.3033 2.74797C12.6069 2.05153 11.7801 1.49908 10.8701 1.12217C9.96018 0.745263 8.98491 0.55127 8 0.55127C6.01088 0.55127 4.10322 1.34145 2.6967 2.74797C1.29018 4.15449 0.5 6.06215 0.5 8.05127C0.5 10.0404 1.29018 11.948 2.6967 13.3546C4.10322 14.7611 6.01088 15.5513 8 15.5513ZM7.80667 11.0846L11.9733 6.0846L10.6933 5.01794L7.11 9.3171L5.25583 7.4621L4.0775 8.64044L6.5775 11.1404L7.2225 11.7854L7.80667 11.0846Z" fill="#2DAE9F"/>
                    </svg>
                    Vérifier
                  </span>
                ) : mode === 'all' && (
                  <button
                    type="button"
                    onClick={() => handleModeChange("id")}
                    className="flex items-center gap-1 text-red-500 text-xs font-normal hover:underline"
                  >
                    Non vérifié
                  </button>
                )}
              </label>
              {/* Utilisation de l'input custom avec le bon callback */}
              <InputTypePiece 
                initialImage={pieceImage} 
                initialType={pieceType} 
                onChange={handlePieceChange}
                required={mode === 'id'} 
              />
            </div>
          )}
          <button 
            type="submit" 
            className="bg-primary text-white rounded-lg px-4 py-3 font-semibold mt-4"
            disabled={isSubmitDisabled}
            style={isSubmitDisabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            {mode === 'all' ? 'Modifier' : 'Vérifier'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountEditSheet; 