# Implementation status

Version 0.1.0 — standalone alpha, November 26, 2026.

Implemented: local project/task editor; grid/timeline; calendar dates; workdays and holidays; task holds; five-section demo; four dependency types and lag; validation/cycle detection; move/resize with preview; baselines; session undo/redo; audit labels; resources summary; JSON import/export; CSV export; print; responsive UI.

Verified: TypeScript/production build; automated calendar, dependency, import and baseline invariants; browser edit/apply/persistence and baseline capture. Detailed results are in docs/VERIFICATION.md.

Partial against the original commercial specification: G0 architecture and standalone boundary, G1 local editor (no auth/tenant server), G2 dependency core (no WBS or full constraints), G3 baseline/revision subset. G4 integration and G5 commercial readiness are not complete. Do not represent this release as multi-user SaaS or a completed commercial scheduling system.
