#!/bin/bash

# Enable strict mode: exit on error, undefined variables, and pipeline failures
set -euo pipefail

echo "Nettoyage des ressources Docker..."

# Stop and delete containers (excluding Swarm ones)
echo "Nettoyage des conteneurs..."
containers=$(docker ps -aq)
if [ -z "$containers" ]; then
  echo "Aucun conteneur à supprimer."
else
  echo "Conteneurs à supprimer:"
  echo "$containers"
  docker stop $containers && docker rm -f $containers

  # Verify deletion
  remaining_containers=$(docker ps -aq)
  if [ -n "$remaining_containers" ]; then
    echo "Erreur : Certains conteneurs n'ont pas été supprimés :"
    echo "$remaining_containers"
    exit 1
  else
    echo "Les conteneurs ont été supprimés avec succès."
  fi
fi


# Delete images (excluding $DOCKER_IMAGE & buildkit images)
echo "Suppression des images Docker..."
images_to_remove=$(docker image ls -aq)
if [ -z "$images_to_remove" ]; then
  echo "Aucune image à supprimer."
else
  echo "Images à supprimer :"
  echo "$images_to_remove"
  if ! docker image rm -f $images_to_remove; then
    echo "Attention : certaines images n'ont pas pu être supprimées."
  fi

  # Verify deletion
  remaining_images=$(docker image ls -aq)
  if [ -z "$remaining_images" ]; then
    echo "Les images ont été supprimées avec succès."
  else
    echo "Attention : les images suivantes n'ont pas pu être supprimées :"
    echo "$remaining_images"
  fi
fi

# Delete dangling docker resources
echo "Nettoyage de toutes ressources Docker orphelines..."

if ! docker system df | grep -q "dangling" || docker system df | grep -q "unused"; then
  echo "Aucune ressource Docker orpheline à supprimer."
  exit 0
fi

timeout=60
elapsed=0

# Wait for 60 seconds for Docker to clean up dangling resources
while docker system df | grep -q "dangling" || docker system df | grep -q "unused"; do
  if [ $elapsed -ge $timeout ]; then
    echo "Erreur : Le nettoyage des ressources Docker a dépassé le délai d'attente."
    exit 1
  fi

  echo "Ressources Docker orphelines détectées. Attente de 5 secondes avant de réessayer..."
  sleep 5
  elapsed=$((elapsed + 5))
done
echo "Ressources Docker orphelines supprimées avec succès."
