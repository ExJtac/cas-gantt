# Architecture decisions

## ADR 001 — Standalone first

CAS Gantt has its own repository, accounts, database and file store outside Bidlark Ai. React/Vite is the web shell; Fastify/PostgreSQL is the optional server adapter. Browser-only mode needs no backend. CAS-TX hosts a demonstration, not a production subscription service. Bidlark integration remains explicitly deferred.

A prior read-only compatibility inspection found Bidlark uses React 18, Vite, Express, Drizzle/PostgreSQL and Firebase/OIDC-related dependencies. CAS Gantt uses React 19. Its engine has no React dependency. Reuse the versioned API/engine rather than copy an entire incompatible shell. No Bidlark code, service or data is modified by this release.

## ADR 002 — One authoritative record

The pure TypeScript scheduling engine in `packages/scheduling-engine` calculates all forecast dates, WBS rollups, dependency effects and CPM. UI, reports and server share that engine. Tasks store start plus working duration, never a separately editable competing finish. The accessible finish picker edits duration. Actual dates and immutable baseline dates are separate records.

Civil dates and shift minutes belong to the project's IANA timezone. Arithmetic uses a timezone-independent representation of civil minutes; UTC event timestamps are formatted in the user's display timezone. Day-based legacy schedules retain inclusive finishes; minute schedules use exact shift boundaries. Per-calendar exceptions, holidays and blackouts apply to working arithmetic. Manual constraints can create visible conflicts; CPM is deterministic logic analysis, not a resource-leveling promise.

## ADR 003 — Review before applying

Edits, drags, imports and scenarios produce detached candidates. Validation checks graph cycles, references, holds, section releases, calendars and domain bounds. Cancel discards the candidate. Apply saves a new revision; restores and undo also create revisions and preserve baselines. For 250+ tasks, browser and server workers calculate previews off the main thread. Server jobs carry the expected version, so queued results cannot bypass a later conflict.

Grid rows and timeline days are virtualized. The inspector provides keyboard-accessible forms for every drag operation. Saved views store presentation preferences; incoming column settings are bounded before rendering. Browser storage detects other-tab changes and reports failed persistence; it is not an offline collaborative database.

## ADR 004 — Transactional server adapter

PostgreSQL JSONB projects are authoritative snapshots. Relational sections, tasks, dependencies and other entity projections are updated in the same transaction and enforce same-project references. Sessions, roles, entitlements, publications, comments, files, templates, revisions, jobs and security events have separate tables and scoped indexes.

Apply locks the project row, checks current membership plus If-Match and candidate version, and stores the revision, before/after audit, projections and idempotent response together. Baselines compare structurally because JSONB does not retain field order. New server baselines and approvals receive server attribution. Planning changes invalidate approvals. Published snapshots remain unchanged by draft edits. Viewers resolve publications only; comments/files remain private draft collaboration. Random shared links expire/revoke and are stored hashed.

Tenant isolation is enforced in query predicates and composite foreign keys; RLS is not enabled. No arbitrary SQL is accepted. No WebSocket/live presence is claimed; clients refresh and surface version conflicts.

## ADR 005 — Identity, storage and entitlements

Built-in username/password is the simplest self-hosted path. scrypt hashes, random hashed sessions, path-scoped HttpOnly cookies, origin/CSRF checks and per-IP limits protect it. Optional TOTP seeds are AES-GCM encrypted with an operator-maintained key. One-use recovery codes are hashed. OIDC validates discovery, issuer/subject, PKCE, nonce and browser-bound state; it does not merge accounts by email or share Bidlark cookies.

Attachments are private files or S3 objects with minted tenant-prefixed keys. Downloads require current access and force attachment disposition. File type/size and workspace quotas apply. S3 and OIDC need independent provider acceptance when configured. Entitlements are separate from roles; the CAS demo's billing simulator cannot charge payments.

## ADR 006 — Portable installation and operations

Docker Compose runs dedicated database/API/web containers and named volumes; only the loopback web port is published. Setup creates private random secrets exactly once. Checksum-tracked migrations refuse changed applied files. Backups include PostgreSQL and attachments, with encryption keys retained separately. Restore into separate storage before switching. Request logs are opt-in and contain route patterns/status/duration/request IDs without sensitive payloads.

One worker per API process processes the PostgreSQL queue using SKIP LOCKED. There are ten pending jobs per tenant maximum, 30-second worker deadlines, bounded crash retries and 24-hour completed-result retention. Project history is not silently expired. Multiple instances require deliberate rate-limit coordination and operational acceptance.

## Shared module map and future adapter

| Responsibility | Current source boundary |
| --- | --- |
| Independent scheduler | `packages/scheduling-engine` |
| Domain schema / operations | `src/domain.ts`, `packages/project-domain` |
| Grid and Gantt UI | `src/components/ScheduleWorkbench.tsx` |
| Reports / imports | `packages/reporting` |
| Typed API client | `src/api.ts` |
| Identity / entitlement adapter | `server/identity.ts`, `server/entitlements.ts` |
| Contracts | Shared Zod schemas and `docs/API.md` |

A future Bidlark shell must map its verified identity to CAS membership, use the same versioned API, keep entitlement decisions separate from roles, preserve published/draft separation and run the same tenant/engine acceptance suite. No production integration is implied by having these boundaries.
