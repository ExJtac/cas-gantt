CREATE TABLE IF NOT EXISTS gantt_users (
 id uuid PRIMARY KEY, username text NOT NULL UNIQUE, display_name text NOT NULL,
 password_hash text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS gantt_organizations (
 id uuid PRIMARY KEY, name text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS gantt_memberships (
 organization_id uuid NOT NULL REFERENCES gantt_organizations(id), user_id uuid NOT NULL REFERENCES gantt_users(id),
 role text NOT NULL CHECK (role IN ('owner','scheduler','editor','viewer')), created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(organization_id,user_id)
);
CREATE TABLE IF NOT EXISTS gantt_sessions (
 token_hash text PRIMARY KEY, user_id uuid NOT NULL REFERENCES gantt_users(id), csrf_token text NOT NULL,
 expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS gantt_session_expiry ON gantt_sessions(expires_at);
CREATE TABLE IF NOT EXISTS gantt_projects (
 organization_id uuid NOT NULL REFERENCES gantt_organizations(id), id text NOT NULL,
 version integer NOT NULL CHECK(version>0), data jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now(),
 created_by uuid NOT NULL REFERENCES gantt_users(id), PRIMARY KEY(organization_id,id),
 CHECK (data->>'id'=id), CHECK ((data->>'version')::integer=version)
);
CREATE TABLE IF NOT EXISTS gantt_revisions (
 organization_id uuid NOT NULL, project_id text NOT NULL, version integer NOT NULL,
 actor_id uuid NOT NULL REFERENCES gantt_users(id), reason text NOT NULL, changes jsonb NOT NULL,
 snapshot jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(organization_id,project_id,version),
 FOREIGN KEY(organization_id,project_id) REFERENCES gantt_projects(organization_id,id)
);
CREATE TABLE IF NOT EXISTS gantt_idempotency (
 organization_id uuid NOT NULL REFERENCES gantt_organizations(id), actor_id uuid NOT NULL REFERENCES gantt_users(id),
 key text NOT NULL, request_hash text NOT NULL, response jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(organization_id,actor_id,key)
);
CREATE TABLE IF NOT EXISTS gantt_publications (
 organization_id uuid NOT NULL, project_id text NOT NULL, id uuid NOT NULL,
 project_version integer NOT NULL, snapshot jsonb NOT NULL, published_by uuid NOT NULL REFERENCES gantt_users(id),
 created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(organization_id,id),
 FOREIGN KEY(organization_id,project_id) REFERENCES gantt_projects(organization_id,id)
);
CREATE INDEX IF NOT EXISTS gantt_publications_project ON gantt_publications(organization_id,project_id,created_at DESC);
CREATE TABLE IF NOT EXISTS gantt_shares (
 id uuid PRIMARY KEY, organization_id uuid NOT NULL, publication_id uuid NOT NULL, token_hash text NOT NULL UNIQUE,
 expires_at timestamptz NOT NULL, revoked_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(organization_id,publication_id) REFERENCES gantt_publications(organization_id,id)
);
CREATE TABLE IF NOT EXISTS gantt_invitations (
 id uuid PRIMARY KEY, organization_id uuid NOT NULL REFERENCES gantt_organizations(id), token_hash text NOT NULL UNIQUE,
 role text NOT NULL CHECK(role IN ('scheduler','editor','viewer')), created_by uuid NOT NULL REFERENCES gantt_users(id),
 expires_at timestamptz NOT NULL, consumed_at timestamptz, revoked_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS gantt_security_events (
 id bigserial PRIMARY KEY, organization_id uuid NOT NULL REFERENCES gantt_organizations(id),
 actor_id uuid NOT NULL REFERENCES gantt_users(id), action text NOT NULL, subject text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
