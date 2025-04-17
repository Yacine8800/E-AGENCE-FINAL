import React, { Fragment, useRef, CSSProperties } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"; // Taille de la modale
  hasCloseBtn?: boolean; // Afficher ou non le bouton de fermeture
  scrollbarWidth?: string; // Style pour les barres de défilement
  className?: string; // Classes CSS supplémentaires
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  hasCloseBtn = true,
  scrollbarWidth,
  className = "",
}: ModalProps) {
  const cancelButtonRef = useRef(null);
  
  // Déterminer la classe de taille maximale en fonction de la prop size
  const sizeClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
    full: "sm:max-w-[90%] sm:h-[90%]"
  };
  
  const maxWidthClass = sizeClasses[size] || sizeClasses.md;
  
  // Création des styles CSS avec typage correct
  const modalStyles: CSSProperties = {};
  if (scrollbarWidth) {
    // Appliquer comme propriété CSS personnalisée
    modalStyles.WebkitOverflowScrolling = 'touch';
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-8 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-8 scale-95"
            >
              <Dialog.Panel 
                className={`relative transform overflow-hidden rounded-2xl bg-white p-5 sm:p-6 text-left shadow-xl transition-all sm:my-8 sm:w-full ${maxWidthClass} border border-gray-100 ${className} ${scrollbarWidth === 'none' ? 'scrollbar-hide' : ''}`}
                style={modalStyles}
              >
                {hasCloseBtn && (
                  <div className="absolute right-4 top-4">
                    <button
                      type="button"
                      className="rounded-full bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
                      onClick={onClose}
                    >
                      <span className="sr-only">Fermer</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                <div>
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6 text-gray-900 mb-5 pt-2"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-2">{children}</div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
