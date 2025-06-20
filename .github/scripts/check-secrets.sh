#!/bin/bash

# Enable strict mode: exit on error, undefined variables, and pipeline failures
set -euo pipefail

# List of required secrets
readonly SECRETS=(
  "secret_key" "db_user" "db_password" "db_name" "db_host" "allowed_hosts"
  "sentry_dsn" "email_host" "email_host_password" "stripe_secret_key" "ticket_encryption_key" "ticket_hmac_key" "stripe_webhook_secret"
)

# Function to verify all secrets exist
check_secrets() {
  local missing_secrets=0

  echo "Vérification de l'existence des secrets Docker..."
  for secret in "${SECRETS[@]}"; do
    if [ ! -f "/run/secrets/$secret" ]; then
      echo "Erreur : Le secret '$secret' est manquant (fichier non trouvé)."
      missing_secrets=1
      else
        content=$(cat "/run/secrets/$secret" | tr -d '\n')
        if [ -z "$content" ]; then
          echo "Erreur : Le secret '$secret' est vide."
          missing_secrets=1
        fi
    fi
  done

  if [ "$missing_secrets" -ne 0 ]; then
    echo "Des secrets requis sont manquants. Arrêt du script."
    exit 1
  fi

  echo "Tous les secrets Docker ont été créés avec succès."
}

# Main script execution
check_secrets
