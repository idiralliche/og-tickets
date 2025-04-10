#!/bin/bash

# Enable strict mode: exit on error
set -e

# Function to check if all required secrets are present
check_secrets() {
  local missing_secrets=0
  for secret in "$@"; do
    if [ ! -f "/run/secrets/$secret" ]; then
      echo "Erreur : Le secret '$secret' est manquant."
      missing_secrets=1
    fi
  done
  if [ $missing_secrets -ne 0 ]; then
    echo "Des secrets requis sont manquants. Arrêt du script."
    exit 1
  fi
}

# Function to wait for the database to be ready
wait_for_db() {
  local db_host="$1"
  local db_port="$2"
  local max_wait_time=60
  local elapsed=0

  if [ -z "$db_host" ] || [ -z "$db_port" ]; then
    echo "Erreur : DB_HOST ou DATABASE_PORT n'est pas défini."
    exit 1
  fi

  echo "Attente de la disponibilité de la base de données sur $db_host:$db_port..."

  while ! timeout 1 bash -c "</dev/tcp/$db_host/$db_port"; do
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

# Function to apply migrations
apply_migrations() {
  echo "Application des migrations..."

  # Execute the migration command and capture the output
  if ! python manage.py migrate --noinput 2>&1 | tee /tmp/migrate_output.log; then
        # Return code non-zero : Error
    echo "Erreur lors de l'application des migrations."
    cat /tmp/migrate_output.log
    exit 1
  fi

  if grep -q "No migrations to apply" /tmp/migrate_output.log; then
    echo "Aucune migration à appliquer. Tout est à jour."
  else
    echo "Migrations appliquées avec succès."
  fi
  rm -f /tmp/migrate_output.log
}

# List of required secrets
required_secrets=(
  secret_key db_user db_password db_name db_host allowed_hosts sentry_dsn
  email_host email_port email_host_user email_host_password email_use_tls
  default_from_email cors_allowed_origins
)

# Check if all required secrets are present
echo "Vérification de l'existence des secrets Docker..."
check_secrets "${required_secrets[@]}"

# Load secrets from /run/secrets/ and export them as environment variables
for secret in "${required_secrets[@]}"; do
  export "$(echo "$secret" | tr '[:lower:]' '[:upper:]')"=$(cat "/run/secrets/$secret" | tr -d '\n')
done

# Wait for the database to be ready
wait_for_db "$DB_HOST" "${DATABASE_PORT:-5432}"

# Apply migrations
apply_migrations

# Launch Gunicorn to start the Django app
exec gunicorn --bind 0.0.0.0:8000 --workers 1 ogtickets.wsgi:application
