# Verification

Environment: Node v22.22.2, macOS arm64. November 26, 2026.

Automated checks: 20 passing tests covering valid local dates and DST arithmetic; inclusive working duration; FS/SS/FF/SF, negative lag and holiday/weekend boundaries; milestone behavior; dependency cycles/missing links/duplicate IDs; section/material holds and successor propagation; EPCC placeholder sections; baseline/status invariants; JSON roundtrip/schema rejection; CSV formula neutralization; input bounds. A deterministic 1,000-task dependency chain completed two calculations in about 14 ms in the first recorded run. This is an engine benchmark, not a browser performance claim.

Production build: TypeScript typecheck and Vite build passed. npm audit reports zero known vulnerabilities at the time checked. Build logs retain two upstream Zod comment-annotation warnings; they do not affect the build result.

Browser checks through the in-app browser: task drawer; native date input; duration edit and successor impact preview; apply and persistence after reload; cancel; undo; baseline capture; cycle validation displayed in the drawer; desktop light/dark theme; 390px mobile task layout with no document horizontal overflow. Native dialog controls and labeled date/duration fields provide keyboard alternatives to drag.

Observed and fixed during QA: the date field needed input-event handling and form-value capture to ensure changes reach the preview; dark theme inherited a fixed light background; mobile icon-only navigation needed explicit accessible names. No full WCAG audit or multi-user security acceptance is claimed. Full import/export browser acceptance, 1,000-row UI performance, server concurrency/authorization and advanced commercial features remain separate acceptance work.

Raw local test/build/audit logs are copied into ignored artifacts for this release. Tests are reproducible with npm ci, npm test, npm run build.
