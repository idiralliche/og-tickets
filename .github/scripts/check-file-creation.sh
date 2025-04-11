#!/bin/bash

# Enable strict mode: exit on error, undefined variables, and pipeline failures
set -euo pipefail

SECRETS_DIR=${1:-""}
FILE_NAME=${2:-""}

FILE_PATH="${SECRETS_DIR}/${FILE_NAME}"

echo "Vérification de la création du fichier '$FILE_NAME'..."
if [ ! -f "$FILE_PATH" ]; then
  echo "Erreur : Le fichier '$FILE_NAME' n'a pas été créé."
  exit 1
fi
if [ ! -s "$FILE_PATH" ]; then
  echo "Erreur : Le fichier '$FILE_NAME' est vide."
  exit 1
fi

echo "Fichier '$FILE_NAME' créé avec succès."
