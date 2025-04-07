#!/bin/bash

# Enable strict mode: exit on error, undefined variables, and pipeline failures
set -euo pipefail

# Function to check if a command is available
check_command() {
  local command_name="$1"
  local command="$2"

  if ! command -v "$command" &> /dev/null; then
    echo "Erreur : $command_name n'est pas installé."
    exit 1
  fi
}

echo "Docker doit être installé et en cours d'exécution pour exécuter ce workflow.\n"

# Check if Docker is installed
check_command "Docker" "docker"

# Check if Docker Compose is installed
check_command "Docker Compose" "docker-compose"

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
  echo "Erreur : Le daemon Docker n'est pas actif."
  exit 1
fi

echo "Docker et Docker Compose sont installés et en cours d'exécution.\n"
