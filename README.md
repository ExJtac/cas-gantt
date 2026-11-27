# CAS Gantt

An independent, MIT-licensed construction scheduler by CAS-TX. **v0.2.0 is a standalone early release.** It is not connected to Bidlark.

- [Open the app](https://cas-tx.com/Ghannt/app/)
- [About CAS Gantt](https://cas-tx.com/Ghannt/)
- [Source](https://github.com/ExJtac/cas-gantt)

## Run the browser workspace

Requires Node.js 22.12+.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4317/Ghannt/app/`. Browser mode works without an account or API. Build with `npm run build`; serve `dist/` on a static host. The private Sites preview supports browser mode only; server workspaces are available on CAS-TX or your own API host.

## Run server workspaces

Use your own PostgreSQL 14+ database, separate from other applications. Set `GANTT_DATABASE_URL` and `GANTT_PUBLIC_ORIGIN=http://127.0.0.1:4317` in your shell, then run `npm run dev:server` alongside Vite. Migrations run on startup under an advisory lock. The Vite proxy maps `/Ghannt/api/*` to the loopback API on port 4318.

In the app, choose **Sign in → Create workspace**. Use a username and a unique password of at least 12 characters. Store it safely: self-service password recovery is not implemented. For production, follow [self-hosting](docs/SELF_HOSTING.md), use HTTPS and set `NODE_ENV=production`.

Browser projects are not uploaded automatically. Export a local project as JSON, open your server workspace from your account menu, then import the file and review/apply it.

## What works

- Multiple projects, tasks, released/unreleased sections, holds, milestones and progress.
- Connected grid and Gantt, drag move/resize, keyboard-accessible task fields, five timeline scales, dependency arrows, search, light/dark themes and mobile task editing.
- FS/SS/FF/SF dependencies with whole-workday lag, holidays/weekdays, cycle and missing-link checks, and preview/apply/cancel.
- Named immutable baseline date snapshots, comparisons, undo/redo and JSON/CSV/print exports.
- Optional PostgreSQL workspaces with owner, scheduler, editor and published-only viewer roles; one-use expiring invitations; removal/revocation.
- Atomic expected-version writes, idempotent retries, author-attributed server revisions with before/after fields, and previewed revision restore.
- Explicit publishing of fixed snapshots; read-only links with expiry and revocation. Later draft changes never alter an existing publication.

## Scheduling rules

Tasks use local `YYYY-MM-DD` dates; history uses UTC timestamps. UTC arithmetic represents calendar dates without host/DST shifts. Start and finish are inclusive. FS+0 begins on the next workday after a task finishes; a zero-duration milestone can release successors on the same day. Nonworking starts snap forward with a warning. FF/SF derive start from duration.

An entered forecast start is a lower bound. Propagation moves successors later; it does not automatically pull a dated successor earlier when a predecessor moves earlier. Clear its start to calculate from dependencies. Status does not grant approval or record actual completion. Holds and unreleased sections keep tasks and dependent work undated.

Baselines preserve dates, not a full contractual baseline record. Imported baselines retain their supplied provenance; newly captured server baselines use calculated dates and server time. Undo/redo is session-scoped; server revision history persists. Local audit labels retain the latest 500 entries, while server revision records are separate and persistent.

## Storage and access

Browser mode stores projects under `cas-gantt.projects.v1` on this origin. Clearing browser storage removes that copy; export backups. Cross-tab checks reduce accidental overwrites but are not atomic database locks.

Server mode stores project JSONB and versioned snapshots in PostgreSQL. Every organization route checks current membership and scopes queries by organization. Writes require a session, permitted role, same-origin request and CSRF token. Passwords use salted scrypt; opaque session/share/invitation tokens are hashed in the database. Production session cookies are Secure, HttpOnly and SameSite Strict. Read-only viewers receive published snapshots, never draft/history endpoints.

A shared snapshot includes task notes, owners and baseline dates, but excludes draft audit entries. Anyone with an active link can read/export it. Revocation prevents future retrieval; it cannot erase copies already downloaded. Browser data stays local until an explicit import into server mode. No analytics, model calls or billing are included. Google Fonts is optional; system-font fallbacks are available.

## Verification

```sh
npm test
npm run build
```

Server acceptance tests require `GANTT_TEST_DATABASE_URL` pointing to a dedicated database named `cas_gantt_test`. Each run creates and drops its own random schema. Without that variable the database suite is explicitly skipped. CI runs the full suite against PostgreSQL 16. See [verification](docs/VERIFICATION.md).

## Remaining specification work

Nested WBS, actual dates, full date constraints, explicit manual/automatic modes, work-minute calendars, CPM/float, resource capacity/leveling, XLSX/CSV mapping import, attachments/scenarios, paginated timeline PDF export and large-grid virtualization remain incomplete. OIDC, account recovery/MFA, off-host backup operations and a comprehensive accessibility/security audit are also pending. Collaboration currently reloads on demand and detects conflicts on writes; it is not live push synchronization. Billing and Bidlark integration wait for standalone acceptance.

The EPCC demo uses Valle Verde Building A, 33 conduit stubouts, two racks and conditional CAT6A work. Durations are illustrative; deliveries/support remain unapproved, and sections 2–5 stay undated. The quoted 1,793.95 technician-hours belong to the whole job. No actual completion is asserted.

MIT license; see [LICENSE](LICENSE) and [third-party notices](THIRD_PARTY_NOTICES.md). The scheduling engine and chart are original implementations. [Architecture](docs/ARCHITECTURE.md), [status](IMPLEMENTATION_STATUS.md), [next steps](NEXT_STEPS.md).
