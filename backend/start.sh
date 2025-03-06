#!/bin/sh

# load secrets from /run/secrets/ and export them as environment variables
export SECRET_KEY=$(cat /run/secrets/secret_key)
export DATABASE_USER=$(cat /run/secrets/db_user)
export DATABASE_PASSWORD=$(cat /run/secrets/db_password)
export DATABASE_NAME=$(cat /run/secrets/db_name)
export DATABASE_HOST=$(cat /run/secrets/db_host)
export ALLOWED_HOSTS=$(cat /run/secrets/allowed_hosts)
export SENTRY_DSN=$(cat /run/secrets/sentry_dsn)

# Launch Gunicorn to start the Django app
exec gunicorn --bind 0.0.0.0:8000 --workers 1 ogtickets.wsgi:application