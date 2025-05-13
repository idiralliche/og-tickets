#!/bin/bash
set -e

# Required secrets as space-separated list
secrets="secret_key db_user db_password db_name db_host allowed_hosts sentry_dsn email_host email_host_password cors_allowed_origins"

# Load secrets from /run/secrets/ and export them as environment variables
for secret in $secrets; do
  env_var=$(echo "$secret" | tr '[:lower:]' '[:upper:]')
  value=$(cat "/run/secrets/$secret" | tr -d '\n')
  export "$env_var"="$value"
done

# Function to wait for the database to be ready
wait_for_db() {
  db_host="$1"
  db_port="$2"
  max_wait_time=60
  elapsed=0

  if [ -z "$db_host" ] || [ -z "$db_port" ]; then
    echo "Erreur : DB_HOST ou DB n'est pas défini."
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

# Wait for the database to be ready
wait_for_db "$DB_HOST" "${DB_PORT:-5432}"

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

# Apply migrations
apply_migrations
python manage.py collectstatic --noinput || echo "Erreur lors de la collecte des fichiers statiques. Execution manuelle requise"

# Forward to CMD (Gunicorn or Celery worker)
echo "Executing command: $@"
exec "$@"
