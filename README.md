# CAS Gantt

**An open-source, standalone construction scheduler by CAS-TX.** MIT licensed. CAS Gantt has its own code, data and accounts; it does not require Bidlark or an AI API key.

- **CAS demo:** https://cas-tx.com/Ghannt/app/
- **Project page:** https://cas-tx.com/Ghannt/
- **GitHub:** https://github.com/ExJtac/cas-gantt
- **Feature acceptance checklist:** [docs/FEATURE_MATRIX.md](docs/FEATURE_MATRIX.md)

The CAS website is a demonstration host. Use synthetic/demo information and keep exported copies. Version 0.3 is live on the CAS demo. The acceptance checklist records implemented features, verification evidence and remaining provider-specific limits.

## Installation contents in this checkout

Version 0.3 includes the standalone implementation and installation tooling described here. The release passed 87 automated tests, GitHub CI, browser checks and live server acceptance. See [verification](docs/VERIFICATION.md) and the [deployment record](docs/DEPLOYMENT.md) for evidence and limits.

**First time using a Gantt chart?** Open **Quick guide** in the app. Start a project, click a task, enter its start and duration, then choose **Review changes → Apply changes**. Advanced options stay collapsed until you need them.

Jump to [browser-only setup](#quick-start-browser-only), [full Docker setup](#full-local-demo-copy-these-commands), [backup instructions](#back-up-the-database-and-files), or the [GPT / Grok / Claude prompts](#install-cas-gantt-with-gpt-grok-or-claude).

## Choose an installation

| Installation | Use it for | Requirements | Data location |
| --- | --- | --- | --- |
| Browser-only | Try/edit schedules on one device | Git + Node.js 22.12+ | Your browser's local storage |
| Full local demo | Accounts, teams, history, comments, files and mock subscriptions | Git + Node.js 22.12+ + Docker with Compose | Named PostgreSQL and attachment volumes on your machine |
| Self-hosted HTTPS | Your organization's own server/domain | Full stack + HTTPS reverse proxy + backup operations | Your own database and filesystem or optional S3-compatible storage |

Simple **username/password login is the default**. No Google, Microsoft, paid identity provider, Stripe account, cloud storage subscription or model API key is needed. Optional OIDC and S3 integrations are configurable for self-hosters.

## Quick start: browser-only

```sh
git clone https://github.com/ExJtac/cas-gantt.git
cd cas-gantt
npm ci
npm run dev
```

Open **http://127.0.0.1:4317/Ghannt/app/**, or the alternate port Vite prints if that port is busy. You can edit the demo and create projects without signing in. Use **Export → Project JSON** for backups. Clearing browser data removes that local copy. Server-only features require the full installation below.

## Full local demo: copy these commands

First install Git, Node.js 22.12 or newer, and Docker Desktop or Docker Engine with the Compose plugin. Start Docker before continuing. If your installation provides the standalone `docker-compose` command instead of `docker compose`, substitute `docker-compose` in the commands below. On Windows, use a Docker-supported terminal/WSL setup.

```sh
git clone https://github.com/ExJtac/cas-gantt.git
cd cas-gantt
npm ci
npm run setup
docker compose up -d --build
docker compose ps
```

`npm run setup` creates a private `.env` with unique random database and encryption keys. It preserves an existing `.env`. **Do not commit, paste or share this file.** The first container build downloads dependencies and may take several minutes.

Open **http://localhost:8080/Ghannt/app/**. Use that exact origin: `localhost` and `127.0.0.1` are different origins. The default port is bound to your machine's loopback interface, not exposed to your network.

Choose **Sign in → Create workspace**. Enter your name, workspace name, username and a unique password of at least 12 characters. You supply your own password; there is no shared/default admin credential. In account settings, generate and privately store offline recovery codes. Optional authenticator-app MFA is available when the encryption key is configured by setup.

Check the installation:

```sh
curl --fail http://localhost:8080/Ghannt/api/v1/health
docker compose logs --tail=50 api
```

Health should identify `cas-gantt`; `docker compose ps` should show healthy database/API containers and a running web container. A healthy page alone does not prove that database writes work: create a synthetic project, apply a task edit and reload it.

## First-use workflow

1. Create a project from one of the five templates. Configure customer, timezone, kickoff, sections and workdays. Future sections remain unreleased and undated.
2. Set up shifts, holidays, exceptions, crew capacity and material lines in Settings/Resources/Materials.
3. Edit task dates, WBS, actuals, dependencies, assignments and approval constraints in the inspector. Review recalculation before applying.
4. Capture a named baseline with a reason. Compare it with later forecast and actual dates.
5. In server mode, invite team members using one-use expiring links. Owners/schedulers control releases and approvals; editors update work; procurement updates material readiness; viewers see published snapshots.
6. Request/record schedule approval in Activity, then publish a fixed snapshot and optionally create an expiring read-only link. New draft edits do not change old publications.
7. Use Reports for schedule, baseline, lookahead, milestone and critical-path exports. Import known-column CSV/XLSX through mapping and validation before applying.

Browser projects stay local until you explicitly export their JSON, switch to a server workspace and import it. Files/comments belong to server projects and are not embedded in project JSON exports. Mock billing is labeled as a simulator and never collects payment details or charges money.

## Stop, restart and update

```sh
# Stop without deleting data
docker compose stop

# Start again
docker compose start

# Shut down/remove containers while retaining named data volumes
docker compose down
```

Do not add `--volumes` / `-v` to shutdown commands unless you intend to erase the database and attachments.

Before updating, make both backups described below and preserve `.env`. With a clean checkout:

```sh
git pull --ff-only
npm ci
docker compose up -d --build
docker compose ps
curl --fail http://localhost:8080/Ghannt/api/v1/health
```

Migrations are checked and applied at startup. Do not edit already-applied migrations. If Git reports local changes or a migration fails, stop and inspect; do not reset files or delete volumes to force an update. Keep the prior commit/image and backups. Database rollback is a planned recovery operation, not a blind code downgrade.

## Back up the database AND files

Run from your installation folder. These files may contain private data; store them securely and separately from the repository.

```sh
mkdir -p backups
# Pause browser access while making a consistent pair; allow active writes to finish.
docker compose stop web
docker compose exec -T db pg_dump -U cas_gantt -d cas_gantt -Fc > backups/cas-gantt.dump
docker compose exec -T api tar -czf - -C /data attachments > backups/cas-gantt-attachments.tar.gz
docker compose start web
```

If either backup command fails, investigate the error and restart `web` when ready; do not treat an empty dump as a backup. Verify the attachment archive with `tar -tzf backups/cas-gantt-attachments.tar.gz`. Existing backups use these fixed filenames, so move successful pairs into dated, private storage before taking the next pair.

Also preserve `.env` privately: the encryption key protects MFA secrets, and database credentials are needed to reconnect. JSON exports are useful per-project copies, but do not replace full database/file backups.

Verify recovery into a **separate disposable database**, never over the live database:

```sh
docker compose exec -T db createdb -U cas_gantt cas_gantt_restore_check
docker compose exec -T db pg_restore -U cas_gantt -d cas_gantt_restore_check --no-owner --exit-on-error < backups/cas-gantt.dump
docker compose exec -T db psql -U cas_gantt -d cas_gantt_restore_check -c 'SELECT count(*) FROM gantt_projects;'
```

After checking it, remove only that disposable restore database. A real restore should stop writes, retain the current data, restore into new storage, verify records/files and then switch the service. See [self-hosting](docs/SELF_HOSTING.md) for operational details. On-host backups do not protect against losing the host; configure off-host copies for any non-demo deployment.

## Configuration

Defaults are generated in `.env` and read by Compose. Optional integrations are not required for the CAS demo.

| Setting | Meaning |
| --- | --- |
| `GANTT_PUBLIC_ORIGIN` | Exact external origin, without trailing slash. Default `http://localhost:8080`. |
| `CAS_HTTP_PORT` / `CAS_BIND_ADDRESS` | Local web port/address. Default `8080` / `127.0.0.1`. |
| `CAS_DB_PASSWORD` | Random generated PostgreSQL password; keep private. |
| `GANTT_ENCRYPTION_KEY` | 32-byte hex key for MFA encryption; back it up privately and retain across updates. |
| `GANTT_REGISTRATION` | `enabled` or `disabled` for new workspace creation. |
| `GANTT_MOCK_BILLING` | `enabled` for the clearly labeled demo subscription simulator. |
| `NODE_ENV` | `development` for local HTTP; `production` requires an HTTPS public origin and Secure cookies. |
| `GANTT_DATABASE_URL` | Used for running the API outside Compose; Compose constructs it internally. |
| `GANTT_LOG_REQUESTS` | `enabled` writes request ID, route pattern, status and duration; excludes bodies, cookies and URL parameters. |
| `GANTT_FILE_DIRECTORY` | Filesystem attachment directory; `/data/attachments` inside Compose. |
| `GANTT_OIDC_ISSUER`, `GANTT_OIDC_CLIENT_ID`, `GANTT_OIDC_CLIENT_SECRET` | Optional company OIDC login. Register callback `<origin>/Ghannt/api/v1/auth/oidc/callback`. Configure these on the API service; do not put secrets in frontend variables. |
| `GANTT_S3_BUCKET`, `GANTT_S3_ENDPOINT`, `GANTT_S3_REGION` | Optional S3-compatible attachment storage. Configure SDK credentials securely on the API service. Existing local files are not automatically migrated. |

Optional API variables need to be added to the API service's `environment` or a private Compose override. Merely adding arbitrary values to `.env` does not automatically pass them into a container. See the examples in [SELF_HOSTING.md](docs/SELF_HOSTING.md).

## Troubleshooting

- **Docker command missing or daemon unavailable:** install/start Docker and verify `docker compose version` before running the full stack. Browser-only mode needs no Docker.
- **Port 8080 occupied:** choose another `CAS_HTTP_PORT` in `.env`, update `GANTT_PUBLIC_ORIGIN` to match, and recreate containers. Preserve the same Compose project name so its volumes remain attached.
- **Origin rejected / login not sticking:** open the exact configured public origin with `/Ghannt/app/`. The session cookie is scoped to `/Ghannt/`. Do not mix `localhost`, IP addresses, HTTP and HTTPS.
- **API cannot reach PostgreSQL:** inspect `docker compose ps` and API/database logs. Keep database credentials consistent with the initialized volume; changing the environment password alone does not change an existing PostgreSQL password.
- **Server features unavailable on a static preview:** the private ChatGPT Sites preview is browser-only. Use the CAS hosted demo or the full local stack for accounts/files/team features.
- **Conflict shown after editing:** another revision was saved. Export your pending draft, reload current data and review/reapply intentionally. The app does not silently overwrite it.
- **A task stays undated:** check section/ancestor release, approval holds, predecessor readiness and required material quantities. An estimated delivery date does not approve work.
- **Forgotten password:** use an offline recovery code generated earlier. The demo does not send recovery emails. Server operators should follow the recovery runbook rather than sharing a default password.
- **Migration checksum mismatch:** do not edit applied SQL files. Restore the original migration file and add a new numbered migration for schema changes.

## Development and verification

```sh
npm ci
npm test
npm run build
```

For database acceptance tests, create a separate database named `cas_gantt_test`, set `GANTT_TEST_DATABASE_URL` to its connection URL, and run `npm test`. Tests create/drop their own random schema. Never use a customer/production database. Without that variable database suites are explicitly skipped; a passing browser-only suite is not proof of server acceptance. CI uses PostgreSQL 16.

Without Docker, run PostgreSQL 14+, set `GANTT_DATABASE_URL` and `GANTT_PUBLIC_ORIGIN=http://127.0.0.1:4317`, then start `npm run dev:server` alongside `npm run dev`. The Vite proxy forwards `/Ghannt/api/*` to loopback port 4318. Keep real environment files ignored.

[Privacy / demo data](docs/PRIVACY.md) · [Support and recovery runbook](docs/SUPPORT_RUNBOOK.md) · [Verification evidence](docs/VERIFICATION.md) · [Feature matrix](docs/FEATURE_MATRIX.md) · [Architecture](docs/ARCHITECTURE.md) · [API contract](docs/API.md) · [Implementation status](IMPLEMENTATION_STATUS.md) · [Next steps](NEXT_STEPS.md)

## Scheduling and privacy notes

The pure TypeScript engine is independent of the UI and database. Grid, timeline, dashboard and reports use the same task records. Scheduled dates are civil dates in the project timezone; events use UTC timestamps. Forecast finish is derived from working duration. Whole-day legacy schedules retain inclusive finish dates, including the original FS/SS/FF/SF behavior. Minute schedules use explicit shift endpoints. Review CPM caveats for manual dates, hard constraints, different calendars and resource limits; crews are not silently leveled.

Baselines are immutable date/dependency snapshots with attribution/reason. Approval is explicit. Status changes do not create actual completion or authorize temporary support. The EPCC fixture's 1,793.95 technician-hours belong to the whole job; delivery estimates and sections 2–5 remain unconfirmed/unreleased.

Server organization routes check current membership and scope database queries. Mutation requests require origin and CSRF validation; expected versions prevent silent lost updates. Published snapshot links include task notes/owners/baseline dates but exclude draft audit entries. Anyone with a valid shared link can save a copy; revocation stops future retrieval, not copies already downloaded. Files are downloaded as attachments, never executed inline. No analytics or AI model calls are included.

## License

MIT: [LICENSE](LICENSE). Dependencies/fonts retain their own licenses: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). The chart and scheduling engine are original code. Contributions should include relevant tests and a passing build. No proprietary Gantt license is required.

