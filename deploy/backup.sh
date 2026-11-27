#!/bin/bash
set -euo pipefail
umask 077
backup_dir=/var/backups/cas-gantt
mkdir -p "$backup_dir"
backup_prefix="$backup_dir/cas-gantt-$(date -u +%Y%m%dT%H%M%SZ)"
was_active=false
if systemctl is-active --quiet cas-gantt-api; then was_active=true; systemctl stop cas-gantt-api; fi
cleanup() {
  rm -f "$backup_prefix.dump.tmp" "$backup_prefix.attachments.tar.gz.tmp"
  if "$was_active"; then systemctl start cas-gantt-api; fi
}
trap cleanup EXIT
docker exec cas-gantt-db pg_dump -U cas_gantt -d cas_gantt -Fc > "$backup_prefix.dump.tmp"
test -s "$backup_prefix.dump.tmp"
docker exec -i cas-gantt-db pg_restore --list < "$backup_prefix.dump.tmp" > /dev/null
# Dedicated local object storage, never another application's directory.
tar -czf "$backup_prefix.attachments.tar.gz.tmp" -C /var/lib/cas-gantt attachments
tar -tzf "$backup_prefix.attachments.tar.gz.tmp" > /dev/null
mv "$backup_prefix.dump.tmp" "$backup_prefix.dump"
mv "$backup_prefix.attachments.tar.gz.tmp" "$backup_prefix.attachments.tar.gz"
find "$backup_dir" -maxdepth 1 -name 'cas-gantt-*.dump' -type f -mtime +14 -delete
find "$backup_dir" -maxdepth 1 -name 'cas-gantt-*.attachments.tar.gz' -type f -mtime +14 -delete
printf 'CAS Gantt database and attachment backup completed.\n'
