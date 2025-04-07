#!/bin/bash

set -euo pipefail

SERVICE_NAME=${1:-""}
TIMEOUT=${2:-120}

if [ -z "$SERVICE_NAME" ]; then
  echo "Erreur : Le nom du service (SERVICE_NAME) n'est pas spécifié."
  exit 1
fi

echo "Vérification de l'état du service '$SERVICE_NAME'..."

for i in $(seq 1 "$TIMEOUT"); do
  STATUS=$(docker service ps --no-trunc "$SERVICE_NAME" --format "{{.CurrentState}}" | head -n 1)

  if [[ "$STATUS" == *"Running"* ]]; then
    echo "Le service est en cours d'exécution."
    exit 0
  elif [[ "$STATUS" == *"Failed"* || "$STATUS" == *"Shutdown"* ]]; then
    echo "Le service a échoué ou s'est arrêté."
    docker service ps --no-trunc "$SERVICE_NAME"
    docker service logs "$SERVICE_NAME"
    exit 1
  fi

  echo "Attente du démarrage du service... ($i/$TIMEOUT)"
  sleep 5
done

echo "Timeout atteint : le service n'a pas démarré correctement."
docker service ps --no-trunc "$SERVICE_NAME"
docker service logs "$SERVICE_NAME"
exit 1
