#!/bin/sh

# load secrets from /run/secrets/ and export them as environment variables
export SECRET_KEY=$(cat /run/secrets/secret_key)
export DATABASE_USER=$(cat /run/secrets/db_user)
export DATABASE_PASSWORD=$(cat /run/secrets/db_password)
export DATABASE_NAME=$(cat /run/secrets/db_name)
export DATABASE_HOST=$(cat /run/secrets/db_host)
export ALLOWED_HOSTS=$(cat /run/secrets/allowed_hosts)
export SENTRY_DSN=$(cat /run/secrets/sentry_dsn)
export EMAIL_HOST=$(cat /run/secrets/email_host)
export EMAIL_PORT=$(cat /run/secrets/email_port)
export EMAIL_HOST_USER=$(cat /run/secrets/email_host_user)
export EMAIL_HOST_PASSWORD=$(cat /run/secrets/email_host_password)
export EMAIL_USE_TLS=$(cat /run/secrets/email_use_tls)
export DEFAULT_FROM_EMAIL=$(cat /run/secrets/default_from_email)

# Launch Gunicorn to start the Django app
exec gunicorn --bind 0.0.0.0:8000 --workers 1 ogtickets.wsgi:application
