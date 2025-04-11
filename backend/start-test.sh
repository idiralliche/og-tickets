#!/bin/bash

# Enable strict mode: exit on error
set -e

# Fonction pour attendre que la base de données soit prête
wait_for_db() {
  local db_host="$1"
  local db_port="$2"
  local max_wait_time=60
  local elapsed=0

  if [ -z "$db_host" ] || [ -z "$db_port" ]; then
    echo "Erreur : DB_HOST ou DB_PORT n'est pas défini."
    exit 1
  fi

  echo "Attente de la disponibilité de la base de données sur $db_host:$db_port..."

  # Boucle d'attente : utilisation de timeout pour tenter d'ouvrir une connexion TCP
  while ! nc -z "$db_host" "$db_port"; do
    if [ $elapsed -ge $max_wait_time ]; then
      echo "Erreur : La base de données n'est pas disponible après $max_wait_time secondes."
      exit 1
    fi
    echo "La DB n'est pas encore prête, on attend 2 secondes..."
    sleep 2
    elapsed=$((elapsed + 2))
  done

  echo "La base de données est disponible !"
}

# On attend que la base de données soit prête avant de lancer les tests.
wait_for_db "$DB_HOST" "${DB_PORT:-5432}"

# Une fois la base de données prête, on lance les tests.
echo "Lancement des tests..."
python manage.py test
