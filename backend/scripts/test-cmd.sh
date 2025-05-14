#!/bin/bash
set -e

echo "Lancement des tests..."
exec python manage.py test
