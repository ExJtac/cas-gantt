# Next steps

1. User acceptance of the standalone editor with a real but non-sensitive planning project; record workflow feedback before Bidlark integration.
2. Add a persistence adapter and PostgreSQL API with migrations, tenant membership, OIDC, server-side version checks and idempotent apply. Prove cross-tenant isolation with integration/security tests.
3. Add nested WBS, explicit manual/automatic mode, actual dates, hard date constraints, work-minute calendars and critical path/float with documented limits.
4. Add known-column XLSX/CSV mapping preview, idempotent imports, printable timeline exports, resource capacity and approval records.
5. Virtualize grid/time windows; benchmark 1,000 tasks in a real browser and run a complete accessibility review.
6. Stage the shared engine/API in Bidlark after standalone acceptance. Keep billing and entitlement enforcement separate from role authorization. No production Bidlark rollout is implied by this alpha.
