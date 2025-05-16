#!/bin/bash
set -e

# Required secrets as space-separated list
secrets="secret_key db_user db_password db_name db_host allowed_hosts sentry_dsn email_host email_host_password cors_allowed_origins"

# Load secrets from /run/secrets/ and export them as environment variables
for secret in $secrets; do
  env_var=$(echo "$secret" | tr '[:lower:]' '[:upper:]')
  value=$(cat "/run/secrets/$secret" | tr -d '\n')
  export "$env_var"="$value"
done
