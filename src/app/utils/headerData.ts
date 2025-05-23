// headerData.ts

import { AssistanceIcon, SimulateurIcon } from "../components/Icons";
import InfoUtile from "../components/icons/infoUtiles";

export const TAB_CONTENT = {
  particulier: [
    {
      title: "Besoin d'assistance?",
      icon: AssistanceIcon,
      links: [
        { href: "/depannage", label: "Pour un dépannage" },
        { href: "/reclamation", label: "Pour faire une réclamation" },
        { href: "/incident", label: "Pour signaler un incident" },
      ],
      isFirst: true,
    },
    {
      title: "Simulateurs",
      icon: SimulateurIcon,
      links: [
        { href: "/simulateur-facture", label: "Simulateur de facture" },
        { href: "/simulateur-puissance", label: "Simulateur de puissance" },
      ],
    },
    {
      title: "Informations utiles",
      icon: InfoUtile,
      links: [
        { href: "/bon-a-savoir", label: "Bon à savoir" },
        { href: "/tarifs", label: "Tarifs" },
        { href: "/avance", label: "Avance sur consommation" },
        { href: "/risques-electriques", label: "Risques électriques" },
      ],
      isFirst: false,
    },
  ],

  business: [
    {
      title: "Besoin d'assistance?",
      icon: AssistanceIcon,
      links: [
        { href: "/depannage", label: "Pour un dépannage" },
        { href: "/incident", label: "Pour signaler un incident" },
        { href: "/reclamation", label: "Pour faire une réclamation" },
      ],
      isFirst: true,
    },
    {
      title: "Efficacité énergétique",
      icon: SimulateurIcon,
      links: [
        { href: "/audit-conso", label: "Audit de consommation électrique" },
        { href: "/solution", label: "Solutions d’efficacité énergétique" },
        {
          href: "/transition-energetique",
          label: "Accompagnement à la transition énergétique",
        },
        { href: "/travaux-installation", label: "Travaux et installation" },
        { href: "/froid-ventilation", label: "Froid et ventilation" },
      ],
    },
    {
      title: "Demandes à la carte",
      icon: AssistanceIcon,
      links: [
        { href: "/entretien-transfo", label: "Entretien transformateur" },
        { href: "/audit-eco", label: "Audit efficacité énergétique" },
        { href: "/location-groupe", label: "Location groupe électrogène" },
        { href: "/rdv", label: "Prise de rendez‑vous" },
        { href: "/formation", label: "Formation" },
      ],
    },
    {
      title: "Informations utiles",
      icon: InfoUtile,
      links: [
        { href: "/bon-a-savoir", label: "Bon à savoir" },
        { href: "/tarifs", label: "Tarifs" },
        { href: "/avance", label: "Avance sur consommation" },
        { href: "/risques-electriques", label: "Risques électriques" },
      ],
    },
  ],

  institution: [
    {
      title: "Besoin d'assistance?",
      icon: AssistanceIcon,
      links: [
        { href: "/depannage", label: "Pour un dépannage" },
        { href: "/incident", label: "Pour signaler un incident" },
        { href: "/reclamation", label: "Pour faire une réclamation" },
      ],
      isFirst: true,
    },
    {
      title: "Informations utiles",
      icon: InfoUtile,
      links: [
        { href: "/bon-a-savoir", label: "Bon à savoir" },
        { href: "/tarifs", label: "Tarifs" },
        { href: "/risques-electriques", label: "Risques électriques" },
      ],
    },
    {
      title: "Demandes à la carte",
      icon: AssistanceIcon,
      links: [
        { href: "/entretien-transfo", label: "Entretien transformateur" },
        { href: "/audit-eco", label: "Audit efficacité énergétique" },
        { href: "/location-groupe", label: "Location groupe électrogène" },
        { href: "/rdv", label: "Prise de rendez‑vous" },
        { href: "/formation", label: "Formation" },
      ],
    },
  ],
} as const;