---

# Install CAS Gantt with GPT, Grok or Claude

Use a coding-agent session with permission to read files and run a terminal on your computer/server. A chat-only session can guide you, but cannot install software on your device. These prompts use the public repository and do not require a paid model API or API key inside CAS Gantt.

## GPT / ChatGPT / Codex — copy and paste

```text
Install CAS Gantt from https://github.com/ExJtac/cas-gantt in its own new folder named cas-gantt. Read README.md, AGENTS.md and docs/SELF_HOSTING.md from the checked-out repository first; follow the actual current files rather than guessing commands. I want the full local standalone demo with simple username/password login, PostgreSQL, attachments and the mock billing simulator.

Inspect this machine for Git, Node.js 22.12+ and Docker with Compose. Do not overwrite an existing checkout, environment file, database or service. Clone the repo if needed, install locked dependencies with npm ci, run npm run setup to generate local secrets, then docker compose up -d --build. Keep the default binding on 127.0.0.1 and open http://localhost:8080/Ghannt/app/ only after the services are healthy. Never print or upload the generated .env, passwords, recovery codes or MFA secrets. Do not configure paid services, live billing or Bidlark integration.

Verify docker compose ps, the /Ghannt/api/v1/health response and the page/asset response. Help me create my own account through the interface. Explain browser-only versus server workspace storage. Finish by telling me the install folder, app URL, what checks passed, how to stop/restart it, how to back up both database and attachments, and how to update safely. If you cannot execute terminal commands, say so and give me exact commands one step at a time instead of claiming installation succeeded.
```

