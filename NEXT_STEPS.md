# Next steps

1. Complete the v0.3 release review against docs/FEATURE_MATRIX.md and retain local verification evidence. The full standalone implementation and README/AI installation prompts are present; do not describe the public v0.2 deployment as containing unshipped changes.
2. Publish the reviewed source and promote matching frontend/API artifacts to the CAS demo, with database/file backups and migrations checked first. Retain prior immutable releases; verify login, save/reload, approved snapshots, reports and files after promotion.
3. Run user acceptance on actual construction workflows using synthetic/redacted schedules. Expand browser/device/accessibility coverage as issues are identified; the current check is representative, not certification.
4. Self-hosters enabling OIDC or S3 must validate their own provider configuration. Non-demo hosting needs tested off-host backups, retention/monitoring, and operational ownership. No external provider or paid billing is required for the CAS demo.
5. Only after standalone acceptance, plan the Bidlark shell/API adapter. Do not implement or deploy it as part of this standalone work. Live payment processing requires a separate explicit request and provider acceptance.
