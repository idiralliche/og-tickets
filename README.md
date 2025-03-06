# og-tickets

Cette application a été développée dans un but pédagogique (Développement en cours).

**og-tickets** est une application web de réservation et de gestion d'e-tickets pour les Jeux Olympiques de 2024. L'application remplace les tickets physiques par des e-tickets sécurisés afin de faciliter les réservations et limiter les risques de fraude.

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation et configuration en développement local](#installation-et-configuration-en-développement-local)
- [Déploiement en production](#déploiement-en-production)
  - [Utilisation de Docker Swarm](#utilisation-de-docker-swarm)
  - [Gestion des secrets](#gestion-des-secrets)
  - [Configuration de Nginx](#configuration-de-nginx)
- [Tests](#tests)
- [CI/CD et déploiement continu](#cicd-et-déploiement-continu)
- [Contribution](#contribution)
- [Licence](#licence)

---

## Fonctionnalités

- **Création et gestion de comptes utilisateurs sécurisés**
- **Réservation d'e-tickets pour diverses catégories** (individuel, duo, familial)
- **Système de paiement sécurisé**
- **Téléchargement et vérification d'e-tickets via une double clé de sécurité**
- **Consultation publique des épreuves et des offres (pour utilisateurs non authentifiés)**

---

## Architecture

L'architecture du projet repose sur une séparation claire entre le frontend et le backend :

- **Frontend** : Application React déployée sur Vercel.
- **Backend** : API Django/DRF déployée dans des containers Docker sur une instance EC2 et orchestrée en production avec Docker Swarm.
- **Base de données** : PostgreSQL gérée par AWS RDS, accessible uniquement en interne ou via un tunnel sécurisé.
- **Reverse proxy** : Nginx sert de reverse proxy pour assurer la terminaison TLS et rediriger le trafic HTTPS vers le backend.
- **Gestion des secrets** : Les données sensibles (clé Django, informations de connexion à la BDD, etc.) sont gérées via Docker Secrets en production et par des montages de volumes pour le développement local.

---

## Technologies utilisées

- **Frontend** : React, JavaScript/TypeScript, CSS
- **Backend** : Django 5.x, Django REST Framework
- **Base de données** : PostgreSQL
- **Containerisation** : Docker, Docker Compose (développement), Docker Swarm (production)
- **Reverse proxy et HTTPS** : Nginx, Certbot
- **Secrets et sécurité** : Docker BuildKit (montage de secrets pendant le build), Docker Secrets pour Swarm
- **Monitoring** : Sentry
- **Tests** : Django Test Framework, pytest (optionnel)

---

## Prérequis

- [Docker](https://docs.docker.com/get-docker/) installé sur votre machine
- [Docker Compose](https://docs.docker.com/compose/install/) pour le développement local (version v2+)
- [Node.js](https://nodejs.org/en/download)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

---

## Installation et configuration

### Cloner le projet

```bash
git clone https://github.com/votre-compte/og-tickets.git
cd og-tickets

```

### Déployer le backend

```bash
cd backend

```

#### Configuration des secrets

Créez un dossier `secrets/`dans le répertoire backend (ajoutez-le à `.gitignore` pour ne pas versionner ces fichiers). Dans ce dossier, créez les fichiers suivants avec vos valeurs sensibles :

- secrets/django_secret_key.txt
- secrets/db_user.txt
- secrets/db_password.txt
- secrets/db_name.txt
- secrets/db_host.txt
- secrets/allowed_hosts.txt
- secrets/sentry_dsn.txt

Nous vous conseillons de restreindre les permissions de ces fichiers :

```bash
chmod 600 secrets/*.txt

```

#### Déploiement en développement

Pour lancer l'application en local activez Docker BuildKit si nécessaire :

```bash
export DOCKER_BUILDKIT=1

```

Utilisez Docker Compose pour lancer les services.

```bash
docker compose up

```

#### Déploiement en production

En production vous pourriez préférer utiliser Docker Swarm :

```bash
docker swarm init
docker stack deploy --with-registry-auth -c stack.yaml backend_stack

```

### Déployer le frontend

#### Installation des dépendances

```bash
cd frontend
npm install

```

#### Configuration de l'API

Dans le fichier `.env` du frontend (ou via la configuration de votre PaaS), définissez la variable :

```env
REACT_APP_BACKEND_BASE_URL=https://ogtickets.duckdns.org/

```

Ainsi, votre frontend pointera vers le backend déployé.

#### Lancement du frontend en développement

```bash
npm start

```

#### Lancement du frontend en production

```bash
npm run build

```

## Tests et monitoring

Pour exécuter les tests Django, dans le répertoire backend, lancez :

```bash
cd backend
python manage.py test

```

Pour exécuter les tests du frontend react, lancez :

```bash
cd frontend
npm test

```

Pour activer le monitoring du backend via Sentry, ajoutez votre DSN dans le fichier `backend/secrets/sentry_dsn.txt` et redéployez l'application backend.

---

## CI/CD et déploiement continu

Pour le moment, l'application est déployée manuellement. Cependant, vous pouvez configurer un pipeline CI/CD avec GitHub Actions.

Pour le frontend, l'application est déployée sur Vercel. Les déploiements sont automatiques à partir de la branche principale.

Pour le backend, le déploiement est effectué via Docker Swarm. Les secrets sont gérés via Docker Secrets et les fichiers secrets.

Pour le reverse proxy et le TLS, nous utilisons Nginx et Certbot. Nginx est configuré pour rediriger le trafic HTTPS vers le backend via un tunnel sécurisé.

---

## Contribution

L'applicaiton est en cour de développement et sert un objectif pédagogique. Pour le moment il n'est donc pas ouvert aux contributions.

---

## Licence

Le projet est sous licence MIT.
