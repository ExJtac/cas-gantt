# Public static release

The CAS Gantt editor is a static bundle under `/Ghannt/app/`; the promotion page is `/Ghannt/`. A scoped Caddy import serves only these paths. All other CAS routes, application services, data stores and Bidlark handlers remain intact.

`prepare-public.mjs <release-name>` packages the already-built `dist/`, creates a Caddy candidate, adds one card to the existing CAS open-source catalog and adds one sitemap URL. It requires exact current snapshots in ignored `artifacts/`: `Caddyfile.before`, `open-source.before.html`, `sitemap.before.xml`. It emits SHA-256 preconditions and refuses to prepare over an existing staged release. The snapshots must come from the live host, not an old local marketing checkout.

Before installing: inspect the diff, compare remote hashes with those preconditions, back up all three live files, transfer the new immutable release directory, validate the candidate Caddy configuration, then replace/reload only the relevant static files and Caddy configuration. Do not restart application services or change DNS. Verify the two new paths, assets, catalog link, sitemap, existing CAS homepage and Bidlark availability.

Rollback: restore the three backed-up files and reload Caddy. This restores previous routing, catalog and sitemap without touching any app database. Keep the release directory for investigation. The release record in docs/DEPLOYMENT.md identifies actual paths and verification.

## v0.2 server release

The initial static registration above is historical. Do not rerun `prepare-public.mjs` over an existing handler. See `docs/SELF_HOSTING.md` and `docs/DEPLOYMENT.md` for the server layout. `install-server.sh` is a first-install procedure that refuses existing credentials/container/ports; new releases preserve the dedicated database, install new immutable code/static paths, and update the Gantt include/code symlink only. The supplied service and backup units are scoped to CAS Gantt.
