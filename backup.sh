#!/bin/sh
#
# Backup quotidien de la base de chaque client.
#
# Lit les fichiers $ENV_DIR/.env.<client> (CLIENT_NAME, DB_PASSWORD), dumpe la
# base <client> via pgbouncer dans $BACKUP_DIR/<client>/ et ne garde que les
# $KEEP derniers dumps.
#
# Variables :
#   ENV_DIR      dossier contenant les .env.<client>   (défaut : /envs)
#   BACKUP_DIR   dossier racine des backups            (défaut : /backups)
#   PGB_HOST     hôte pgbouncer                        (défaut : pgbouncer_global)
#   PGB_PORT     port pgbouncer                        (défaut : 6432)
#   KEEP         nombre de dumps conservés par client  (défaut : 5)
#   CLIENTS      liste de clients à traiter, séparés par des espaces (défaut : tous)
#
# Restauration : pg_restore --no-owner --no-privileges -h <host> -p <port> -U <client> -d <client> <fichier.dump>

ENV_DIR="${ENV_DIR:-/envs}"
BACKUP_DIR="${BACKUP_DIR:-/backups}"
PGB_HOST="${PGB_HOST:-pgbouncer_global}"
PGB_PORT="${PGB_PORT:-6432}"
KEEP="${KEEP:-5}"
CLIENTS="${CLIENTS:-}"

# Les dumps contiennent des données clients : lisibles par root uniquement
umask 077

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') $*"
}

# Lit une variable dans un fichier .env sans l'exécuter (pas de `source`)
env_value() {
    sed -n "s/^[[:space:]]*$2[[:space:]]*=[[:space:]]*//p" "$1" | tail -n 1 | tr -d '\r' | sed -e 's/^"\(.*\)"$/\1/' -e "s/^'\(.*\)'$/\1/"
}

backup_client() {
    env_file="$1"
    client=$(env_value "$env_file" CLIENT_NAME)
    PGPASSWORD=$(env_value "$env_file" DB_PASSWORD)
    export PGPASSWORD

    if [ -z "$client" ] || [ -z "$PGPASSWORD" ]; then
        log "[$(basename "$env_file")] CLIENT_NAME ou DB_PASSWORD absent, ignoré"
        return 0
    fi

    if [ -n "$CLIENTS" ] && ! echo " $CLIENTS " | grep -q " $client "; then
        return 0
    fi

    dir="$BACKUP_DIR/$client"
    file="$dir/actistat_${client}_$(date '+%Y-%m-%d_%H%M').dump"
    tmp="$dir/.$(basename "$file").tmp"
    mkdir -p "$dir" || return 1

    # Dump écrit dans un fichier temporaire : un dump incomplet ne remplace jamais un bon
    if ! pg_dump -h "$PGB_HOST" -p "$PGB_PORT" -U "$client" -d "$client" \
        --format=custom --compress=6 --file="$tmp"; then
        rm -f "$tmp"
        log "[$client] ERREUR pg_dump"
        return 1
    fi

    # Vérifie que l'archive est lisible (table des matières)
    if ! pg_restore --list "$tmp" > /dev/null; then
        rm -f "$tmp"
        log "[$client] ERREUR dump illisible"
        return 1
    fi

    mv "$tmp" "$file" || return 1
    log "[$client] $(basename "$file") ($(du -h "$file" | cut -f1))"

    # Rotation uniquement après un dump réussi ; le nom horodaté donne l'ordre chronologique
    ls -1 "$dir"/actistat_"${client}"_*.dump | sort -r | tail -n +$((KEEP + 1)) | while read -r old; do
        rm -f "$old" && log "[$client] suppression $(basename "$old")"
    done
}

main() {
    log "Début backup (conservation : $KEEP)"

    status=0
    found=0
    for env_file in "$ENV_DIR"/.env.*; do
        [ -f "$env_file" ] || continue
        found=1
        backup_client "$env_file" || status=1
    done

    [ "$found" = "1" ] || { log "Aucun fichier .env.* dans $ENV_DIR"; status=1; }

    log "Fin backup (statut : $status)"
    return $status
}

# Verrou : empêche deux backups simultanés
exec 9>/tmp/backup.lock
flock -n 9 || { log "Backup déjà en cours, abandon"; exit 1; }

main
