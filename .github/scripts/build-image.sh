#!/bin/bash

# Enable strict mode: exit on error, undefined variables, and pipeline failures
set -euo pipefail

DOCKER_IMAGE=${1:-""}
SECRET_FILE=${2:-""}

# Check if the Docker image name is provided
if [[ -z "$DOCKER_IMAGE" ]]; then
  echo "Erreur : Le nom de l'image Docker (DOCKER_IMAGE) n'est pas spécifié."
  exit 1
fi
# Check if the secret file path is provided
if [[ -z "$SECRET_FILE" ]]; then
  echo "Erreur : Le chemin du fichier secret (SECRET_FILE) n'est pas spécifié."
  exit 1
fi


# Build the Docker image
echo "Construction de l'image Docker '$DOCKER_IMAGE'..."
DOCKER_BUILDKIT=1 docker build \
  --build-arg ENV=prod \
  --build-arg DEBUG=false \
  --secret id=secret_key,src=$SECRET_FILE \
  -t "$DOCKER_IMAGE" \
  -f Dockerfile .

# Verify the image was built successfully
if ! docker images | grep -q "$DOCKER_IMAGE"; then
  echo "Erreur : L'image Docker '$DOCKER_IMAGE' n'a pas été construite avec succès."
  exit 1
fi
echo "Image Docker '$DOCKER_IMAGE' construite avec succès."
# Verify the image is not empty
if [ "$(docker inspect -f '{{.Size}}' "$DOCKER_IMAGE")" -eq 0 ]; then
  echo "Erreur : L'image Docker '$DOCKER_IMAGE' est vide."
  exit 1
fi
echo "L'image Docker '$DOCKER_IMAGE' n'est pas vide."

rm -f "$SECRET_FILE" || (
  echo "Erreur : Impossible de supprimer le fichier secret."
  exit 1
)
# Verify the file was deleted
if [ -f "$SECRET_FILE" ]; then
  echo "Erreur : Le fichier secret n'a pas été supprimé."
  exit 1
fi
echo "Fichier secret supprimé avec succès."

rmdir /tmp/secrets || echo "Le répertoire /tmp/secrets n'existe pas ou n'a pas pu être supprimé."
