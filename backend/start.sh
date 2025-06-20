#!/bin/bash
set -e

mode="$1"
shift

# Load secrets from /run/secrets/ and export them as environment variables
if [[ "$mode" == "django" || "$mode" == "celery" ]]; then
  echo "Chargement des secrets Docker..."
  # Required secrets as space-separated list
  secrets="ticket_hmac_key ticket_encryption_key stripe_secret_key stripe_webhook_secret secret_key db_user db_password db_name db_host allowed_hosts sentry_dsn email_host email_host_password"

  # Load secrets from /run/secrets/ and export them as environment variables
  for secret in $secrets; do
    env_var=$(echo "$secret" | tr '[:lower:]' '[:upper:]')
    value=$(cat "/run/secrets/$secret" | tr -d '\n')
    export "$env_var"="$value"
  done
fi

# Function to wait for the database to be ready
/app/scripts/wait-for-db.sh "$DB_HOST" "${DB_PORT:-5432}"

case "$mode" in
  django)
    exec /app/scripts/django-cmd.sh
    ;;
  celery)
    exec /app/scripts/celery-cmd.sh
    ;;
  test)
    exec /app/scripts/test-cmd.sh
    ;;
  *)
    echo "Usage : $0 {django|celery|test}" >&2
    exit 1
    ;;
esac
