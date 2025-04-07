#!/bin/bash

# Enable strict mode: exit on error, undefined variables, and pipeline failures
set -euo pipefail

SERVICE_NAME=${1:-""}
STACK_NAME=${2:-""}

if [ -z "$SERVICE_NAME" ]; then
  echo "Erreur : Le nom du service (SERVICE_NAME) n'est pas spécifié."
  exit 1
fi
if [ -z "$STACK_NAME" ]; then
  echo "Erreur : Le nom de la pile (STACK_NAME) n'est pas spécifié."
  exit 1
fi

# Function to wait for a resource to be deleted
wait_for_deletion() {
  local resource_name="$1"
  local check_command="$2"
  local timeout=60
  local elapsed=0

  echo "Attente de la suppression de '$resource_name'..."
  while $check_command | grep -q .; do
    if [ $elapsed -ge $timeout ]; then
      echo "Erreur : La suppression de '$resource_name' a dépassé le délai d'attente."
      exit 1
    fi

    echo "En cours... ($elapsed/$timeout secondes)"
    sleep 5
    elapsed=$((elapsed + 5))
  done

  echo "'$resource_name' a été supprimé avec succès."
}

# Delete Docker Swarm services
cleanup_resource() {
  local resource_type="$1"
  local list_command="$2"
  local delete_command="$3"

  echo "Suppression des $resource_type..."
  if ! $list_command | grep -q .; then
    echo "Aucun $resource_type à supprimer."
    return
  fi

  # Delete the resource
  $delete_command || {
    echo "Erreur lors de la suppression des $resource_type."
    exit 1
  }

  # Wait for deletion
  wait_for_deletion "$resource_type" "$list_command"
}

echo "Nettoyage des ressources Docker swarm..."

# Delete Docker Swarm services
cleanup_resource "services Docker Swarm" \
  "docker service inspect $SERVICE_NAME &> /dev/null" \
  "docker service rm $SERVICE_NAME"

# Delete Docker Swarm stack
cleanup_resource "stack Docker Swarm" \
  "docker stack ls | grep -q $STACK_NAME" \
  "docker stack rm $STACK_NAME"

# Delete Docker secrets
echo "Suppression des secrets Docker..."
if docker secret ls -q | grep -q .; then
  docker secret rm $(docker secret ls -q) || {
    echo "Erreur : Échec de la suppression des secrets Docker."
    exit 1
  }

  # Verify deletion
  if docker secret ls -q | grep -q .; then
    echo "Erreur : Certains secrets Docker n'ont pas pu être supprimés."
    exit 1
  fi
  echo "Tous les secrets Docker ont été supprimés avec succès."
else
  echo "Aucun secret Docker à supprimer."
fi
