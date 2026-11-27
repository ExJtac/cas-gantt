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

The app assumes the external API path `/Ghannt/api/v1` and cookie path `/Ghannt/`. Preserve them when changing domains. API responses set `no-store`. Do not log request bodies, cookies, or share-token URL paths. Set `GANTT_LOG_REQUESTS=enabled` for structured request IDs, route patterns, status and duration. Bodies, cookies and URL parameters are excluded. Failed and completed worker results expire after 24 hours; project revision history does not. Review any proxy logging policy separately.

`deploy/install-server.sh` is the **CAS-TX first-install procedure**, not a generic installer. It refuses existing credentials, checks port/container conflicts, creates its own PostgreSQL container/volume/user, and installs the dedicated API and backup units. Read/adapt it before use. Later releases should retain the database and rotate only the code symlink and static root. Do not rerun initial installation.

## Backups and recovery

The supplied backup job creates a PostgreSQL custom-format dump and a matching archive of local attachments daily, validates both archives, and keeps fourteen days under root-only `/var/backups/cas-gantt`. It pauses this application’s API while copying so file references and objects agree. Preserve `/etc/cas-gantt/api.env` separately in encrypted storage; do not put plaintext credentials in ordinary backups. This is an on-host backup, not disaster recovery. Configure encrypted off-host copies and monitoring before storing irreplaceable customer data. JSON exports provide an additional per-project portable copy.

To test a backup without altering live data, create a separate temporary PostgreSQL database, restore the custom dump into it using `pg_restore --no-owner --exit-on-error`, check schema/row counts, and then remove only that temporary database. Production restoration must be planned: stop API writes, retain a pre-restore backup, restore to a new database, verify records and point the service at it. Never blindly overwrite the live database.

## Identity, data and operating limits

Username/password accounts are the default. Users can generate single-use offline recovery codes and optionally enable authenticator-app MFA. Recovery requires a previously generated code; no recovery email is sent. Optional OIDC maps issuer/subject identities to independent accounts and workspace memberships. Invitation links are copied manually; the app sends no messages. Owners can change member roles and remove access. Ownership transfer is an explicit API operation documented in the API contract; there is no self-service account deletion UI. Follow the support runbook for verified deletion requests.

Registration and login are rate limited per client IP in one API process; limits reset when it restarts. Membership is checked on every request. Tenant query scoping and composite foreign keys provide isolation; PostgreSQL RLS is not enabled. Revision history is retained until an operator applies an agreed retention policy. Monitor storage, backup age and service health. Mock subscriptions simulate entitlements only; they do not collect or charge payments.

## Portable Docker installation (current development)

The repository root now contains Dockerfile, compose.yaml and `npm run setup`. See README for the complete tested path. Setup creates private random secrets and preserves existing files. Containers use a dedicated network and named database/file volumes. Only the web port is published, bound to 127.0.0.1 by default. Node binds 0.0.0.0 *inside* its API container; do not publish that API port directly.

Some Homebrew installations provide the standalone `docker-compose` executable without exposing `docker compose`. Use `docker-compose` in place of `docker compose`, or configure Docker's official Compose CLI plugin. This is a prerequisite distinction, not an application error.

For public hosting, keep the local web port behind your HTTPS reverse proxy, set the exact HTTPS GANTT_PUBLIC_ORIGIN and NODE_ENV=production, and recreate the API service. Keep the `/Ghannt/` prefix. Do not expose PostgreSQL to the public network. The CAS demo uses username/password and local attachment storage; optional integrations are not required.

### Optional OIDC and S3

Use a private `compose.override.yaml` (do not commit real secrets). Add optional variables to `services.api.environment` explicitly. For example, reference `${GANTT_OIDC_ISSUER}`, `${GANTT_OIDC_CLIENT_ID}` and `${GANTT_OIDC_CLIENT_SECRET}` after privately setting them in .env. Register the callback `https://your-domain/Ghannt/api/v1/auth/oidc/callback`. The adapter validates signed identity tokens, issuer/audience through discovery, browser-bound state, nonce and PKCE. It creates a separate mapped identity; organization invitations grant membership. No unsafe shared cookies with Bidlark are assumed.

For S3-compatible attachments, provide bucket, region, endpoint and SDK credentials through the API environment or the provider's supported credential chain. Grant only the bucket/prefix operations needed to read/write objects. The configured service chooses S3 for new files; historical files retain their recorded storage kind. Migrate existing files explicitly and verify hashes before changing metadata. Back up the bucket independently.

### MFA key and attachments on systemd hosts

Generate GANTT_ENCRYPTION_KEY once as 32 random bytes encoded in hex, store it in the root-only API environment file, and retain it across releases/backups. Do not regenerate it on upgrade. For local files, set GANTT_FILE_DIRECTORY=/var/lib/cas-gantt/attachments, create that path owned by the service account, and add `ReadWritePaths=/var/lib/cas-gantt` to the service sandbox. Back up that directory in addition to PostgreSQL. These are dedicated CAS Gantt paths.

See PRIVACY.md and SUPPORT_RUNBOOK.md before inviting users to a non-demo deployment.
