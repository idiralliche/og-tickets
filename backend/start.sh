#!/bin/sh
set -e

# Function to wait for the database to be ready
wait_for_db() {
  echo "Attente de la disponibilité de la base de données sur $DATABASE_HOST:$DATABASE_PORT..."
  while ! nc -z "$DATABASE_HOST" "$DATABASE_PORT"; do
    echo "La DB n'est pas encore prête, on attend 2 secondes..."
    sleep 2
  done
  echo "La base de données est disponible !"
}

# load secrets from /run/secrets/ and export them as environment variables
export SECRET_KEY=$(cat /run/secrets/secret_key | tr -d '\n')
export DATABASE_USER=$(cat /run/secrets/db_user | tr -d '\n')
export DATABASE_PASSWORD=$(cat /run/secrets/db_password | tr -d '\n')
export DATABASE_NAME=$(cat /run/secrets/db_name | tr -d '\n')
export DATABASE_HOST=$(cat /run/secrets/db_host | tr -d '\n')
export DATABASE_PORT=5432
export ALLOWED_HOSTS=$(cat /run/secrets/allowed_hosts | tr -d '\n')
export SENTRY_DSN=$(cat /run/secrets/sentry_dsn | tr -d '\n')
export EMAIL_HOST=$(cat /run/secrets/email_host | tr -d '\n')
export EMAIL_PORT=$(cat /run/secrets/email_port | tr -d '\n')
export EMAIL_HOST_USER=$(cat /run/secrets/email_host_user | tr -d '\n')
export EMAIL_HOST_PASSWORD=$(cat /run/secrets/email_host_password | tr -d '\n')
export EMAIL_USE_TLS=$(cat /run/secrets/email_use_tls | tr -d '\n')
export DEFAULT_FROM_EMAIL=$(cat /run/secrets/default_from_email | tr -d '\n')
export CORS_ALLOWED_ORIGINS=$(cat /run/secrets/cors_allowed_origins | tr -d '\n')

# Wait for the database to be ready
wait_for_db

# Apply migrations
python manage.py migrate --noinput

# Launch Gunicorn to start the Django app
exec gunicorn --bind 0.0.0.0:8000 --workers 1 ogtickets.wsgi:application
