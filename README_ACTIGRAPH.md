# Migration vers la version 2.20.2

## Export de l'ancienne database

### Lancer un container PostgreSQL 15 temporaire sur le serveur ActiSTAT
docker run --rm -it \
--network host \
-v $(pwd):/backup \
postgres:15 \
bash

### Extract de la database
pg_dump \
-h 127.0.0.1 \
-p <PORT_SOURCE> \
-U aix \
-F c \
-f /backup/backup_aix.dump \
aix

### Vérification du dump dans un autre container (autre terminal)
docker run --rm -v $(pwd):/backup postgres:15 \
pg_restore -l /backup/backup_aix.dump | head

## Préaparation de la nouvelle database

### Dans l'administration OVH, créer la nouvelle database et user

### Connexion au serveur PostgreSQL 15 en mode "root" (/!\ whitelist d'IP sur le serveur PostgreSQL (SRV ActiSTAT + bureau))
psql -h postgresql-ca859161-o48146f73.database.cloud.ovh.net -p 20184 -U avnadmin <database>

### Configuration de la nouvelle database
ALTER DATABASE aix OWNER TO aix;

GRANT ALL PRIVILEGES ON SCHEMA public TO aix;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON TABLES TO aix;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT ALL ON SEQUENCES TO aix;

## Import des données

### Lancement de l'import des données depuis un docker PostgreSQL 15 (même container que l'étape 1)
pg_restore \
--verbose \
--no-owner \
--no-privileges \
--single-transaction \
--exit-on-error \
-h <HOST_PRIVÉ_OVH> \
-p 5432 \
-U aix \
-d aix \
/backup/backup_aix.dump

## Mise à jour du client ActiSTAT

### Configuration PGBouncer
- fichier pgbouncer.ini
aix = host=postgresql-ca859161-o48146f73.database.cloud.ovh.net port=20184 dbname=aix
- fichier userlist.txt
"aix" "md5{ echo -n "password + user" | md5sum }"

### Relancer PGBouncer
docker exec -it pgbouncer_global   pgbouncer -R /etc/pgbouncer/pgbouncer.ini

### Compilation + Déploiement du client à jour
docker compose -p aix --env-file .env.aix up -d --build

### Checker les logs des containers (client + pgbouncer) pour vérifier la migration et la bonne connexion à la database
docker logs {ID_CONTAINER} -f
