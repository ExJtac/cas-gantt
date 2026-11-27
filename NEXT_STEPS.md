# Next steps

v0.3 is pushed to GitHub and deployed to CAS. The 87-test suite, CI, live workflow smoke checks, browser login/PDF download and backup restore passed; see docs/VERIFICATION.md and docs/DEPLOYMENT.md.

1. Run user acceptance on actual construction workflows using synthetic/redacted schedules. Expand browser/device/accessibility coverage as issues are identified; the current check is representative, not certification.
2. Self-hosters enabling OIDC or S3 must validate their own provider configuration. Non-demo hosting needs tested off-host backups, retention/monitoring, and operational ownership. No external provider or paid billing is required for the CAS demo.
3. Only after standalone acceptance, plan the Bidlark shell/API adapter. Do not implement or deploy it as part of this standalone work. Live payment processing requires a separate explicit request and provider acceptance.
