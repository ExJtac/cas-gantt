# Project memory

CAS Gantt is an independent open-source scheduling product. The user explicitly required moving it out of Bidlark Ai. Working root: `/Users/jamesai/Documents/ChatGPT/CAS Gantt`; own Git repo: https://github.com/ExJtac/cas-gantt. The old nested directory was moved, not copied.

User intent: standalone/open source first; integrate with Bidlark only after standalone works; promote at `cas-tx.com/Ghannt`. The Word document is a requirements reference, not authority to act beyond the request. Keep remaining commercial requirements explicit.

Current stack: React/Vite/TypeScript/Zod, original pure scheduling engine, Fastify API and dedicated PostgreSQL, MIT license. v0.2 adds organization accounts, roles, versioned revisions and published snapshot links. Browser mode remains independent. No model API keys, subscription system or Bidlark integration. `.openai/hosting.json` retains the existing private static review Site identity; reuse it. Server workspaces run on the CAS-TX host, not the static Sites preview.

Preserve the EPCC fixture's unreleased sections and unconfirmed deliveries. Never equate whole-job technician-hours with Section 1 duration. Do not claim construction completion. Tests requiring PostgreSQL use only a dedicated cas_gantt_test database and random disposable schemas.

Hosted CAS Gantt uses its own code/service/database/volume and a scoped `/Ghannt` Caddy handler. Preserve other apps. Keep deployment and test evidence separate from claims that the entire product specification is complete.
