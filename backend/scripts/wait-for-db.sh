#!/bin/bash
set -e

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
