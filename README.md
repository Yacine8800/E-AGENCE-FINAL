# E-AGENCE

![Next.js](https://img.shields.io/badge/Next.js-15.2.0-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?logo=tailwind-css)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

Une application moderne développée avec Next.js pour offrir des services d'agence numérique innovants.

## Table des matières

- [Aperçu](#aperçu)
- [Technologies](#technologies)
- [Installation](#installation)
  - [Prérequis](#prérequis)
  - [Installation standard](#installation-standard)
  - [Installation avec Docker](#installation-avec-docker)
- [Structure du projet](#structure-du-projet)
- [Utilisation](#utilisation)
- [Déploiement](#déploiement)
- [Docker](#docker)

## Aperçu

E-AGENCE est une application web moderne qui utilise les dernières technologies pour offrir une expérience utilisateur optimale. Cette plateforme a été conçue pour faciliter la gestion des services d'agence numérique et améliorer l'interaction avec les clients.

## Technologies

- **Frontend**: Next.js 15.2.0, React 19.0.0, TypeScript
- **Styles**: TailwindCSS 3.4.1, Framer Motion
- **État**: Redux Toolkit
- **Services**: Firebase, MQTT
- **Autres**: Axios, UUID, Zod pour la validation

## Installation

### Prérequis

- Node.js 18 ou supérieur
- Yarn (recommandé) ou npm
- Docker (optionnel, pour l'installation containerisée)

### Installation standard

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/votre-nom/e-agence.git
   cd e-agence
   ```

2. Installez les dépendances :

   ```bash
   yarn install
   ```

3. Démarrez le serveur de développement :

   ```bash
   yarn dev
   ```

4. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir l'application.

### Installation avec Docker

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/votre-nom/e-agence.git
   cd e-agence
   ```

2. Construisez et démarrez le conteneur Docker :

   ```bash
   docker build -t e-agence .
   docker run -p 3000:3000 e-agence
   ```

3. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir l'application.

## Structure du projet

```
e-agence/
├── src/                 # Code source principal
│   ├── app/             # Composants d'application
│   │   ├── components/  # Composants réutilisables
│   │   └── ...         # Autres dossiers d'application
├── public/              # Fichiers statiques
├── package.json         # Dépendances et scripts
├── tailwind.config.js   # Configuration TailwindCSS
├── tsconfig.json        # Configuration TypeScript
└── dockerfile           # Configuration Docker
```

## Utilisation

- Modifiez les fichiers dans le dossier `src/app` pour personnaliser l'application
- Les modifications sont automatiquement appliquées en temps réel pendant le développement
- Utilisez `yarn build` pour créer une version de production optimisée

## Déploiement

L'application peut être déployée sur diverses plateformes:

- **Vercel** (recommandé pour Next.js): Configuration automatique via GitHub
- **Docker**: Utilisez le Dockerfile fourni
- **Serveur traditionnel**: Exécutez `yarn build` puis `yarn start`

## Docker

Le projet inclut un Dockerfile multi-étapes optimisé:

### Stage 1: Construction

- Utilise Node.js 18 Alpine comme image de base
- Installe toutes les dépendances nécessaires
- Construit l'application Next.js

### Stage 2: Production

- Crée une image légère avec Node.js 18 Alpine
- Copie uniquement les fichiers nécessaires à l'exécution
- Configure l'environnement de production
- Expose le port 3000 pour accéder à l'application

Pour personnaliser la configuration Docker:

- Modifiez le fichier `dockerfile` selon vos besoins
- Ajustez les variables d'environnement dans le Dockerfile ou lors de l'exécution

---

## 👥 Contact

Pour toute question ou suggestion, veuillez contacter l'équipe de développement **DCTD**.

---
