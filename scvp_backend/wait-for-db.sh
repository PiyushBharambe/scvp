#!/bin/sh
# wait-for-db.sh

# This script waits for the PostgreSQL database to be ready.
# Uses simple TCP connection check instead of pg_isready

# Hostname of the database service (as defined in docker-compose.yml)
DB_HOST="db"
# Database port (default PostgreSQL port)
DB_PORT="5432"

echo "Waiting for PostgreSQL at ${DB_HOST}:${DB_PORT}..."

# Loop until we can connect to the database port
until nc -z "$DB_HOST" "$DB_PORT"; do
  >&2 echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

>&2 echo "PostgreSQL is up - executing command"
exec "$@" # This executes the command passed to wait-for-db.sh (e.g., "npm start")
