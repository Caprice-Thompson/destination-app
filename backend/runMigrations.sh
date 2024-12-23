#!/bin/bash

# Exit if any command fails
set -e

MIGRATIONS_PATH="/destination-app/backend/migrations"
EXCLUDE_PATH="prisma_migrations"

DB_HOST=db

# Loop through each migration file in the directory, excluding the prisma_migrations folder
for migration in $(find $MIGRATIONS_PATH -type f -not -path "$MIGRATIONS_PATH/$EXCLUDE_PATH/*"); do
  # Skip any unwanted files/folders, if needed
  if [[ -d $migration ]]; then
    continue
  fi

  echo "Applying migration: $migration"
  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f "$migration"
done

echo "All migrations applied."
