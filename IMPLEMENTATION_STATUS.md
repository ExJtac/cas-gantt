# Implementation status

v0.3.0 standalone candidate — November 26, 2026.

The local checkout now implements the document's standalone planning scope: WBS, configurable virtual grid/timeline, minute/shift calendars, constraints/manual scheduling, CPM/float, actuals/baselines, resources/materials, scenarios, templates, mapped XLSX/CSV, paginated PDF, collaboration/files/mentions, procurement permissions, queued previews/exports, recovery/MFA, optional OIDC/S3 adapters, mock entitlements and portable installation.

The README contains full installation, configuration, backups, recovery, update/troubleshooting instructions and complete GPT/Codex, Grok and Claude prompts. Default login is username/password, default file storage is local, and demo billing cannot charge money. No model API key is required.

Local verification: 87 passing tests with real PostgreSQL, successful production build, zero known dependency audit findings, Docker installation and health, 1,000-task browser render/filter/edit/reload, queued browser PDF download, visually inspected PDF, and separate database+attachment restore. See docs/VERIFICATION.md and docs/FEATURE_MATRIX.md for evidence and coverage limits.

Release state: v0.2 remains the last recorded public CAS/GitHub deployment until the v0.3 release is explicitly recorded in deployment evidence. Local implementation is not proof of a public deployment. OIDC/S3 are optional configured adapters, not connected live providers. Broader device/accessibility review and production operations remain acceptance gates. Bidlark integration and live payments are deferred.
