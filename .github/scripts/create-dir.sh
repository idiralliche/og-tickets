#!/bin/bash

# Enable strict mode: exit on error, undefined variables, and pipeline failures
set -euo pipefail

DIR=${1:-""}
DIR_NAME=${2:-""}

# Check if the directory path is provided
if [ -z "$DIR" ]; then
  echo "Erreur : Le chemin du répertoire '$DIR_NAME' n'est pas spécifié."
  exit 1
fi
# Check if the directory name is provided
if [ -z "$DIR_NAME" ]; then
  echo "Erreur : Le nom du répertoire '$DIR' n'est pas spécifié."
  exit 1
fi

# Create the directory if it doesn't exist
if [ ! -d "$DIR" ]; then
  echo "Création du répertoire '$DIR_NAME' '$DIR'."
  mkdir -p "$DIR" || {
    echo "Erreur : Impossible de créer le répertoire '$DIR_NAME' '$DIR'."
    exit 1
  }
else
  echo "Le répertoire '$DIR_NAME' '$DIR' existe déjà."
fi
chmod 700 "$DIR"

echo "Le répertoire a été créé : $DIR"
