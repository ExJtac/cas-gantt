# Standalone API v1

External base: `<origin>/Ghannt/api/v1`. The reverse proxy strips `/Ghannt` before the API. JSON project schema version remains 1; optional fields extend existing exports. Shared Zod definitions live in `src/domain.ts` and are used by both server and browser. The engine and reports use those same records.

## Authentication and writes

`POST /auth/register` accepts username, password (12–256 characters), displayName and organizationName. `POST /auth/login` accepts username/password and optional mfaCode. Both return the user, memberships and CSRF token; the session stays in an HttpOnly cookie. `GET /session` refreshes current memberships. `POST /auth/logout` revokes that session. See README for MFA/recovery/OIDC configuration; secrets are never frontend environment variables.

Organization routes require `X-Organization-Id`. Mutations additionally require the exact configured `Origin` and `X-CSRF-Token`. Schedule writes require `If-Match: <project version>` and an `Idempotency-Key` of 8–100 characters. Retry an identical write with the same key; a different payload with that key returns 409. Current membership and plan entitlement checks are independent. Roles: owner, scheduler, editor, procurement, viewer.

Errors are `{error, code}`. 400: validation; 401: sign-in; 403: role/origin/CSRF/entitlement; 404: inaccessible resource; 409: version/immutable baseline/idempotency conflict; 428: missing If-Match; 429: rate/queue limit. Responses include `X-Request-Id`. Never log cookies or request bodies.

## Schedule operations

| Method / route | Contract |
| --- | --- |
| GET /projects | Current drafts for members; latest published snapshots only for viewers. |
| POST /projects | Full validated Project JSON. Owner/scheduler; returns `{project}` at version 1. |
| GET /projects/:id/schedule | `{project,published}`. Optional `limit` (1–1000), `offset`, `section` returns `{project: metadata without tasks,tasks,dependencies,total,offset,nextOffset,version,published,partial:true}`. Partial results must never be applied as complete projects. Dependencies include edges touching the selected rows. |
| POST /projects/:id/tasks | Complete Task JSON; creates a new project revision. |
| PATCH /projects/:id/tasks/:taskId | Partial task fields; validates the entire resulting schedule and records a new revision. |
| POST /projects/:id/schedule/preview | `{project: candidate,reason}` with If-Match. No mutation. Returns `{project,changes,warnings,expectedVersion}` or `{jobId,expectedVersion}` for 250+ tasks. Candidate project version must match. |
| POST /projects/:id/schedule/apply | Same candidate envelope + If-Match + idempotency key. Returns `{project}` at the next version. Atomic validation, authorization, projections, history and save. |
| POST /projects/:id/baselines | `{name,reason}` + version/idempotency. Owner/scheduler; server-attributed immutable snapshot; returns new project revision. |
| GET /projects/:id/critical-path | Deterministic CPM tasks and calculation metadata. |
| GET /projects/:id/revisions | Up to 25 revisions, optional `before` version, `nextBefore` cursor. |
| GET /projects/:id/revisions/:version | Manager-only restore candidate with current baselines/version retained; apply explicitly as a new revision. |
| GET /projects/:id/audit | Revision changes with actor/reason; optional taskId filter. |
| POST /projects/:id/publish | Requires approved current revision, If-Match and idempotency key. Returns publicationId/version. |

Approval is part of the candidate project and subject to role/attribution checks. Planning changes invalidate an existing approval. Baselines cannot be modified or removed. The browser uses the full-project contract for atomic multi-task review; clients may use the task endpoints for smaller edits.

## Reports, collaboration and identity

`POST /projects/:id/imports`: `{filename,data:base64,mapping?,duplicates?}` with If-Match. Returns header/sample discovery or a validated candidate with errors/addition/update counts. CSV/XLSX only; maximum 5 MB input, 5,000 rows, 200 columns, bounded uncompressed XLSX size. Import preview never saves; apply explicitly.

`POST /projects/:id/exports`: `{format:csv|xlsx|pdf|json,report:schedule|baseline|lookahead2|lookahead3|lookahead6|milestones|critical,from?:YYYY-MM-DD}` returns jobId/version. `GET /jobs/:id` returns state/result or a download route. `GET /jobs/:id/download` streams completed export bytes. Jobs are tenant- and actor-scoped, capped at ten pending jobs per workspace, limited to 30 seconds each and retained for 24 hours after completion/failure. Role downgrade prevents accessing old private draft job results. Viewers export published snapshots only.

Comments: GET/POST `/projects/:id/comments` (body, optional taskId, mentions member UUIDs). Files: GET/POST `/projects/:id/attachments` (name, mime, base64 data, optional taskId), GET `/attachments/:id/download`. Allowed file types are explicit; 10 MB per file and 1 GB per workspace. Files always download as attachments. Viewers cannot see draft comments or files.

GET `/notifications`, POST `/notifications/:id/read`; GET `/activity`; GET/POST `/templates`; GET `/members`; PATCH/DELETE `/members/:id`; GET/POST `/invitations`; POST `/invitations/accept`; DELETE `/invitations/:id`; POST `/shares`; DELETE `/shares/:id`; GET `/public/:token`. Share/invitation tokens expire, are one-use where appropriate and are stored hashed.

Owner transfer: POST `/ownership/transfer` with `{userId,confirmation:"TRANSFER OWNERSHIP"}`; verify the target existing member and workspace before invoking. GET `/entitlements`; POST `/billing/mock-checkout` is owner-only and requires `GANTT_MOCK_BILLING=enabled`. It changes simulated entitlement state and always reports `charged:false`.

The authoritative endpoint implementations are `server/app.ts`, `server/collaboration.ts`, `server/reports.ts`, and `server/identity.ts`. External OIDC/S3 adapters require operator configuration and provider-specific acceptance; no shared Bidlark cookie is supported.
