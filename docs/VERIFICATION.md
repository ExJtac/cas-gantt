# Verification

## v0.3 hosted acceptance — November 27, 2026 UTC

The CAS promotion page, frontend and API now serve v0.3. The [release CI](https://github.com/ExJtac/cas-gantt/actions/runs/45957090494) passed all checks on PostgreSQL 16. The full HTTP smoke workflow below was repeated on HTTPS with only a synthetic account/project; all checks passed. The public browser also completed username/password sign-in and downloaded a queued PDF. At a 390px viewport the document width was 388px (no document overflow); navigation and Quick guide were accessible. Desktop toolbar spacing and task dates were visually reviewed. A fresh live database+file backup restored successfully with matching attachment bytes. See [deployment details](DEPLOYMENT.md) for source, release directories and rollback limits.

Raw evidence remains ignored: live-release-smoke.log, v030-stage.log, v030-activate.log, v030-backup-restore.log, v030-live-headers.log and live-release-report files. Synthetic account credentials are private and untracked.

## v0.3 release review — November 27, 2026

- 87 tests passed with real PostgreSQL, zero failed/skipped; TypeScript and production build passed. Six added regressions cover copied approvals/actuals, template baseline references, local approval invalidation, inherited material gates, procurement preview/apply rescheduling and inherited-hold authorization.
- Browser review verified the new Quick guide and simplified task inspector: task name, start and duration → review → apply → reload, preserving November 30–December 2 dates. Advanced options are collapsed by default. Default columns now expose both start and finish; timeline labels adapt to zoom. Fixed overlapping toolbar fields observed at desktop width.
- Full HTTP acceptance through the rebuilt Docker stack verified registration/login, project creation, dependency scheduling, preview/apply/reload, stale-write rejection, baseline capture, comments, attachment upload/download, saved template, all four queued export formats, approval/publication, share revocation and cross-tenant denial. Synthetic fixtures only. Raw logs: ignored artifacts/release-tests.log, release-build.log and local-release-smoke.log.

## v0.3 local standalone acceptance — November 26, 2026

Environment: Apple M1 Pro, 16 GB RAM, macOS arm64, Node 22.22.2; in-app Chromium browser; Docker 29.5.2 and standalone Compose 5.3.0. Database suites use isolated schemas in a dedicated PostgreSQL 14 test database. The portable installation and restore use PostgreSQL 16 in Docker.

- **81 tests passed, zero failed/skipped** with GANTT_TEST_DATABASE_URL set. The original scheduling/security suites plus advanced tests cover minute/shift calendars, exceptions, hard/manual constraints, CPM, WBS, holds/material totals, splits/scenarios/templates, CSV/XLSX, PDF pagination, worker determinism, database projections/FKs, comments/files/templates, procurement, queued reports, baseline/viewport APIs, approval invalidation, role-downgraded job access and MFA/recovery. Invalid hierarchy/blackout/resource references are rejected.
- **Build passed:** TypeScript and production Vite. Large export/font libraries are loaded on demand; Vite reports a chunk-size warning. It is not a failed build. Dependency audit at this revision's dependency set reports **zero known vulnerabilities**; this is not an independent security assessment.
- **Documented installation exercised:** npm setup generated private secrets, a second setup preserved them byte-for-byte, Docker built/started three dedicated services, database/API became healthy, and the browser loaded the app at localhost:8080/Ghannt/app/. A synthetic account and projects persisted through container rebuilds.
- **Browser end-to-end:** simple sign-in, 1,000-task load, search, keyboard Enter inspector, progress edit, async preview, explicit apply, reload with the saved 25% value, template wizard with five sections, Reports and queued PDF download, settings navigation. Unit tests separately verify the corrected Awaiting Approval status for new template placeholders.
- **Measured browser check:** 1,000 tasks spanning November 2026–February 2027; 24 rows mounted, filtering to task 1000 took about **31 ms** elapsed in CDP metrics, with **5.2 ms script time** and **23 ms total task time**. API creation of the fixture took **769 ms**. These are single-run observations on this machine, not universal performance guarantees. The 1,000-node chained engine benchmark took about 59 ms for two calculations in the expanded engine.
- **PDF inspection:** generated the EPCC synthetic schedule, rendered with Poppler and inspected the page. Fixed column-heading alignment, added week-axis labels and forecast finish/actual lines. Verified the multiplication/dimension glyphs and no row overlap. Separate test confirms a multi-page export.
- **Responsive/keyboard review:** 390px viewport showed a mobile navigation regression caused by old positional CSS hiding Schedule. Fixed it with a horizontally scrollable, labeled navigation bar. Settings and Schedule then remained accessible, with document width equal to viewport width (375px content after scrollbar). Inspector inputs remain the non-drag editing path. Status text chooses a contrasting black/white foreground; muted text contrast was increased. This is WCAG-minded implementation, not a full WCAG certification.
- **Backup recovery:** stopped this demo's web ingress, dumped PostgreSQL and archived attachments, restarted ingress, restored into separate cas_gantt_restore_check. Verified **3 projects, 1,020 tasks and 1 attachment**, recovered the synthetic attachment contents, and removed only the disposable restore database. No live database was overwritten.

Raw local evidence is in ignored artifacts/full-tests.log, full-build.log, full-audit.json, full-compose.log, backup-check.log, install-qa.json and report-acceptance.pdf/png. Dumps and private environment files must stay untracked. Reproduce with the README commands. The public deployment record is separate; local success does not claim a new hosted release.

External OIDC/S3 configurations remain operator-specific acceptance, since the CAS demo uses neither. Production billing, Bidlark integration, independent security review and exhaustive browser/assistive-technology coverage are not claimed.

## Historical verification

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
