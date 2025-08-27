#!/bin/sh

export PGPASSWORD="$DB_PASSWORD"

pg_dump -h "db_postgre_$CLIENT_NAME" -p 5432 -U "$CLIENT_NAME" -d "$CLIENT_NAME" --format=custom --compress=3 --file="/backups/backup_$(date +%F).dump"

# Nettoyage des anciens backups
find /backups -type f -mtime +7 -delete
