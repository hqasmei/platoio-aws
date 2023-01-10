-- IMPORTANT: Once applied, migration files CANNOT be changed, even the whitespace or comments.
-- The hash flyway uses to compare applied versions uses the entire file, including whitespace and comments!

create type role as enum ('user');

-- Used by connect-pg-simple sessions.
create table session (
    sid varchar not null collate "default",
    sess json not null,
	expire timestamp(6) not null
) with (oids = false);
alter table session add constraint session_pkey primary key (sid) not deferrable initially immediate;
create index idx_session_expire on session (expire);

create table users (
    id uuid unique not null primary key default gen_random_uuid(),
    name text,
    email text unique not null,  
    password_hash text,
    role role not null default 'user',
    created_at timestamp with time zone not null default now(),
    deleted_at timestamp with time zone
);

