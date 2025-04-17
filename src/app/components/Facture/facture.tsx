import React, { useState } from "react";

interface FacturesProps {
  lastInvoice?: {
    dateFacture: string;
    dateLimite: string;
    solde: number;
    montantTotalARegler: number;
    montpaye: number;
    datregl: string;
    libelleExploitation: string;
    reglageDisja: string;
    numeroFacV2: string;
    dateDebutConso: string;
    dateFinConso: string;
  };
  isLoading?: boolean;
}

// Interface pour les factures formatées
interface FormattedInvoice {
  id: string;
  mois: string;
  montant: string;
  consommation: string;
  isPaid: boolean;
  dateFacture: string;
  dateLimite: string;
  // Ajout des champs supplémentaires pour la modale
  montantOriginal: number;
  solde: number;
  montantPaye: number;
  dateReglement: string;
  libelleExploitation: string;
}

export default function Factures({ lastInvoice, isLoading = false }: FacturesProps) {
  // État pour gérer la modale
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<FormattedInvoice | null>(null);

  // Transforme la dernière facture en format affiché
  const formatInvoiceData = () => {
    if (lastInvoice) {
      // Formater la date pour en extraire le mois et année
      const dateOptions = { month: 'long', year: 'numeric' } as const;
      const mois = new Date(lastInvoice.dateFacture).toLocaleDateString('fr-FR', dateOptions);

      // Transformer les dates de début et fin de consommation
      const dateDebut = new Date(lastInvoice.dateDebutConso).toLocaleDateString('fr-FR');
      const dateFin = new Date(lastInvoice.dateFinConso).toLocaleDateString('fr-FR');

      return [
        {
          id: lastInvoice.numeroFacV2,
          mois: mois.charAt(0).toUpperCase() + mois.slice(1), // Capitalize
          montant: `${lastInvoice.montantTotalARegler.toLocaleString('fr-FR')} FCFA`,
          consommation: `${dateDebut} - ${dateFin}`,
          isPaid: lastInvoice.montpaye > 0,
          dateFacture: new Date(lastInvoice.dateFacture).toLocaleDateString('fr-FR'),
          dateLimite: new Date(lastInvoice.dateLimite).toLocaleDateString('fr-FR'),
          // Champs supplémentaires pour la modale
          montantOriginal: lastInvoice.montantTotalARegler,
          solde: lastInvoice.solde,
          montantPaye: lastInvoice.montpaye,
          dateReglement: lastInvoice.datregl ? new Date(lastInvoice.datregl).toLocaleDateString('fr-FR') : '',
          libelleExploitation: lastInvoice.libelleExploitation
        }
      ];
    }

    // Si pas de facture, retourner un tableau vide
    return [];
  };

  // Utiliser les données de l'API ou des données vides
  const facturesData = lastInvoice ? formatInvoiceData() : [];

  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Nombre de factures par page

  // Calcul du nombre total de pages
  const totalPages = Math.ceil(facturesData.length / itemsPerPage);

  // Indices de début et de fin pour la page courante
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Factures à afficher sur la page courante
  const currentFactures = facturesData.slice(startIndex, endIndex);

  // Gestion des changements de page
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Fonction pour ouvrir la modale avec les détails de la facture
  const openInvoiceModal = (facture: FormattedInvoice) => {
    setSelectedInvoice(facture);
    setIsModalOpen(true);
  };

  // Fonction pour fermer la modale
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 p-8">
        <div className="flex flex-col items-center justify-center h-40">
          <div className="w-10 h-10 border-t-4 border-orange-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Chargement des factures...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 mt-5">
        {/* En-tête */}
        <div className="p-4 flex justify-between items-center">
          <p className="text-base font-semibold text-gray-700">Mes factures</p>

          {/* Filtres et recherche */}
          <div className="flex items-center space-x-3">
            {/* Filtre de période */}
            <div className="relative">
              <select
                className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-orange-300 focus:border-orange-300"
                defaultValue={lastInvoice ? new Date(lastInvoice.dateFacture).getFullYear().toString() : ""}
              >
                <option value={lastInvoice ? new Date(lastInvoice.dateFacture).getFullYear().toString() : ""}>
                  {lastInvoice ? new Date(lastInvoice.dateFacture).getFullYear() : ""}
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            {/* Barre de recherche */}
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 pl-8 rounded-lg text-xs w-32 focus:outline-none focus:ring-1 focus:ring-orange-300 focus:border-orange-300 focus:w-40 transition-all duration-300"
              />
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Grille de factures (limitée par pagination) */}
        {facturesData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3 px-4 pb-4">
            {currentFactures.map((facture) => (
              <div
                key={facture.id}
                className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer bg-white border border-gray-100"
                onClick={() => openInvoiceModal(facture)}
              >
                <div className="p-3">
                  <div className="flex items-start">
                    <div className="text-primary mr-2 flex-shrink-0">
                      {/* Icône de facture */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-xs font-semibold text-gray-800">
                          {facture.mois}
                        </h4>
                        {facture.isPaid ? (
                          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                            Payée
                          </span>
                        ) : (
                          <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">
                            Impayée
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#FF6B00]">
                          {facture.montant}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {facture.consommation}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1">
                        Date limite : {facture.dateLimite}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">Aucune facture disponible</p>
          </div>
        )}

        {/* Boutons de pagination - affichés uniquement s'il y a plusieurs pages */}
        {totalPages > 1 && (
          <div className="px-4 pb-4 flex items-center justify-end space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="bg-gray-100 text-gray-600 py-1 px-3 text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="bg-gray-100 text-gray-600 py-1 px-3 text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        )}
      </div>

      {/* Modale de détails de facture */}
      {isModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden"
            style={{ maxHeight: '90vh' }}
          >
            {/* Header fixe avec stepper */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-100 via-orange-50 to-white border-b border-orange-100 p-5 rounded-t-xl z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#FF6B00] flex items-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mr-2 text-[#FF6B00]" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14.5 4.5V6.5C14.5 7.6 15.4 8.5 16.5 8.5H18.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 13H12" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 17H16" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Détails de la facture
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none bg-orange-50 hover:bg-orange-100 p-2 rounded-full transition-all duration-200"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex justify-center">
                <div className="px-8 py-2.5 bg-gradient-to-r from-orange-500 to-[#FF6B00] text-noir rounded-full text-sm font-semibold shadow-md">
                  {selectedInvoice.mois}
                </div>
              </div>
            </div>

            {/* Contenu défilable */}
            <div
              className="p-6 overflow-y-auto bg-gradient-to-b from-white to-orange-50"
              style={{
                maxHeight: 'calc(90vh - 180px)',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              <div className="space-y-6">
                {/* Section principale */}
                <div className="bg-gradient-to-r from-orange-100 to-orange-50 p-5 rounded-xl shadow-sm border border-orange-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Montant total</p>
                      <p className="text-xl font-bold text-[#FF6B00]">
                        {selectedInvoice.montantOriginal.toLocaleString('fr-FR')} <span className="text-sm font-medium">FCFA</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Statut</p>
                      <div className={`flex items-center mt-1 ${selectedInvoice.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${selectedInvoice.isPaid ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                        <p className="text-lg font-bold">
                          {selectedInvoice.isPaid ? 'Payée' : 'Impayée'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Détails de la facture */}
                <div className="space-y-4 bg-white p-5 rounded-xl border border-orange-100 shadow-sm">
                  <h4 className="text-sm font-bold text-[#FF6B00] flex items-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mr-2 text-[#FF6B00]" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3.5 9.09H20.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Informations de la facture
                  </h4>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-gradient-to-br from-orange-50 to-white rounded-lg border border-orange-100">
                      <p className="text-xs text-gray-600 mb-1">Numéro de facture</p>
                      <p className="text-sm font-semibold text-gray-800">{selectedInvoice.id}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-orange-50 to-white rounded-lg border border-orange-100 md:col-span-2">
                      <p className="text-xs text-gray-600 mb-1">Période de consommation</p>
                      <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">{selectedInvoice.consommation}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-orange-50 to-white rounded-lg border border-orange-100">
                      <p className="text-xs text-gray-600 mb-1">Date d'émission</p>
                      <p className="text-sm font-semibold text-gray-800">{selectedInvoice.dateFacture}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-orange-50 to-white rounded-lg border border-orange-100 md:col-span-2">
                      <p className="text-xs text-gray-600 mb-1">Date limite de paiement</p>
                      <p className="text-sm font-semibold text-gray-800">{selectedInvoice.dateLimite}</p>
                    </div>
                  </div>
                </div>

                {/* Détails de paiement si facture payée */}
                {selectedInvoice.isPaid && (
                  <div className="space-y-4 bg-white p-5 rounded-xl border border-green-100 shadow-sm">
                    <h4 className="text-sm font-bold text-green-600 flex items-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mr-2 text-green-500" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.5 13.75C9.5 14.72 10.25 15.5 11.17 15.5H13.05C13.85 15.5 14.5 14.82 14.5 13.97C14.5 13.06 14.1 12.73 13.51 12.52L10.5 11.47C9.91 11.26 9.51 10.94 9.51 10.02C9.51 9.18 10.16 8.49 10.96 8.49H12.84C13.76 8.49 14.51 9.27 14.51 10.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 7.5V16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17 3V7H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M22 2L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Détails du paiement
                    </h4>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-100">
                        <p className="text-xs text-gray-600 mb-1">Montant payé</p>
                        <p className="text-sm font-semibold text-green-700">{selectedInvoice.montantPaye.toLocaleString('fr-FR')} FCFA</p>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-100">
                        <p className="text-xs text-gray-600 mb-1">Date de règlement</p>
                        <p className="text-sm font-semibold text-green-700">{selectedInvoice.dateReglement || 'Non disponible'}</p>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-100">
                        <p className="text-xs text-gray-600 mb-1">Solde</p>
                        <p className="text-sm font-semibold text-green-700">{selectedInvoice.solde.toLocaleString('fr-FR')} FCFA</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Informations du contrat */}
                <div className="space-y-3 bg-white p-5 rounded-xl border border-orange-100 shadow-sm">
                  <h4 className="text-sm font-bold text-[#FF6B00] flex items-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mr-2 text-[#FF6B00]" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 8.5V13.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3 8.5V17C3 20 4.5 22 8 22H12" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3 8.5H21" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M18 17C18 17.75 18.21 18.46 18.58 19.06C18.79 19.42 19.06 19.74 19.37 20C20.02 20.63 20.95 21 22 21C22.55 21 23.08 20.88 23.56 20.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Informations du contrat
                  </h4>
                  <div className="p-3 bg-gradient-to-br from-orange-50 to-white rounded-lg border border-orange-100">
                    <p className="text-xs text-gray-600 mb-1">Libellé d'exploitation</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedInvoice.libelleExploitation || 'Non disponible'}</p>
                  </div>
                </div>

                {/* Conseils et informations supplémentaires */}
                <div className="bg-[#FF6B00] bg-opacity-10 p-4 rounded-xl shadow-sm border border-[#FF6B00] border-opacity-20">
                  <div className="flex items-start">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mr-3 mt-0.5 text-[#FF6B00]" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 8V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M11.9944 16H12.0034" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">Conseil :</span> Vous pouvez régler vos factures via notre application, dans un centre de paiement agréé, ou par Mobile Money en contactant le service client CIE.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer avec boutons */}
            <div className="sticky bottom-0 bg-white border-t border-[#FF6B00] p-5 rounded-b-xl">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    // Fonction pour simuler l'impression
                    window.print();
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-[#FF6B00] to-[#FF6B00] text-white rounded-xl hover:shadow-md transition-all duration-200 font-medium flex items-center justify-center"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mr-2" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.25 7h9.5V5c0-2-1.5-3-3-3h-3.5c-1.5 0-3 1-3 3v2zM16.75 15H7.25v4c0 1.66 1.34 3 3 3h3.5c1.66 0 3-1.34 3-3v-4z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6 18V15M18 18V15M17.82 7H6.18C3.68 7 2.5 8.01 2.5 10.83v4.17h19v-4.17C21.5 8.01 20.32 7 17.82 7z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Imprimer
                </button>

                <button
                  onClick={closeModal}
                  className="w-full py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:shadow-md transition-all duration-200 font-medium flex items-center justify-center"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mr-2" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 15l6-6M15 15L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Fermer
                </button>


              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
