#!/bin/bash
set -euo pipefail
umask 077
backup_dir=/var/backups/cas-gantt
mkdir -p "$backup_dir"
backup_file="$backup_dir/cas-gantt-$(date -u +%Y%m%dT%H%M%SZ).dump"
trap 'rm -f "$backup_file.tmp"' EXIT
docker exec cas-gantt-db pg_dump -U cas_gantt -d cas_gantt -Fc > "$backup_file.tmp"
test -s "$backup_file.tmp"
docker exec -i cas-gantt-db pg_restore --list < "$backup_file.tmp" > /dev/null
mv "$backup_file.tmp" "$backup_file"
# Retain fourteen days of this service's own completed backups.
find "$backup_dir" -maxdepth 1 -name 'cas-gantt-*.dump' -type f -mtime +14 -delete
printf 'CAS Gantt database backup completed.\n'
