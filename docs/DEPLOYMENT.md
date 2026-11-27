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
