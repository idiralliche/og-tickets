#!/bin/bash

# Enable strict mode: exit on error, undefined variables, and pipeline failures
set -euo pipefail

DOCKER_IMAGE=${1:-""}
SECRET_FILE=${2:-""}
WORK_PATH=${3:-""}

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
# Check if the working directory is provided
if [[ -z "$WORK_PATH" ]]; then
  echo "Erreur : Le répertoire de travail (WORK_PATH) n'est pas spécifié."
  exit 1
fi
# Check if the working directory exists
if [[ ! -d "$WORK_PATH" ]]; then
  echo "Erreur : Le répertoire de travail '$WORK_PATH' n'existe pas."
  exit 1
fi


# Build the Docker image
echo "Construction de l'image Docker '$DOCKER_IMAGE'..."
DOCKER_BUILDKIT=1 docker build \
  --build-arg ENV=prod \
  --build-arg DEBUG=false \
  --secret id=secret_key,src=$SECRET_FILE \
  -t "$DOCKER_IMAGE" \
  -f "${WORK_PATH}/Dockerfile" "$WORK_PATH" || {
  echo "Erreur : La construction de l'image Docker '$DOCKER_IMAGE' a échoué."
  exit 1
}

# Verify the image was built successfully and wait for it to be available
echo "Attente de la disponibilité de l'image Docker '$DOCKER_IMAGE'..."
max_attempts=12
attempt=1

while [ $attempt -le $max_attempts ]; do
  if docker images | grep -q "$DOCKER_IMAGE"; then
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

rm -f "$SECRET_FILE" || {
  echo "Erreur : Impossible de supprimer le fichier secret."
  exit 1
}
# Vérifier que le fichier secret a bien été supprimé
if [ -f "$SECRET_FILE" ]; then
  echo "Erreur : Le fichier secret n'a pas été supprimé."
  exit 1
fi
echo "Fichier secret supprimé avec succès."
