# Self-hosting server workspaces

CAS Gantt needs Node.js 22.12+, PostgreSQL 14+ and an HTTPS reverse proxy. It has no Bidlark service dependency. Use a dedicated database and least-privilege application login. Never commit real environment files or database dumps.

## Development

Create an empty development database. Export `GANTT_DATABASE_URL` with its connection URL and `GANTT_PUBLIC_ORIGIN=http://127.0.0.1:4317`. Run `npm ci`, `npm run dev:server`, and `npm run dev` in separate terminals. Visit `http://127.0.0.1:4317/Ghannt/app/` so the path-scoped session cookie reaches API requests. The API listens only on 127.0.0.1:4318.

For full acceptance testing, create a separate database named `cas_gantt_test` and set `GANTT_TEST_DATABASE_URL`. Do not point tests at production. Tests refuse a database whose name does not end in `cas_gantt_test`, use a random schema, and remove only that schema.

## Production

Build on a checkout with `npm ci && npm run build`. Install the backend source (`server/`, `src/domain.ts`, `packages/`, package manifests) and production dependencies using `npm ci --omit=dev`. tsx is an explicit runtime dependency. Place frontend build output under `<static-root>/Ghannt/app/` and the promotion HTML under `<static-root>/Ghannt/index.html`.

Configure these environment variables in a restricted process-manager file:

| Variable | Purpose |
| --- | --- |
| GANTT_DATABASE_URL | Dedicated PostgreSQL connection URL |
| GANTT_PUBLIC_ORIGIN | Exact HTTPS origin, e.g. `https://schedule.example.com`, without trailing slash |
| NODE_ENV | `production` enables Secure cookies and requires HTTPS |
| GANTT_PORT | API loopback port, default 4318 |
| GANTT_REGISTRATION | `disabled` closes new registrations; otherwise enabled |

Use the checked-in systemd unit as a template. It runs under a dedicated unprivileged account with a read-only filesystem, resource limits and no home-directory access. Adapt paths to your host. Configure Caddy inside your chosen host block:

```caddy
@cas_gantt path /Ghannt /Ghannt/*
handle @cas_gantt {
  route {
    handle /Ghannt/api/* {
      uri strip_prefix /Ghannt
      reverse_proxy 127.0.0.1:4318
    }
    handle {
      root * /var/www/cas-gantt/current
      header X-Content-Type-Options nosniff
      header X-Frame-Options SAMEORIGIN
      header Referrer-Policy no-referrer
      header Cache-Control "public, max-age=0, must-revalidate"
      file_server
    }
  }
}
```

The app assumes the external API path `/Ghannt/api/v1` and cookie path `/Ghannt/`. Preserve them when changing domains. API responses set `no-store`. Do not log request bodies, cookies, or share-token URL paths. This release does not enable API access logging. Review any proxy logging policy separately.

`deploy/install-server.sh` is the **CAS-TX first-install procedure**, not a generic installer. It refuses existing credentials, checks port/container conflicts, creates its own PostgreSQL container/volume/user, and installs the dedicated API and backup units. Read/adapt it before use. Later releases should retain the database and rotate only the code symlink and static root. Do not rerun initial installation.

## Backups and recovery

The supplied backup job creates a PostgreSQL custom-format dump daily, validates its table-of-contents, and keeps fourteen days under root-only `/var/backups/cas-gantt`. This is an on-host backup, not disaster recovery. Configure encrypted off-host copies and monitoring before storing irreplaceable customer data. JSON exports provide an additional per-project portable copy.

To test a backup without altering live data, create a separate temporary PostgreSQL database, restore the custom dump into it using `pg_restore --no-owner --exit-on-error`, check schema/row counts, and then remove only that temporary database. Production restoration must be planned: stop API writes, retain a pre-restore backup, restore to a new database, verify records and point the service at it. Never blindly overwrite the live database.

## Early-release operational limits

No self-service forgotten-password recovery, email delivery/verification, OIDC, MFA, account deletion UI or ownership transfer yet. Invitation links are manually copied by the owner; the app sends no messages. Registration and login are rate limited per client IP in one API process; limits reset when it restarts. Membership checks happen for each request. Database query scoping and composite keys provide tenant isolation; PostgreSQL RLS is not enabled. Revision history has no retention policy yet. Monitor storage and service health as usage grows.
