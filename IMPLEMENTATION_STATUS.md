# Implementation status

Version 0.2.0 — standalone early release, November 26, 2026.

Implemented: local project/task editor; grid/timeline; workdays/holidays; task holds; five-section demo; four dependency types/lag; cycle validation; move/resize with preview; date baselines; session undo/redo; resources summary; JSON import/export; CSV export; print; responsive UI.

New in v0.2: PostgreSQL migrations/persistence, username/password sessions, organization memberships and owner/scheduler/editor/viewer authorization, atomic project versions, idempotent writes, field-level revision history/restore preview, explicit published snapshots, expiring/revocable read-only links and one-use invitations. Optional browser workspace remains available and never uploads automatically.

Verification includes real PostgreSQL tests for tenant isolation, permissions, CSRF/origin checks, stale/concurrent writes, baseline preservation, publishing, expiry/revocation, restart persistence and session invalidation; browser checks cover sign-in, save/reload, publishing, revocation, history and conflict recovery. See docs/VERIFICATION.md.

Original specification gates: G0 standalone architecture established; G1 persistence/accounts substantially implemented, with OIDC/recovery and broader operational review pending; G2 dependency core implemented but WBS, actuals, detailed calendars/constraints and CPM incomplete; G3 baseline/revision/publication subset implemented. G4 Bidlark integration and G5 full commercial readiness remain incomplete. This is not the full commercial specification.
