# CAS Gantt

An open-source construction scheduling app by CAS-TX. This is a working **v0.1 standalone alpha**, with a reusable TypeScript scheduling engine and a React editor. Projects are stored in the browser; no account or backend is required.

## Run locally

Requires Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:4317. To check and build:

```sh
npm test
npm run build
npm run preview
```

Serve `dist/` from any static host. Asset URLs are relative, so the editor can also be mounted under a subdirectory. `public/Ghannt/index.html` is the CAS-TX promotion page. The optional `.openai/hosting.json` is a review-site identity; remove its `project_id` before registering your own Site.

## What works

- Create multiple projects, tasks and released/unreleased sections.
- Connected task grid and Gantt; task drawer, drag move and resize; keyboard-accessible date and duration fields.
- Day/week/month/quarter/year timeline scale, weekends/holiday shading, dependency arrows, milestone diamonds and progress overlays.
- FS, SS, FF and SF dependencies, signed workday lag, cycle/missing-link rejection and impact previews with apply/cancel.
- Explicit material/approval holds and section release gates; held tasks and their successors remain unscheduled.
- Named baseline date snapshots, forecast comparison, local revision log, session undo/redo.
- Project settings, workdays, holidays, IANA timezone, crew effort summaries, filtering/search and light/dark themes.
- Browser autosave, another-tab conflict detection, JSON backup/import by project ID, CSV export and browser print/PDF task report.
- Responsive mobile task editing (the visual timeline is hidden below 650px).

## Calendar and scheduling rules

Tasks use local `YYYY-MM-DD` dates, not UTC timestamps. Event history uses UTC timestamps. The pure engine uses UTC arithmetic only as a representation of calendar dates, avoiding host timezone/DST offsets. The project timezone determines today, not the task date string.

Start and finish are inclusive working dates. A one-workday task starts and finishes on the same day. Nonworking starts snap forward, with a preview warning. FS+0 starts on the next workday after the predecessor finishes. A zero-duration predecessor milestone can release its successor the same day. Lags are whole workdays. FF/SF derive the successor start by its duration.

Each entered forecast start is a lower bound. Propagation moves successors later as necessary; it does not automatically pull an already-dated successor earlier when its predecessor moves earlier. Clear the successor's start to recalculate from dependencies. Release holds explicitly; choosing a status does not grant approval or mark actual work complete.

Baseline snapshots are append-only in the UI and retained on undo/import. They contain dates, not a full contractual baseline record. Revision history is capped at 500 local entries; undo/redo lasts only for the current browser session and project selection.

## Storage and privacy

Each origin has a local workspace under `cas-gantt.projects.v1`. Projects are not uploaded to a server. Clearing browser storage removes them; **export JSON backups regularly**. The app warns when storage fails and stops editing after detecting another tab's change. This is not a transactional multi-user database. Imports are capped at 5 MB and 5,000 tasks; malformed dates, links and calendars are rejected before application.

Google Fonts is an optional external font request; system sans-serif fallbacks work if unavailable. No analytics, paid APIs, model calls or billing are included. Do not treat this alpha as an authenticated shared customer portal. Static hosting access logs and fonts are separate from project storage.

## EPCC fixture

The demonstration uses Valle Verde Building A with a requested November 4, 2026 start, 33 conduit stubouts, two racks and conditional CAT6A work. Task durations are illustrative, not confirmed construction commitments. Material arrivals and temporary support remain unapproved/unconfirmed; sections 2–5 have no dates. The 1,793.95 technician-hours refer to the whole quoted job, not Section 1. No actual completion is asserted.

## Scope and next milestones

This alpha does **not** implement tenant accounts, server database/API, OIDC, multi-user collaboration, sharing/permissions, billing, actual date entry, full WBS hierarchy, resource capacity/leveling, CPM/float, XLSX interchange, CSV import, attachments, scenarios or Bidlark integration. Printing produces a task report, not a paginated full timeline. A 1,000-task engine benchmark is included; large-grid virtualization and a browser performance acceptance benchmark remain future work.

See [architecture](docs/ARCHITECTURE.md), [implementation status](IMPLEMENTATION_STATUS.md), [next steps](NEXT_STEPS.md) and [verification](docs/VERIFICATION.md). The standalone scheduling engine lives in `packages/scheduling-engine`; it imports no React or persistence code.

## License and contributions

MIT. See [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). The chart and scheduler are original implementations; there is no proprietary Gantt dependency. Issues and pull requests are welcome. Run tests and a production build before submitting changes.
