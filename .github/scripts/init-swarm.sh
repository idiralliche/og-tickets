#!/bin/bash

# Enable strict mode: exit on error, undefined variables, and pipeline failures
set -euo pipefail

# Function to wait for docker swarm to be active
init_docker_swarm() {
  local timeout=60
  local elapsed=0

  # Check docker swarm state
  echo "Vérification de l'état de Docker Swarm..."
  local swarm_state
  swarm_state=$(docker info --format '{{.Swarm.LocalNodeState}}' 2>/dev/null || echo "inactive")

  if [ "$swarm_state" = "active" ]; then
    echo "Le nœud est déjà en mode Swarm actif."
  else
    echo "Initialisation de Docker Swarm..."
    if ! docker swarm init &> /dev/null; then
      echo "Erreur : Échec de l'initialisation de Docker Swarm."
      exit 1
    fi
  fi

  # Wait for Docker Swarm to be active
  echo "Attente de Docker Swarm..."
  while ! docker info --format '{{.Swarm.LocalNodeState}}' | grep -q 'active'; do
    if [ $elapsed -ge $timeout ]; then
      echo "Erreur : L'initialisation de Docker Swarm a dépassé le délai d'attente."
      exit 1
    fi

    echo "En cours... ($elapsed/$timeout secondes)"
    sleep 5
    elapsed=$((elapsed + 5))
  done

  echo "Docker Swarm initialisé avec succès."
}
init_docker_swarm
