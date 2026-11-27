# Standalone specification acceptance matrix

Reference: `01_Interactive_Gantt_Chart.docx` v1.0. Scope: standalone CAS Gantt; the user chose the easiest built-in login, local demo storage and mock billing. Bidlark deployment is deferred. The document is a specification, not permission to publish customer data or charge payments. Optional recurrence and the unattached Plan 03 are excluded.

v0.3 implements the standalone feature areas below. Evidence distinguishes automated component/API acceptance from representative browser checks. This is not a claim of a certified WCAG audit, independent security assessment, or production provider acceptance. See [verification](VERIFICATION.md) for the measured environment and public-release status.

| Area | Implemented scope | Verification |
| --- | --- | --- |
| Core | CRUD/archive, nested WBS/rollups (50-level guard), tags/custom fields, duplicate sections/tasks, traced quantity splits | Advanced scheduling tests; keyboard inspector and template browser checks |
| Grid | Show/pin/reorder/resize columns, sorting/filtering/grouping, saved views, arrows/Enter, selection, bulk changes, CSV clipboard | Browser filtering/keyboard edit; mapped import tests; schema/build checks |
| Timeline | Day/week/month/quarter/year scales, project-calendar shading/today, arrows, milestone/summary/progress/actual/baseline/critical bars, virtual rows/time, drag/resize and keyboard alternatives | Browser 1,000-task render/filter; scheduling tests; responsive review |
| Inspector | Dates, work mode/calendar, constraints, assignments/materials/holds, production/time, descriptions/tags/fields, predecessor/successor, comments/files | Domain tests; browser edit/preview/apply/reload; collaboration API tests |
| Templates | Five built-ins, wizard, organization templates | Five-template unit test; browser five-section wizard; tenant-scoped template API test |
| Calendars | IANA project zone, user event-display zone, 5/6/7 days, shifts, exceptions, holidays/blackouts, exact-entry policy, minutes | Calendar/legacy/DST tests, inverse minute arithmetic; validated settings forms |
| Logic / CPM | FS/SS/FF/SF and unit lag, cycles/topology, manual/auto, hard/date-limit constraints, total/free float, critical path and conflict warnings | Original and advanced engine suites; worker equivalence |
| Control | Immutable attributed/reasoned baselines, forecast/actual/work-minute variance, dependency changes, milestone identification, author history/restore, approve/publish | Baseline/approval/version API tests; browser persistence/report checks |
| Construction | Typed area/material/inspection/permit/RFI/access/approval holds, unconfirmed delivery forecasts, explicit approval evidence, traced partial splits | Hold authorization, shortage and split tests; EPCC undated placeholders |
| Resources / materials | Capacity, skills, assignments, actual time, overload table/histogram, material line IDs/quantities/readiness | Capacity/effort and aggregate-shortage tests; procurement-only authorization tests |
| Scenarios | Separate project branch and comparison; crew/calendar/material assumptions remain isolated | Scenario isolation tests and portfolio UI |
| Collaboration | Five roles, tenant scopes, snapshot shares/expiry/revocation, activity/history, mentions/notifications, comments/files, optimistic concurrency | Real PostgreSQL tenant, role, concurrent/stale-write, file and notification suites |
| Reporting / import | Real paginated PDF, XLSX/CSV/JSON, baseline/lookahead2/3/6/milestone/CPM reports, CSV/XLSX mapping/errors/duplicate policies/matching-ID updates | XLSX round trip, invalid-date previews, real PDF parsing/render inspection, browser queued PDF download |
| API / data | Versioned contracts, shared Zod validation, scoped relational projections/FKs, viewport fetch, task/baseline APIs, async queue, idempotent apply | PostgreSQL suite; viewport/baseline/queue tests; [API contract](API.md) |
| Identity / storage | Username/password, offline recovery, MFA, owner/member controls, optional OIDC mapping and S3 storage | Password/MFA/recovery/tenant/local-file tests. External OIDC/S3 provider connections are configurable and untested live; not needed for demo |
| Demo operations | Mock entitlement lifecycle, privacy, portable Docker, checksum migrations, database+file backups, restore, optional redacted request logs, support runbook | Docker health/start, secret preservation, synthetic write/reload, isolated database restore and attachment recovery |
| Integration boundary | Independent engine/domain/reporting/client/identity modules, documented future shell adapter | Shared code imports/build; architecture ADR. Bidlark remains deferred |

The browser acceptance is representative, not exhaustive across every device/provider. Production launch remains a separate gate: real-world acceptance, operator retention/off-host backup policy, provider-specific OIDC/S3 checks if enabled, and live billing only if later requested. None is silently claimed complete by a green unit suite.
