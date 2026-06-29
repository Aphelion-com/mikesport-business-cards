#!/bin/sh
set -e

echo "▶ Waiting for the database to be ready..."

# Sync the Prisma schema to the database (creates tables if missing).
# Retries to handle the DB container still starting up.
ATTEMPTS=0
MAX_ATTEMPTS=30
until npx prisma db push --skip-generate --accept-data-loss; do
  ATTEMPTS=$((ATTEMPTS + 1))
  if [ "$ATTEMPTS" -ge "$MAX_ATTEMPTS" ]; then
    echo "✖ Database not reachable after $MAX_ATTEMPTS attempts. Exiting."
    exit 1
  fi
  echo "  …database not ready yet (attempt $ATTEMPTS/$MAX_ATTEMPTS), retrying in 2s"
  sleep 2
done

echo "✔ Schema is in sync."

# Seed data (idempotent — uses upsert). Set SKIP_SEED=1 to disable.
if [ "$SKIP_SEED" != "1" ]; then
  echo "▶ Seeding database..."
  npx prisma db seed || echo "⚠ Seed step skipped or failed (continuing)."
fi

echo "▶ Starting application..."
exec "$@"
