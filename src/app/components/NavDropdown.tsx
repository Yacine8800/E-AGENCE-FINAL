"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface NavDropdownProps {
  isOpen: boolean;
  hasScrolled: boolean;
}

const NavDropdown = ({ isOpen, hasScrolled }: NavDropdownProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`absolute top-full left-0 w-full bg-white shadow-lg mt-5 rounded-b-xl overflow-hidden transition-all duration-300 ${
            hasScrolled ? "px-0" : "px-[80px]"
          }`}
        >
          <div className="container mx-auto py-8">
            <div className="grid grid-cols-4 gap-12">
              <div>
                <h3 className="text-noir font-bold mb-6">
                  Besoin d&apos;assistance?
                </h3>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/depannage"
                      className="text-noir hover:text-orange s transition duration-700 ease-in-out"
                    >
                      Pour un dépannage
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/incident"
                      className="text-noir hover:text-orange transition-colors"
                    >
                      Pour signaler un incident
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/reclamation"
                      className="text-noir hover:text-orange transition-colors"
                    >
                      Pour faire une réclamation
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-[#666666] font-medium mb-6">Simulateurs</h3>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/simulateur-facture"
                      className="text-noir hover:text-orange transition-colors"
                    >
                      Simulateur de facture
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/simulateur-puissance"
                      className="text-noir hover:text-orange transition-colors"
                    >
                      Simulateur de puissance
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-[#666666] font-medium mb-6">
                  Informations utiles
                </h3>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/bon-a-savoir"
                      className="text-noir hover:text-orange transition-colors"
                    >
                      Bon à savoir
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tarifs"
                      className="text-noir hover:text-orange transition-colors"
                    >
                      Tarifs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/risques-electriques"
                      className="text-noir hover:text-orange transition-colors"
                    >
                      Risques électriques
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-noir font-medium mb-6">
                  Demandes à la carte
                </h3>
                <ul className="space-y-4">
                  <li>
                    <Link
                      href="/entretien-transformateur"
                      className="text-noir hover:text-orange transition-colors"
                    >
                      Entretien transformateur
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/audit-efficacite"
                      className="text-noir hover:text-orange transition-colors"
                    >
                      Audit efficacité énergétique
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/location-groupe"
                      className="text-noir hover:text-orange transition-colors"
                    >
                      Location groupe électrogène
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/rendez-vous"
                      className="text-noir hover:text-orange transition-colors"
                    >
                      Prise de rendez-vous
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/formation"
                      className="text-noir hover:text-orange transition-colors"
                    >
                      Formation
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavDropdown;
