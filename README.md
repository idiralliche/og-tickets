# og-tickets

Cette application a été développée dans un but pédagogique (Développement en cours).

**og-tickets** est une application web de réservation et de gestion d'e-tickets pour les Jeux Olympiques de 2024. L'application remplace les tickets physiques par des e-tickets sécurisés afin de faciliter les réservations et limiter les risques de fraude.

Accédez à l'application déployée sur [https://og-tickets.vercel.app/](https://og-tickets.vercel.app/)

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
  - [Backend et Simulation de Micro-services](#backend-et-simulation-de-micro-services)
- [Technologies utilisées](#technologies-utilisées)
- [Mesures de sécurité](#mesures-de-sécurité)

---

## Fonctionnalités

- **Consultation publique des épreuves et des offres (pour utilisateurs non authentifiés)**
- **Création et gestion de comptes utilisateurs sécurisés**
- **Réservation d'e-tickets pour diverses catégories** (individuel, duo, familial)
- **Système de paiement sécurisé**
- **Téléchargement et vérification d'e-tickets via une double clé de sécurité**

---

## Architecture

L'architecture du projet repose sur une séparation claire entre le frontend et le backend :

### Frontend :

- **Technologies** : Application React (Javascript + SCSS)
- **Déploiement** : Vercel (déploiement automatisé depuis le repo sur github, scalabilité automatique et CDN.).
- **Fonctionnalités** : Consultation publique des épreuves et des offres ainsi qu'un panier hors connexion, et interfaces sécurisées pour la création et la gestion de compte utilisateur, et pour l'achat et la gestion des billets une fois l'utilisateur authentifié.

### Backend :

- **Technologies** : API Django/DRF
- **Authentification** : Utilisation de Djoser pour la gestion des inscriptions, activations et réinitialisations de mot de passe, couplé avec JWT pour l'authentification.
- **Containerisation** : Déployé dans des containers Docker. Docker Swarm orchestre les services sur une instance AWS EC2.
- **Base de données** : PostgreSQL hébergé sur AWS RDS, accessible uniquement via un tunnel sécurisé (instance AWS EC2 du backend Django) ou par des règles strictes de sécurité réseau.
- **Reverse Proxy et TLS** : Nginx est utilisé comme reverse proxy pour gérer la terminaison TLS.
- **Secrets et Variables sensibles** : Les données sensibles (clé Django, informations de connexion à la BDD, identifiants SMTP, etc.) sont gérées via Docker Secrets en production et par Docker BuildKit pour le build de l'image (clé Django requise).
- **Monitoring** : Sentry est intégré pour capturer et surveiller en temps réel les erreurs et exceptions.

### DNS, Cloudflare :

Le domaine est géré par Cloudflare, qui fournit un DNS scalable, des fonctionnalités de protection contre les attaques DDoS, des règles personnalisées pour les accès aux URI, et d'autre fonctionnalités liées à la sécurité.

### Backend et Simulation de Micro-services

Le backend de **og-tickets** a été conçu de manière modulaire en utilisant la structure des applications Django pour simuler une architecture de micro-services. Chaque fonctionnalité du système est isolée dans une app dédiée :

- **accounts** gère l'authentification, la gestion des utilisateurs et la sécurité via Djoser et JWT.
- **offers** s'occupe de la gestion des offres de billets.
- **olympic_events** gère l'affichage et l'administration des événements sportifs.
- Les autres services ne sont pas encore développés mais la'étape suivante est **cart** pour gérer le panier utilisateur...

Cette organisation offre plusieurs avantages :

- **Séparation des préoccupations** : Chaque app est responsable uniquement de ses fonctionnalités spécifique, ce qui facilite la compréhension, le développement et la maintenance du code.
- **Modularité et évolutivité** : Bien que l'architecture reste en réalité monolithique, la séparation en apps permet d'isoler les évolutions et les tests et d'envisager à terme une scalabilité horizontale en cas de besoin, en transformant chaque module en service indépendant si le projet doit évoluer.
- **Bonne pratique industrielle** : Cette approche s'inspire des principes des micro-services, en montrant une compréhension approfondie des avantages de la décomposition fonctionnelle. Elle démontre également la capacité à organiser un projet de grande envergure de façon professionnelle, tout en tirant parti de la robustesse et de la simplicité offertes par Django.

Cette stratégie de développement renforce la maintenabilité et la testabilité du backend, tout en facilitant une potentielle migration vers une architecture de micro-services à part entière si l'échelle du projet l'exige.

---

## Technologies utilisées

### Frontend :

- React, JavaScript, SCSS
- Déploiement sur Vercel : scalabilité automatique, CDN.

### Backend :

- Django 5.x, Django REST Framework
- Authentification via Djoser et JWT
- PostgreSQL (AWS RDS)
- Containerisation avec Docker, orchestration en production avec Docker Swarm
- Reverse proxy avec Nginx
- Gestion des secrets via Docker Secrets (docker swarm) et Docker BuildKit (montage de secrets pendant le build de l'image docker du backend Django)
- Monitoring avec Sentry

### Infrastructure et Sécurité DNS :

- DNS et protection DDoS assurés par Cloudflare
- Configuration des enregistrements DNS (MX, TXT, CNAME) pour la messagerie et le trafic SMTP

### Tests :

- Django Test Framework

---

## Mesures de Sécurité

### Authentification et Autorisation :

- Inscription sécurisée avec vérification par email via Djoser
- Utilisation de JWT pour l'authentification des API
- Activation d'un compte après validation de l'adresse email

### Sécurisation des communications :

- Utilisation de HTTPS avec TLS, géré par Nginx et Certbot
- Reverse proxy configuré pour rediriger le trafic HTTPS vers le backend en toute sécurité

### Gestion des Secrets :

- Les informations sensibles sont stockées à l'aide de Docker Secrets

### DNS et Scalabilité :

- Cloudflare offre une infrastructure DNS résiliente et des fonctionnalités de protection contre les attaques DDoS
- Les enregistrements DNS sensibles (par exemple, pour le SMTP) sont configurés en mode DNS Only afin d'assurer une communication directe et sécurisée.
