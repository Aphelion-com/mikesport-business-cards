#!/bin/sh
set -e

echo "▶ Waiting for the database and applying schema..."

# Apply the Prisma schema to the database (creates/updates tables).
# NON-destructive: no --force-reset, no --accept-data-loss. Our schema changes
# are additive (new card_events table), so this is safe.
# Retries to handle the DB container still starting up.
ATTEMPTS=0
MAX_ATTEMPTS=30
until npx prisma db push --skip-generate; do
  ATTEMPTS=$((ATTEMPTS + 1))
  if [ "$ATTEMPTS" -ge "$MAX_ATTEMPTS" ]; then
    echo "✖ Database not reachable after $MAX_ATTEMPTS attempts. Exiting."
    exit 1
  fi
  echo "  …database not ready yet (attempt $ATTEMPTS/$MAX_ATTEMPTS), retrying in 2s"
  sleep 2
done

echo "✔ Database ready"
echo "✔ Prisma schema applied"

# Seed data — idempotent (upsert by slug), never duplicates on restart.
# Failure here must NOT crash startup. Set SKIP_SEED=1 to disable.
if [ "$SKIP_SEED" = "1" ]; then
  echo "↷ Seed skipped (SKIP_SEED=1)"
else
  if node prisma/seed.cjs; then
    echo "✔ Seed completed"
  else
    echo "⚠ Seed step failed (continuing without crashing)"
  fi
fi

echo "▶ Starting Next.js app"
exec "$@"
