#!/bin/bash
set -e

echo "Lancement léger de Celery"
exec python -m celery -A ogtickets worker --loglevel=info --concurrency=1 --pool=solo
