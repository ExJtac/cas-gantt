# Deployment record

CAS Gantt v0.1.0 was published November 26, 2026 (America/Denver).

- Public promotion: https://cas-tx.com/Ghannt/ (the requested no-slash path redirects here).
- Public standalone editor: https://cas-tx.com/Ghannt/app/.
- Public MIT source: https://github.com/ExJtac/cas-gantt.
- The CAS-TX open-source catalog links to the promotion page, and its sitemap includes the new canonical URL.

The initial source commit was `be6ba80`. Release directory: `/var/www/cas-gantt/releases/cas-gantt-20261126-v010`. Caddy imports `/etc/caddy/cas-gantt.caddy` inside the existing cas-tx.com block. No product application service, database, customer upload store, DNS record or Bidlark source changed.

The release procedure verified SHA-256 preconditions for the live Caddy config, open-source catalog and sitemap. It installed a new immutable static directory, validated Caddy before reloading, added one catalog card, and added one sitemap URL. Existing files were backed up under `/home/deploy/cas-gantt-backups/cas-gantt-20261126-v010`.

## Rollback

Restore `Caddyfile`, `open-source.html` and `sitemap.xml` from that backup directory to their original locations, then validate/reload Caddy. Original catalog and sitemap live under `/var/www/cas-tx-redesign/releases/cas-20261114-edef4a3/`. Keep the static release for investigation. No database restore is involved.

## Future releases

Build and validate in this independent repository. Use a new release directory and update the Gantt include's root after validation, preserving old release directories for rollback. Preserve the CAS catalog card and sitemap URL when publishing later versions of the main CAS website. Do not run the initial `prepare-public.mjs` over an already-registered Gantt handler; it intentionally refuses that case.

## v0.2.0 — server workspaces

Published November 26, 2026 (local time; November 27 UTC) at the same promotion/app URLs. New immutable release: `/var/www/cas-gantt/releases/cas-gantt-20261126-v020`. API source: `/opt/cas-gantt/releases/cas-gantt-20261126-v020`, selected by `/opt/cas-gantt/current`.

Dedicated components: systemd `cas-gantt-api` under unprivileged `cas-gantt`, loopback port 4318; PostgreSQL 16 container `cas-gantt-db`, volume `cas-gantt-pgdata`, loopback port 5436, database/user `cas_gantt`. Credentials are root-only under `/etc/cas-gantt/` and never included in the repository. No existing application's database or service is reused.

Only `/etc/caddy/cas-gantt.caddy` changed during activation; the main Caddyfile SHA-256 remained `9758706faf2821bf353b5b1e80819147d6a54fa3e753ff099d7e2f71b9d0cd75`. The new include proxies `/Ghannt/api/*` and serves the new static release. Backup of the old include: `/home/deploy/cas-gantt-backups/cas-gantt-20261126-v020/cas-gantt.caddy`. Caddy validated before reload. No other application service was restarted, no DNS changed, and the existing CAS catalog/sitemap were retained.

`cas-gantt-backup.timer` runs daily at approximately 04:25 UTC with jitter; dumps are root-only under `/var/backups/cas-gantt`, with fourteen-day retention. The initial dump was restored to a new temporary database and all 11 tables verified. No production user/QA fixture was seeded. These on-host backups do not cover host loss. The host had approximately 19 GB free at installation; storage monitoring and off-host retention remain operational work.

Rollback the web release by restoring the backed-up Gantt include, validating and reloading Caddy. Retain the new database/volume, code and dumps: **do not delete server data** when rolling back the UI. The old v0.1 app has no server controls. If the API is stopped during investigation, preserve its credentials and database. Later backend migrations must be reviewed before reusing old code against newer schema versions.
