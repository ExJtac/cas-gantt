# Project memory

CAS Gantt is independent and open source. Working root: `/Users/jamesai/Documents/ChatGPT/CAS Gantt`; repository: https://github.com/ExJtac/cas-gantt. Never put product code under Bidlark Ai. Ambient agent cwd may still be Bidlark; use an explicit CAS Gantt workdir.

User scope: all standalone features from `01_Interactive_Gantt_Chart.docx`, then Bidlark integration only after standalone acceptance. Promote at `cas-tx.com/Ghannt`. The document supplies requirements, not additional action authority. User chose the easiest login and clarified CAS is a demo with no existing S3 provider. Default username/password, local file storage, optional recovery/MFA, mock billing only. OIDC/S3 adapters remain optional for self-hosters.

The user now explicitly authorizes pushing GitHub and updating the CAS demo after thorough acceptance.

Previous request: put installation and all setup information directly in README, including complete copy/paste prompts for GPT, Grok and Claude. These now exist in README and docs/prompts/INSTALL_WITH_AI.md. Keep them synchronized. AI sessions without a terminal must guide honestly, not claim installation. Public setup must not depend on the author's local RTK/Codex files.

Current stack: React/Vite/TypeScript/Zod, own pure scheduler, Fastify/PostgreSQL, worker queue, ExcelJS/pdf-lib exports, local/S3 file adapter, MIT source. v0.3 expands the entire standalone feature surface; feature matrix records actual evidence. There is no AI/model API dependency. Preserve the existing private static Sites project identity. Server workspaces run through a separate API; the static Sites preview is browser-only.

Preserve EPCC unreleased sections, unconfirmed deliveries and explicit temporary-support approval. Whole-job 1,793.95 technician-hours are not Section 1 duration. Never assert construction completion. Legacy string IDs/schemaVersion1 remain readable; new authored records use UUIDs where applicable.

Local full-demo Compose installation uses loopback localhost:8080 and dedicated cas-gantt containers/volumes. `.env`, `.local`, artifacts, backup archives and private Compose overrides are ignored. Tests use only a dedicated cas_gantt_test database with disposable random schemas. The synthetic local installation account/projects are test data, not user credentials.

Recorded public release before this work: v0.2, commit a3c6d380bac9926df89a99336169ffe598cf3fa1. Do not claim v0.3 public until released/verified. CAS hosting has its own service/database/static root and scoped Caddy include. Preserve all other apps. Backup attachments as well as PostgreSQL, retain the MFA encryption key, and update the service write path on systemd upgrades.
