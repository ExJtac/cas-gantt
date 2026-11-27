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


## v0.3.0 — standalone planning release

Published November 27, 2026 UTC. Public promotion and app URLs are unchanged. Runtime source: `4263f5ae7f72d95cce3507b17d252ec12e3679c5`; [GitHub CI passed](https://github.com/ExJtac/cas-gantt/actions/runs/45957090494) with PostgreSQL 16. Later documentation-only commits record this deployment; the runtime artifacts remain this reviewed source build.

- Static release: `/var/www/cas-gantt/releases/cas-gantt-20261127-v030`.
- API release: `/opt/cas-gantt/releases/cas-gantt-20261127-v030`, selected by `/opt/cas-gantt/current`.
- Rollback/configuration evidence: `/home/deploy/cas-gantt-backups/cas-gantt-20261127-v030`, root-only. Keep private environment backups private.
- Local files: `/var/lib/cas-gantt/attachments`, writable only by the dedicated service. The service now permits this path under its filesystem sandbox. The MFA encryption key is retained in the private API environment; mock billing is enabled and cannot charge money. OIDC/S3 remain unconfigured.
- Pre-upgrade backup restored into a disposable database; both migrations and a repeated migration run passed before activation. Existing database/credentials were preserved. The database had zero projects before acceptance; one clearly named synthetic verification project was created afterward.
- Live registration/login, create/save/reload, dependency recalculation, stale-write rejection, baselines, comments, attachment roundtrip, templates, queued CSV/XLSX/PDF/JSON, approval/publication, share revocation and cross-tenant denial passed. Browser sign-in and queued PDF download passed. Static JS/CSS hashes match the local build; API health reports 0.3.0.
- Updated `/usr/local/sbin/cas-gantt-backup` now backs up database **and** attachments, pausing only CAS Gantt's API for a consistent pair. Daily timer remains active. Backup `cas-gantt-20261127T071654Z.dump` and its matching attachment archive restored into an isolated database/directory: 1 project, 2 tasks and 1 attachment, with byte-for-byte file comparison. Only disposable restore data was removed.
- API was active with zero automatic restarts. CAS and Bidlark homepages returned HTTP 200. No other application was restarted. The main Caddyfile remained SHA-256 `1edfa98d0278d68bfeb6f60dd2e0397b29d30d08aada9b304a62913accbc7f65`; only the dedicated Gantt include changed (SHA-256 `63650de990f59e1d845e7c65bab2786661a43c343aba4451f46314b06446c518`). Existing CAS catalog and sitemap were preserved.

For rollback, preserve the current database, attachments and encryption key first. The prior code/static release and scoped include remain available, but v0.2 cannot safely edit all v0.3 data: review schema/data compatibility before changing the API symlink. Prefer a forward fix or temporary maintenance over permitting old code to rewrite newer projects. Never restore the historic whole Caddyfile over unrelated current host changes. Do not overwrite production data with a backup without an explicit recovery decision. On-host backups still do not protect against loss of the host.
