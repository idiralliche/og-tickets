#!/bin/bash

# Enable strict mode: exit on error, undefined variables, and pipeline failures
set -euo pipefail

# Check if swarm is active
SWARM_STATE=$(docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null || echo "inactive")
if [[ "$SWARM_STATE" != "active" ]]; then
  echo "Ce node n'est pas en mode swarm manager. Passage du nettoyage des ressources Docker Swarm."
  exit 0
fi

# Cleanup Docker Swarm resources
echo "Nettoyage des ressources Docker swarm..."

# Delete Docker Swarm services
echo "Suppression des services Docker Swarm..."
if docker service ls -q | grep -q .; then
  docker service rm $(docker service ls -q) || {
    echo "Erreur lors de la suppression des services Docker Swarm."
    exit 1
  }
  echo "Services Docker Swarm supprimés avec succès."
else
  echo "Aucun service Docker Swarm à supprimer."
fi

# Delete Docker Swarm stacks
echo "Suppression des stacks Docker Swarm..."
if docker stack ls --format '{{.Name}}' | grep -q .; then
  docker stack rm $(docker stack ls --format '{{.Name}}') || {
    echo "Erreur lors de la suppression des stacks Docker Swarm."
    exit 1
  }
  echo "Stacks Docker Swarm supprimés avec succès."
else
  echo "Aucune stack Docker Swarm à supprimer."
fi

# Delete Docker secrets
echo "Suppression des secrets Docker..."
if docker secret ls -q | grep -q .; then
  docker secret rm $(docker secret ls -q) || {
    echo "Erreur lors de la suppression des secrets Docker."
    exit 1
  }
  echo "Secrets Docker supprimés avec succès."
else
  echo "Aucun secret Docker à supprimer."
fi
