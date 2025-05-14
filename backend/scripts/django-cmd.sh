#!/bin/bash
set -e

# Apply migrations &collect static files
/app/scripts/django-migrations-n-collectstatic.sh

# Launch Gunicorn to start the Django app
echo "Démarrage de Gunicorn..."
exec gunicorn \
  --bind 0.0.0.0:8000 \
  --workers 1 \
  --threads 4 \
  --timeout 120 \
  ogtickets.wsgi:application
