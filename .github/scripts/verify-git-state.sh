#!/bin/bash

# Vérifications Git pour les workflows CI/CD

validate_git_environment() {
  # 1. Vérifie que c'est un dépôt Git
  if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "::error::Le répertoire n'est pas un dépôt Git valide"
    return 1
  fi

  # 2. Vérifie la branche actuelle (optionnel)
  local current_branch=$(git rev-parse --abbrev-ref HEAD)
  if [[ "$current_branch" != "main" ]]; then
    echo "::warning::Branche actuelle : $current_branch (devrait être 'main')"
  fi

  # 3. Vérifie les modifications non commitées
  if [[ -n "$(git status --porcelain)" ]]; then
    echo "::error::Modifications non commitées détectées :"
    git status --short
    return 1
  fi

  # 4. Vérifie la synchronisation avec la branche distante
  git fetch origin main
  local local_hash=$(git rev-parse HEAD)
  local remote_hash=$(git rev-parse origin/main)

  if [[ "$local_hash" != "$remote_hash" ]]; then
    echo "::warning::Le dépôt local n'est pas synchronisé avec origin/main"
    echo "Pour synchroniser : git pull origin main"
  fi

  echo "✓ Environnement Git validé"
  return 0
}

# Exécution principale
validate_git_environment || exit 1
