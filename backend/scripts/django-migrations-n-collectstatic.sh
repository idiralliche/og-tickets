#!/bin/bash
set -e

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

# Collect static files
echo "Collecte des fichiers statiques..."
python manage.py collectstatic --noinput || echo "Erreur lors de la collecte des fichiers statiques. Execution manuelle requise"
