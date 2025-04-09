#!/bin/bash

# Enable strict mode: exit on error, undefined variables, and pipeline failures
set -euo pipefail

DOCKER_IMAGE=${1:-""}

if [ -z "$DOCKER_IMAGE" ]; then
  echo "Erreur : Le nom de l'image (DOCKER_IMAGE) n'est pas spécifiée."
  exit 1
fi

prompt_decision() {
  read -t 5 -p "Voulez-vous arrêter le script (a) ou continuer (c) ? [c par défaut] : " answer
  answer=${answer:-c}
  if [ "$answer" == "a" ]; then
    echo "Arrêt du script."
    exit 1
  fi
  echo "Le script continue."
}

echo "Nettoyage des ressources Docker..."

# Stop and delete containers (excluding Swarm ones)
echo "Nettoyage des conteneurs..."
containers=$(docker ps -aq --filter 'label=com.docker.swarm.service.id')
if [ -z "$containers" ]; then
  echo "Aucun conteneur à supprimer."
else
  echo "Conteneurs à supprimer:"
  echo "$containers"
  docker stop $containers && docker rm -f $containers

  # Verify deletion
  remaining_containers=$(docker ps -aq --filter 'label=com.docker.swarm.service.id')
  if [ -n "$remaining_containers" ]; then
    echo "Erreur : Certains conteneurs n'ont pas été supprimés :"
    echo "$remaining_containers"
    prompt_decision
  else
    echo "Les conteneurs ont été supprimés avec succès."
  fi
fi

# Delete images (excluding $DOCKER_IMAGE & buildkit images)
echo "Suppression des images Docker..."
images_to_remove=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep -Ev "($DOCKER_IMAGE|<none>:<none>|moby/buildkit)" || echo "")
if [ -z "$images_to_remove" ]; then
  echo "Aucune image à supprimer."
else
  echo "Images à supprimer :"
  echo "$images_to_remove"
  if ! docker rmi -f $images_to_remove; then
    echo "Attention : certaines images n'ont pas pu être supprimées."
  fi

  # Verify deletion

  remaining_images=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep -Ev "($DOCKER_IMAGE|<none>:<none>|moby/buildkit)" || echo "")
  if [ -z "$remaining_images" ]; then
    echo "Les images ont été supprimées avec succès."
  else
    echo "Attention : les images suivantes n'ont pas pu être supprimées :"
    echo "$remaining_images"
    # Optionnel : sortir avec une erreur si nécessaire
    # exit 1
  fi
fi


# Delete dangling images
echo "Nettoyage des images dangling..."
dangling_images=$(docker images -q --filter dangling=true || echo "")
if [ -z "$dangling_images" ]; then
  echo "Aucune image dangling à supprimer."
else
  echo "Images dangling à supprimer :"
  echo "$dangling_images"
  docker image prune -f
  # Verify deletion

  remaining_dangling=$(docker images -q --filter dangling=true || echo "")
  if [ -n "$remaining_dangling" ]; then
    echo "Attention : certaines images dangling n'ont pas pu être supprimées :"
    echo "$remaining_dangling"
    # Prompt user to continue or stop the script, default to continue
    prompt_decision
  else
    echo "Les images dangling ont été supprimées avec succès."
  fi
fi

# Delete volumes
echo "Nettoyage des volumes..."
volumes=$(docker volume ls -q -f dangling=true | grep -Ev 'buildx_buildkit' || echo "")
if [ -z "$volumes" ]; then
  echo "Aucun volume dangling à supprimer."
else
  echo "Volumes à supprimer:"
  echo "$volumes"
  docker volume prune -f
  # Verify deletion

  remaining_volumes=$(docker volume ls -q -f dangling=true | grep -Ev 'buildx_buildkit' || echo "")
  if [ -n "$remaining_volumes" ]; then
    echo "Attention : les volumes suivants n'ont pas pu être supprimés :"
    echo "$remaining_volumes"
    prompt_decision
  else
    echo "Les volumes ont été supprimés avec succès."
  fi
fi

# Delete networks
echo "Nettoyage des réseaux..."
networks_full=$(docker network ls --format "{{.ID}} {{.Name}}" 2>/dev/null) || {
  prompt_decision
  networks_full=""
}
if [ -z "$networks_full" ]; then
  echo "Aucun réseau n'a été trouvé."
 prompt_decision
else
  networks_to_remove=$(echo "$networks_full" | grep -Ev '\s+(bridge|host|none|docker_gwbridge)$' | awk '{print $1}' || echo "")
  if [ -z "$networks_to_remove" ]; then
    echo "Aucun réseau à supprimer."
  else
    echo "Réseaux à supprimer:"
    echo "$networks_to_remove"
    docker network rm $networks_to_remove

    # Verify deletion
    remaining_networks=$(docker network ls --format "{{.ID}} {{.Name}}" | grep -Ev '\s+(bridge|host|none|docker_gwbridge)$' | awk '{print $1}' || echo "")
    if [ -n "$remaining_networks" ]; then
      echo "Attention : certains réseaux suivants n'ont pas été supprimés :"
      echo "$remaining_networks"
      prompt_decision
    else
      echo "Les réseaux ont été supprimés avec succès."
    fi
  fi
fi
