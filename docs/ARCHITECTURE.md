# Architecture decisions

## ADR 001 — Standalone first

CAS Gantt lives in its own repository, outside Bidlark Ai. React + Vite + TypeScript provides a portable static shell. The first accepted slice is browser-local. PostgreSQL, tenant authorization and billing remain a later, separate server milestone. A local project ID is not a tenant security boundary.

Read-only compatibility inspection found Bidlark uses React 18, Vite, Express, Drizzle/PostgreSQL and Firebase/OIDC-related dependencies. CAS Gantt uses React 19 but its engine has no React dependency. The engine and versioned domain contracts can be reused; direct copying of the UI into Bidlark requires dependency/accessibility review. No Bidlark code, service or data is changed by this release.

## ADR 002 — One task record, derived finish

A task contains one forecast start and workday duration. Grid, bars, reports and drawer derive from the same record and `calculate()`. `finishOf()` derives finish; it is never independently persisted. Scheduled results are materialized only after the user applies a preview. Holds and unreleased sections nullify forecast dates, including downstream work.

The current date model is whole workdays and a project calendar. Shift/minute calendars, formal manual/automatic modes, hard date constraints, resource limits, actual dates, and a backward CPM pass are not represented as completed capabilities.

## ADR 003 — Review before changing dates

Edit and drag produce a detached candidate, validated for domain constraints, cycles and missing links. Cancel discards it. Apply writes a new local revision. Native dialogs provide focus containment and Escape dismissal; form fields are the non-drag path. Undo/redo preserves baseline snapshots and appends an audit entry.

## ADR 004 — Portable data before shared accounts

Project JSON is schema version 1. The UI provides import validation and replacement by project ID. Browser storage detects changed values before saving and uses the storage event to flag other-tab edits. This reduces accidental overwrites but is not an atomic database lock. Multi-user version checks must eventually be enforced server-side with authorization and If-Match semantics.

Future API seam: project-scoped schedule fetch; expected-version preview/apply; baseline capture; export/import jobs. Proposed routes in the original product brief are design inputs, not live endpoints. Schedule records must eventually be scoped by organization on every read/write and backed by database constraints. An entitlement adapter is separate from role authorization.

## ADR 005 — Public standalone delivery

The app can be hosted on any static server. CAS-TX promotion uses the requested `/Ghannt/` spelling; public demo is `/Ghannt/app/`. A dedicated static directory and narrowly scoped Caddy handler avoid rebuilding the existing marketing website or touching product services. The private Sites review deployment is separate. Repository source is MIT; installed dependencies keep their own licenses.
