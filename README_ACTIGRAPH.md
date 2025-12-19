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


183M /var/lib/docker/volumes/moovicite_actistat-db-data
3.8G /var/lib/docker/volumes/tadao_actistat-db-data
1.5G /var/lib/docker/volumes/montstmichel_actistat-db-data
1.1G /var/lib/docker/volumes/amelys_actistat-db-data
43M /var/lib/docker/volumes/monitoring_grafana-data
1.2G /var/lib/docker/volumes/vitobus_actistat-db-data
8.7G /var/lib/docker/volumes/setram_actistat-db-data
944M /var/lib/docker/volumes/armor_actistat-db-data
8.0K /var/lib/docker/volumes/actistat_docker_actistat-db-data
302M /var/lib/docker/volumes/orep_actistat-db-data
535M /var/lib/docker/volumes/distribus_actistat-db-data
34G /var/lib/docker/volumes/grandreims_actistat-db-data
- 4.0G /var/lib/docker/volumes/aix_actistat-db-data
1.4G /var/lib/docker/volumes/azalys_actistat-db-data
984M /var/lib/docker/volumes/lisieux_actistat-db-data
1.3G /var/lib/docker/volumes/tuc_actistat-db-data
5.3G /var/lib/docker/volumes/linead_actistat-db-data
122M /var/lib/docker/volumes/alpesm_actistat-db-data
673M /var/lib/docker/volumes/monitoring_prometheus-data
2.8G /var/lib/docker/volumes/beemob_actistat-db-data
69G /var/lib/docker/volumes/
