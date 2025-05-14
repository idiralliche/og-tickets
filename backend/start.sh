#!/bin/bash
set -e

mode="$1"
shift

# Load secrets from /run/secrets/ and export them as environment variables
if [[ "$mode" == "django" || "$mode" == "celery" ]]; then
  echo "Chargement des secrets Docker..."
  /app/scripts/load-secrets.sh
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
