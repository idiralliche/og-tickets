#!/bin/bash

# Enable strict mode: exit on error, undefined variables, and pipeline failures
set -euo pipefail

DOCKER_IMAGE=${1:-""}

# Check if the Docker image name is provided
if [[ -z "$DOCKER_IMAGE" ]]; then
  echo "Erreur : Le nom de l'image Docker (DOCKER_IMAGE) n'est pas spécifié."
  exit 1
fi

# Verify the image was built successfully and wait for it to be available
echo "Attente de la disponibilité de l'image Docker '$DOCKER_IMAGE'..."
max_attempts=12
attempt=1
while [ $attempt -le $max_attempts ]; do
  # Utiliser --format pour obtenir exactement "Repository:Tag"
  if docker images --format "{{.Repository}}:{{.Tag}}" | grep -q "^$DOCKER_IMAGE\$"; then
    echo "L'image Docker '$DOCKER_IMAGE' est disponible."
    break
  fi
  echo "Image non trouvée. Nouvelle tentative... ($attempt/$max_attempts)"
  sleep 10
  attempt=$((attempt + 1))
done

if [ $attempt -gt $max_attempts ]; then
  echo "Erreur : L'image Docker '$DOCKER_IMAGE' n'a pas été trouvée après plusieurs tentatives."
  exit 1
fi

echo "Vérification de la taille de l'image..."
if [ "$(docker inspect -f '{{.Size}}' "$DOCKER_IMAGE")" -eq 0 ]; then
  echo "Erreur : L'image Docker '$DOCKER_IMAGE' est vide."
  exit 1
fi
echo "L'image Docker '$DOCKER_IMAGE' a été construite avec succès et n'est pas vide."
