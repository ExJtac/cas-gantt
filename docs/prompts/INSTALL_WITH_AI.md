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
