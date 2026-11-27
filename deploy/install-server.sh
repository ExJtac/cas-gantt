#!/bin/bash
# First installation on the CAS-TX host. Requires a reviewed, built source
# release at /opt/cas-gantt/releases/<release>. Refuses existing credentials.
set -euo pipefail
release=${1:?Pass the prepared release name}
[[ "$release" =~ ^cas-gantt-[a-zA-Z0-9-]+$ ]]
release_dir="/opt/cas-gantt/releases/$release"
test -f "$release_dir/server/index.ts"
test -f "$release_dir/node_modules/tsx/dist/cli.mjs"
test ! -e /etc/cas-gantt/api.env
if ss -ltn | grep -Eq ':(4318|5436)[[:space:]]'; then echo 'CAS Gantt ports are occupied.' >&2; exit 1; fi
if docker container inspect cas-gantt-db >/dev/null 2>&1; then echo 'CAS Gantt database already exists.' >&2; exit 1; fi
id cas-gantt >/dev/null 2>&1 || useradd --system --home-dir /nonexistent --shell /usr/sbin/nologin cas-gantt
install -d -m 700 /etc/cas-gantt /var/backups/cas-gantt
python3 - <<'PY'
import secrets, pathlib, os
secret=secrets.token_hex(32)
files={
 'database.env':f'POSTGRES_USER=cas_gantt\nPOSTGRES_DB=cas_gantt\nPOSTGRES_PASSWORD={secret}\n',
 'api.env':f'GANTT_DATABASE_URL=postgres://cas_gantt:{secret}@127.0.0.1:5436/cas_gantt\nGANTT_PUBLIC_ORIGIN=https://cas-tx.com\nGANTT_PORT=4318\nGANTT_REGISTRATION=enabled\nNODE_ENV=production\n'}
for name,data in files.items():
 p=pathlib.Path('/etc/cas-gantt')/name
 with p.open('x') as f: f.write(data)
 os.chmod(p,0o600)
PY
docker volume create cas-gantt-pgdata >/dev/null
docker run -d --name cas-gantt-db --restart unless-stopped --memory 512m --cpus 1 \
 --env-file /etc/cas-gantt/database.env -p 127.0.0.1:5436:5432 \
 -v cas-gantt-pgdata:/var/lib/postgresql/data --log-opt max-size=10m --log-opt max-file=3 \
 postgres:16 postgres -c max_connections=40 -c shared_buffers=128MB >/dev/null
for attempt in $(seq 1 30); do
 if docker exec cas-gantt-db pg_isready -U cas_gantt -d cas_gantt >/dev/null 2>&1; then break; fi
 sleep 1
done
docker exec cas-gantt-db pg_isready -U cas_gantt -d cas_gantt
ln -s "$release_dir" /opt/cas-gantt/current
install -m 644 "$release_dir/deploy/cas-gantt-api.service" /etc/systemd/system/
install -m 755 "$release_dir/deploy/backup.sh" /usr/local/sbin/cas-gantt-backup
install -m 644 "$release_dir/deploy/cas-gantt-backup.service" "$release_dir/deploy/cas-gantt-backup.timer" /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now cas-gantt-api.service cas-gantt-backup.timer
for attempt in $(seq 1 20); do
 if curl -fsS http://127.0.0.1:4318/api/v1/health; then break; fi
 sleep 1
done
curl -fsS http://127.0.0.1:4318/api/v1/health
/usr/local/sbin/cas-gantt-backup
