# og-tickets

Ce projet est une étude de cas. Il s'agit de développer une application web de réservation et de gestion d'e-tickets pour les Jeux Olympiques de 2024 en France. L'application remplace les tickets physiques par des e-tickets afin de sécuriser les réservations et limiter les risques de fraude.

L'application permet aux utilisateurs de :

- Créer un compte sécurisé.
- Réserver des tickets individuels, duo ou familiaux.
- Payer les tickets via un système sécurisé.
- Télécharger des e-tickets sécurisés, utilisables pour accéder aux événements.
- Vérifier l'authenticité des e-tickets à l'entrée, grâce à une double clé de sécurité.

Ce projet est en cours de développement

## Installation et exécution

### Prérequis

- Docker et Docker Compose (version v2+)
- Node.js et npm

### Instructions

1. **Cloner le dépôt :**

   -> git clone

   ```bash
   cd og-tickets
   ```

2. **Déploiement en développement :**

Utilisez Docker Compose pour lancer les services. Pour l’instant, seul le service frontend est défini :

```bash
docker compose up
```

Le front-end sera accessible sur http://localhost:3000.
