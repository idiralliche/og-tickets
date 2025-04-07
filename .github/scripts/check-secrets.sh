#!/bin/bash

# Enable strict mode: exit on error, undefined variables, and pipeline failures
set -euo pipefail

# List of required secrets
readonly SECRETS=(
  "secret_key" "db_user" "db_password" "db_name" "db_host" "allowed_hosts" "cors_allowed_origins"
  "sentry_dsn" "email_host" "email_port" "email_host_user" "email_host_password" "email_use_tls"
  "default_from_email"
)

# Function to verify all secrets exist
verify_secrets() {
  local missing_secrets=()

  echo "Vérification de l'existence des secrets Docker..."
  for secret in "${SECRETS[@]}"; do
    if ! docker secret inspect "$secret" &> /dev/null; then
      missing_secrets+=("$secret")
    fi
  done

  if [ ${#missing_secrets[@]} -ne 0 ]; then
    echo "Erreur : Les secrets suivants sont manquants :"
    printf "  - %s\n" "${missing_secrets[@]}"
    exit 1
  fi

  echo "Tous les secrets Docker ont été créés avec succès."
}

# Main script execution
verify_secrets