## Grok — copy and paste

```text
Help me install the open-source CAS Gantt application from https://github.com/ExJtac/cas-gantt. Use the repository's current README.md, AGENTS.md and docs/SELF_HOSTING.md as the installation instructions. Use a separate cas-gantt folder, preserve any existing files/services, and check for Git, Node.js 22.12+ and Docker Compose.

If you have terminal tools on my machine, execute the full local-demo setup: clone if needed, npm ci, npm run setup, docker compose up -d --build. Verify healthy services and http://localhost:8080/Ghannt/api/v1/health, then show http://localhost:8080/Ghannt/app/. Use local username/password accounts, local attachment storage and mock billing only. Keep the default localhost binding. Never display or transmit .env secrets or activate paid services. Help me enter my own account credentials in the UI.

If your session has no terminal access, guide me through the exact current commands and wait for their results. Do not claim to have installed it. End with the app URL, folder, verification results, start/stop commands, backup instructions for both PostgreSQL and attachments, and safe update instructions.
```

## Claude / Claude Code — copy and paste

```text
Install and verify CAS Gantt from https://github.com/ExJtac/cas-gantt as a standalone local demo. Work in a separate cas-gantt directory. First read the repository's README.md, AGENTS.md and docs/SELF_HOSTING.md. Check for Git, Node.js 22.12+ and Docker Compose; explain missing prerequisites. Preserve existing checkouts, .env files, ports, containers and data.

Run npm ci, npm run setup and docker compose up -d --build using the documented defaults. Keep it bound to localhost at http://localhost:8080/Ghannt/app/. Verify container health, API health and frontend assets. Use the built-in username/password login; let me supply my account password through the UI. Keep mock billing enabled for demonstration only. Do not connect Bidlark, paid services or external identity/storage providers unless I ask.

Never print or share generated secrets. Do not remove volumes or overwrite data. Give me the installed path and app URL, exact verification results, commands to stop/restart, instructions to back up the database and attachments, and a safe upgrade/rollback procedure. If this session cannot run commands on my computer, provide step-by-step commands instead and clearly state that you have not performed the installation.
```

For a lightweight browser-only demo, replace “full local standalone demo” with “browser-only demo,” then use `npm ci` and `npm run dev`. Open the URL Vite prints, with `/Ghannt/app/` appended. This mode does not require PostgreSQL or accounts.

For internet-facing hosting, do not simply expose the local demo port: follow the HTTPS, origin, cookie, registration, retention and backup steps in SELF_HOSTING.md. The AI must ask which domain/server you intend to use before changing public infrastructure. Never paste private credentials into these prompts.
