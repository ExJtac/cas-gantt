# CAS Gantt support and recovery runbook

## Identify the installation

Record release commit, environment (demo/staging/self-hosted), origin, affected project ID/version, time and request ID. Do not request passwords, MFA seeds, recovery codes, .env files, session cookies or customer attachments in a public issue. Ask for a synthetic reproduction and redacted logs.

## Service checks

For Compose: `docker compose ps`, `docker compose logs --tail=100 api`, and `curl --fail <origin>/Ghannt/api/v1/health`. Some Homebrew installations expose Compose as `docker-compose`; substitute that spelling consistently. For the CAS host: `systemctl status cas-gantt-api` and its scoped Caddy include. Avoid restarting unrelated applications.

Health checks query PostgreSQL. Static page success alone does not prove server persistence. Verify a synthetic edit/reload and compare the returned project version. Failed writes must show an error; keep/export the draft before any reload. Repeated requests with the same idempotency key and unchanged body must return the same write result.

## Account issues

The default login is username/password. Usernames are normalized to lowercase. Recovery uses previously generated one-use offline codes, revokes sessions and disables the lost authenticator. Generate replacement codes after recovery. OIDC accounts map issuer/subject, never unverified email equality. OIDC availability depends on the operator's configuration; test exact callback origin, state/nonce/PKCE and provider discovery.

For lost credentials with no recovery code, establish identity through the installation operator's existing process before changing an account. Do not send or publish a shared default admin password. Keep an audit of operator intervention. Owner changes require an existing owner and an existing member; verify target organization before transfer.

## Backups and restore

Back up PostgreSQL, attachments and encryption/configuration secrets separately and securely. A database-only backup is incomplete when attachments are used. Test pg_restore in a separate disposable database. Test a sample attachment and an MFA/recovery flow using synthetic data. Restore into new storage, verify counts and tenant permissions, stop writes while switching, and preserve pre-restore state for rollback.

CAS systemd backup jobs retain fourteen days on-host. Optional off-host copies must be encrypted and tested by the operator. Local disk backups do not protect against host loss. Never copy real environment files or production dumps into GitHub issues or the source repository.

## Release / rollback

1. Require relevant tests, full integration tests, build, browser acceptance and documented migration behavior.
2. Back up both data stores. Deploy to an isolated staging environment with mock billing.
3. Check health, authentication, a synthetic save/reload, an approved publication, read-only isolation and file access.
4. Promote the reviewed static/API version together. Preserve prior immutable code releases.
5. If rollback is needed, inspect migration compatibility. Restore previous routing/code only if compatible; otherwise restore to a separate database and switch after validation. Never erase named volumes to clear an error.

## Scheduling diagnostics

Review section/ancestor releases, typed approval holds, material totals, selected calendar and predecessor graph. Forecast delivery dates do not authorize work. Manual/hard-constraint conflicts remain explicit warnings. Critical path is a logic-network calculation and does not silently level resources. Date records are civil dates, not UTC timestamps; test DST changes without shifting entered dates.

## Demo billing

The simulator changes organization entitlements only when GANTT_MOCK_BILLING=enabled. It never creates charges. Test active/past-due/canceled transitions and verify that plan features do not override role authorization. No production payment launch is part of the CAS demo. A real billing adapter needs provider setup, authenticated events, duplicate-event handling and separately accepted commercial terms before activation.
