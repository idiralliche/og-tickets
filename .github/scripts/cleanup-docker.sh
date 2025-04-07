#!/bin/bash

# Enable strict mode: exit on error, undefined variables, and pipeline failures
set -euo pipefail

DOCKER_IMAGE=${1:-""}

if [ -z "$DOCKER_IMAGE" ]; then
  echo "Erreur : Le nom de l'image (DOCKER_IMAGE) n'est pas spécifiée."
  exit 1
fi

# Function to check if a resource has been deleted
check_resource() {
  local resource_name="$1"
  local check_command="$2"
  if $check_command | grep -q .; then
    echo "Erreur : La ressource '$resource_name' n'a pas été supprimée."
    exit 1
  fi
  echo "La ressource '$resource_name' a été supprimée avec succès."
}

# Function to clean up resources
cleanup_resources() {
  local resource_type="$1"
  local list_command="$2"
  local delete_command="$3"

  echo "Nettoyage des $resource_type..."

  # Check if resources exist
  if ! $list_command | grep -q .; then
    echo "Aucun $resource_type à supprimer."
    return
  fi

  # Delete resources
  echo "Suppression des $resource_type..."
  $delete_command || {
    echo "Erreur lors de la suppression des $resource_type."
    exit 1
  }

  # Verify deletion
  check_resource "$resource_type" "$list_command"
}

echo "Nettoyage des ressources Docker..."

# Stop and delete containers (excluding Swarm ones)
echo "Nettoyage des conteneurs..."
containers=$(docker ps -aq --filter 'label=com.docker.swarm.service.id' --format "{{.ID}}")
if [ -n "$containers" ]; then
  echo "Arrêt des conteneurs..."
  docker stop $containers || {
    echo "Erreur lors de l'arrêt des conteneurs."
    exit 1
  }

  echo "Suppression des conteneurs..."
  docker rm -f $containers || {
    echo "Erreur lors de la suppression des conteneurs."
    exit 1
  }

  # Verify deletion
  check_resource "conteneurs" "docker ps -aq --filter 'label=com.docker.swarm.service.id' --format '{{.ID}}'"
else
  echo "Aucun conteneur à supprimer."
fi

# Delete images (excluding $DOCKER_IMAGE)
echo "Suppression des images Docker..."
images_to_remove=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep -v "$DOCKER_IMAGE" | grep -v "<none>:<none>")
if [ -n "$images_to_remove" ]; then
  echo "Images à supprimer :"
  echo "$images_to_remove"
  docker rmi -f $images_to_remove || {
    echo "Erreur : Certaines images n'ont pas pu être supprimées."
    exit 1
  }
  remaining_images=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep -v "$DOCKER_IMAGE" | grep -v "<none>:<none>")
  if [ -n "$remaining_images" ]; then
    echo "Erreur : Les images suivantes n'ont pas pu être supprimées :"
    echo "$remaining_images"
    exit 1
  fi
  echo "Toutes les images ont été supprimées avec succès."
else
  echo "Aucune image à supprimer."
fi

# Delete dangling images
cleanup_resources "images dangling" \
  "docker images -q --filter dangling=true" \
  "docker image prune -f"

# Delete volumes
cleanup_resources "volumes" \
  "docker volume ls -q" \
  "docker volume prune -f"

# Delete networks
cleanup_resources "réseaux" \
  "docker network ls -q" \
  "docker network prune -f"
