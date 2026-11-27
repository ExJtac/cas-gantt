# Verification

Environment: Node v22.22.2, macOS arm64. November 26, 2026.

Automated checks: 20 passing tests covering valid local dates and DST arithmetic; inclusive working duration; FS/SS/FF/SF, negative lag and holiday/weekend boundaries; milestone behavior; dependency cycles/missing links/duplicate IDs; section/material holds and successor propagation; EPCC placeholder sections; baseline/status invariants; JSON roundtrip/schema rejection; CSV formula neutralization; input bounds. A deterministic 1,000-task dependency chain completed two calculations in about 14 ms in the first recorded run. This is an engine benchmark, not a browser performance claim.

Production build: TypeScript typecheck and Vite build passed. npm audit reports zero known vulnerabilities at the time checked. Build logs retain two upstream Zod comment-annotation warnings; they do not affect the build result.

Browser checks through the in-app browser: task drawer; native date input; duration edit and successor impact preview; apply and persistence after reload; cancel; undo; baseline capture; cycle validation displayed in the drawer; desktop light/dark theme; 390px mobile task layout with no document horizontal overflow. Native dialog controls and labeled date/duration fields provide keyboard alternatives to drag.

Observed and fixed during QA: the date field needed input-event handling and form-value capture to ensure changes reach the preview; dark theme inherited a fixed light background; mobile icon-only navigation needed explicit accessible names. No full WCAG audit or multi-user security acceptance is claimed. Full import/export browser acceptance, 1,000-row UI performance, server concurrency/authorization and advanced commercial features remain separate acceptance work.

Raw local test/build/audit logs are copied into ignored artifacts for this release. Tests are reproducible with npm ci, npm test, npm run build.

## v0.2 server workspace acceptance — November 26, 2026

- 46 tests passed, zero skipped, with a real isolated PostgreSQL database. Tests include the scheduling suite plus migrations, tenant isolation/forged organization IDs, CSRF/origin, required expected versions, no-write preview, invalid cycles, idempotent replay, concurrent writes (one success/one conflict), structural baseline immutability, canonical new captures, publication isolation, read-only viewer permissions, invitations, held/unreleased-task restrictions, revision history/restore, membership removal, share expiry/revocation, process restart persistence, password-change session revocation and logout.
- TypeScript and production Vite build passed. npm audit reported zero known vulnerabilities at verification time. This is not a comprehensive security audit.
- Browser acceptance used a dedicated local QA database/account: sign in, create project, edit/preview/apply a task, reload persistence, publish a fixed snapshot, create/open a read-only link, revoke/reload the link, view history/team controls, and sign out. An independently applied server change caused the editor's stale preview to stop with Apply disabled and Export draft available.
- Browser testing found/fixed an empty JSON Content-Type on DELETE/logout requests. Database tests found/fixed JSONB object-key-order sensitivity in baseline comparisons. Neither issue remains in the accepted build.
- Hosted API health reports v0.2.0. Production has no seeded users or QA schedules. The public app exposes sign-in/workspace creation; the local workflow tests exercise authenticated writes without adding test accounts to production.
- On-host custom-format backup successfully restored into a separate temporary database: all 11 application tables present. The temporary restore database was removed. API and daily backup timer are active, with zero API restarts at the check. Off-host disaster recovery is still pending.

Raw logs and live HTTP evidence are retained locally in ignored `artifacts/v020-*.log` and JSON files. Core server tests ran locally on PostgreSQL 14; CI uses PostgreSQL 16, matching the hosted major version. UI checks are manual browser acceptance, not an automated end-to-end suite. Large-grid browser performance, comprehensive assistive-technology review, OIDC/recovery and the remaining commercial specification gates are not claimed complete.
