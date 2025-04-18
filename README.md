# E-AGENCE

Application de gestion d'agence avec notifications en temps réel basée sur Next.js.

## Table des matières

- [Présentation](#présentation)
- [Installation locale](#installation-locale)
- [Configuration](#configuration)
- [Déploiement avec Docker](#déploiement-avec-docker)
- [Fonctionnalités](#fonctionnalités)
- [Structure du projet](#structure-du-projet)

## Présentation

E-AGENCE est une application conçue pour la gestion d'agence avec des fonctionnalités de notifications en temps réel via Firebase. L'application est développée avec Next.js, React et Tailwind CSS.

## Installation locale

### Prérequis

- Node.js 18 ou supérieur
- Yarn

### Étapes d'installation

1. Cloner le dépôt

   ```bash
   git clone [url-du-dépôt]
   cd E-AGENCE-FINAL
   ```

2. Installer les dépendances

   ```bash
   yarn install
   ```

3. Configurer les variables d'environnement

   - Copier le fichier `.env.example` (si disponible) vers `.env`
   - Remplir les variables d'environnement nécessaires (voir la section [Configuration](#configuration))

4. Démarrer l'application en mode développement

   ```bash
   yarn dev
   ```

5. Construire l'application pour la production

   ```bash
   yarn build
   ```

6. Démarrer l'application en mode production
   ```bash
   yarn start
   ```

## Configuration

L'application utilise plusieurs variables d'environnement pour la configuration. Voici les principales:

### Firebase Configuration

```
NEXT_PUBLIC_API_KEY=votre-api-key
NEXT_PUBLIC_API_AUTH_DOMAIN=votre-auth-domain
NEXT_PUBLIC_API_PROJECTID=votre-project-id
NEXT_PUBLIC_API_STORAGE_BUCKET=votre-storage-bucket
NEXT_PUBLIC_API_MESSAGING_SENDER_ID=votre-messaging-sender-id
NEXT_PUBLIC_API_APP_ID=votre-app-id
NEXT_PUBLIC_API_MEASUREMENT_ID=votre-measurement-id
NEXT_PUBLIC_API_VAPID_KEY=votre-vapid-key
```

### API Configuration

```
NEXT_PUBLIC_API_URL=url-de-votre-api
```

### Autres configurations

```
NEXT_PUBLIC_API_BOT_CIE=url-du-bot
NEXT_PUBLIC_API_BOT_CIE_WEBHOOK=url-du-webhook
NEXT_PUBLIC_API_BOT_CIE_BROKER=url-du-broker-mqtt
```

## Déploiement avec Docker

### Utilisation du Dockerfile

Le projet inclut un Dockerfile optimisé pour la production avec une construction multi-étapes:

1. **Étape de construction**: Installe les dépendances et construit l'application
2. **Étape de production**: Crée une image légère contenant seulement les fichiers nécessaires

Pour construire l'image Docker:

```bash
docker build -t e-agence:(la version) .
```

Pour exécuter le conteneur:

```bash
docker run -p 2707:2707 -e NODE_ENV=production e-agence:(la version)
```

### Utilisation de Docker Compose

Le projet inclut également un fichier `docker-compose.yml` pour simplifier le déploiement:

1. Démarrer l'application:

   ```bash
   docker-compose up -d
   ```

2. Visualiser les logs:

   ```bash
   docker-compose logs -f
   ```

3. Arrêter l'application:
   ```bash
   docker-compose down
   ```

### Configuration avec Docker

La variable d'environnement PORT est configurée à 2707 par défaut dans le Dockerfile.

Vous pouvez monter votre fichier `.env` comme volume:

```bash
docker run -p 2707:2707 -v $(pwd)/.env:/app/.env e-agence:latest
```

Ou utiliser le volume configuré dans docker-compose.yml:

```yaml
volumes:
  - ./.env:/app/.env
```

## Fonctionnalités

- **Notifications en temps réel**: Intégration avec Firebase Cloud Messaging
- **Interface utilisateur moderne**: Utilisation de Tailwind CSS et Framer Motion
- **Compatibilité multi-navigateurs**: Support pour les navigateurs modernes, y compris Safari

## Structure du projet

```
E-AGENCE-FINAL/
├── public/                   # Fichiers statiques
│   └── firebase-messaging-sw.js  # Service Worker pour Firebase Messaging
├── src/
│   ├── app/                  # Application Next.js (App Router)
│   ├── components/           # Composants React
│   ├── config/               # Fichiers de configuration
│   └── firebase/             # Configuration Firebase
├── .env                      # Variables d'environnement
├── Dockerfile                # Configuration Docker
├── docker-compose.yml        # Configuration Docker Compose
└── package.json              # Dépendances et scripts
```

## Note sur les notifications Firebase

L'application utilise Firebase Cloud Messaging pour les notifications push. Le Service Worker est configuré pour fonctionner avec les navigateurs supportant l'API Push, avec une solution de secours pour Safari.

Pour tester les notifications:

1. Accepter les permissions de notification dans le navigateur
2. Vérifier que le token est correctement généré dans la console
3. Utiliser la console Firebase pour envoyer des notifications test

---

© 2024 E-AGENCE. Tous droits réservés. | Développé par l'équipe DCTD
