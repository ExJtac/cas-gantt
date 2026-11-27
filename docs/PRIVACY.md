# CAS Gantt demo data and privacy

CAS-TX hosts CAS Gantt as an open-source demonstration. Use synthetic demo information. A self-hosted installation is operated by the person or organization running that installation; its operator determines retention, backups and access.

## Stored information

Server accounts store a username, display name, salted password hash, organization memberships and hashed session/recovery/invitation/share tokens. Authenticator secrets, if enabled, are encrypted using the operator's server key. Optional OIDC stores the provider issuer/subject mapping; accounts are not automatically linked merely because email addresses match.

Server projects store task plans, actual dates/time entries, resources, material readiness, approval records, baselines, revision snapshots and user-entered comments. Uploaded attachments are stored in the configured filesystem or optional S3-compatible service. Do not upload personal, confidential or regulated information to the public demo.

Browser mode stores project JSON on your device for that origin. It does not upload projects automatically. Static hosting may receive normal HTTP requests. Optional Google Fonts requests can be removed from the stylesheet; system fonts are available. CAS Gantt contains no advertising analytics or model API calls.

## Sharing and access

Owners manage organization membership. Editors/schedulers access drafts according to their roles. Customer viewers and share links receive published snapshots. Shared snapshots include notes, owner labels and baseline dates. A valid link can be forwarded; expiration/revocation blocks future retrieval but cannot erase a copy someone already saved. Attachments and comments are not automatically included in shared snapshots.

## Retention, export and recovery

Export project JSON or reports to keep a portable copy. Full recovery requires database and attachment backups plus the private encryption key. Revision/audit records preserve the history of edits and are not silently erased by rollback. Demo storage is not a substitute for your own backup. Contact the installation operator about account/data removal and retention; changing a password does not remove project history.

The default self-hosted setup uses local storage services. Optional third-party identity/object storage providers receive the data required for those integrations only when the operator configures them. Mock billing has no payment processor, card data or charges.

For the CAS-hosted demonstration, contact CAS-TX through https://cas-tx.com/#contact. For your own installation, replace this operator/contact information with your own before inviting users. This file describes application behavior and does not certify compliance with a particular legal framework.
