#!/bin/sh
#
# Purge des données analytics de plus de $RETENTION pour chaque client.
#
# Lit les fichiers $ENV_DIR/.env.<client> (CLIENT_NAME, DB_PASSWORD) et se
# connecte à la base <client> avec l'utilisateur <client> via pgbouncer.
#
# Variables :
#   ENV_DIR      dossier contenant les .env.<client>   (défaut : /envs)
#   PGB_HOST     hôte pgbouncer                        (défaut : pgbouncer_global)
#   PGB_PORT     port pgbouncer                        (défaut : 6432)
#   RETENTION    durée de conservation (interval SQL)  (défaut : 2 years 2 months)
#   BATCH_SIZE   lignes supprimées par transaction     (défaut : 10000)
#   DRY_RUN      1 = compte les lignes sans supprimer  (défaut : 0)
#   CLIENTS      liste de clients à traiter, séparés par des espaces (défaut : tous)

ENV_DIR="${ENV_DIR:-/envs}"
PGB_HOST="${PGB_HOST:-pgbouncer_global}"
PGB_PORT="${PGB_PORT:-6432}"
RETENTION="${RETENTION:-2 years 2 months}"
BATCH_SIZE="${BATCH_SIZE:-10000}"
DRY_RUN="${DRY_RUN:-0}"
CLIENTS="${CLIENTS:-}"

# table:clé primaire, tables filles d'abord (pas de FK en BDD, relationMode = "prisma")
TABLES="event_data:event_data_id session_data:session_data_id revenue:revenue_id website_event:event_id session:session_id"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') $*"
}

# Lit une variable dans un fichier .env sans l'exécuter (pas de `source`)
env_value() {
    sed -n "s/^[[:space:]]*$2[[:space:]]*=[[:space:]]*//p" "$1" | tail -n 1 | tr -d '\r' | sed -e 's/^"\(.*\)"$/\1/' -e "s/^'\(.*\)'$/\1/"
}

# psql -X : ignore ~/.psqlrc, -tA : sortie brute, ON_ERROR_STOP : code retour != 0 en cas d'erreur SQL
run_sql() {
    psql -X -q -tA -v ON_ERROR_STOP=1 -h "$PGB_HOST" -p "$PGB_PORT" -U "$DB_USER" -d "$DB_NAME" "$@"
}

purge_table() {
    table="$1"
    pk="$2"

    # Une session n'est supprimée que si plus aucun événement ne la référence
    extra=""
    if [ "$table" = "session" ]; then
        extra="AND NOT EXISTS (SELECT 1 FROM website_event we WHERE we.session_id = t.session_id)"
    fi

    if [ "$DRY_RUN" = "1" ]; then
        count=$(run_sql -v cutoff="$CUTOFF" <<SQL
SELECT count(*) FROM $table t WHERE t.created_at < :'cutoff'::timestamptz $extra;
SQL
        ) || return 1
        log "[$DB_NAME] $table : $count ligne(s) à supprimer (dry-run)"
        return 0
    fi

    total=0
    while :; do
        # Chaque lot est une transaction autocommit : compatible pgbouncer en pool_mode transaction
        deleted=$(run_sql -v cutoff="$CUTOFF" -v batch="$BATCH_SIZE" <<SQL
WITH d AS (
    DELETE FROM $table WHERE $pk IN (
        SELECT t.$pk FROM $table t WHERE t.created_at < :'cutoff'::timestamptz $extra LIMIT :batch
    )
    RETURNING 1
)
SELECT count(*) FROM d;
SQL
        ) || return 1
        total=$((total + deleted))
        [ "$deleted" -lt "$BATCH_SIZE" ] && break
    done
    log "[$DB_NAME] $table : $total ligne(s) supprimée(s)"
}

purge_client() {
    env_file="$1"
    DB_NAME=$(env_value "$env_file" CLIENT_NAME)
    DB_USER="$DB_NAME"
    PGPASSWORD=$(env_value "$env_file" DB_PASSWORD)
    export PGPASSWORD

    if [ -z "$DB_NAME" ] || [ -z "$PGPASSWORD" ]; then
        log "[$(basename "$env_file")] CLIENT_NAME ou DB_PASSWORD absent, ignoré"
        return 0
    fi

    if [ -n "$CLIENTS" ] && ! echo " $CLIENTS " | grep -q " $DB_NAME "; then
        return 0
    fi

    # Date limite figée une fois par client pour que toutes les tables soient cohérentes
    CUTOFF=$(run_sql -v retention="$RETENTION" <<SQL
SELECT now() - :'retention'::interval;
SQL
    ) || { log "[$DB_NAME] ERREUR connexion via $PGB_HOST:$PGB_PORT"; return 1; }

    log "[$DB_NAME] suppression des données antérieures au $CUTOFF"

    for entry in $TABLES; do
        purge_table "${entry%%:*}" "${entry#*:}" || { log "[$DB_NAME] ERREUR sur ${entry%%:*}"; return 1; }
    done
}

main() {
    log "Début purge (rétention : $RETENTION, dry-run : $DRY_RUN)"

    status=0
    found=0
    for env_file in "$ENV_DIR"/.env.*; do
        [ -f "$env_file" ] || continue
        found=1
        purge_client "$env_file" || status=1
    done

    [ "$found" = "1" ] || { log "Aucun fichier .env.* dans $ENV_DIR"; status=1; }

    log "Fin purge (statut : $status)"
    return $status
}

# Verrou : empêche deux purges simultanées si une exécution dépasse 24h
exec 9>/tmp/purge.lock
flock -n 9 || { log "Purge déjà en cours, abandon"; exit 1; }

main
