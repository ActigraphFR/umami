#!/bin/sh

echo $(date '+%d/%m/%Y')

PGPASSWORD="$POSTGRES_PASSWORD" psql -h "$POSTGRES_HOST" -p 5432 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "
    DELETE FROM session WHERE created_at < NOW() - INTERVAL '2 years 2 months';
    DELETE FROM website_event WHERE created_at < NOW() - INTERVAL '2 years 2 months';
"
