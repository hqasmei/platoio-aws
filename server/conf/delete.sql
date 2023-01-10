-- github.com/hqasmei/server/conf/delete.sql
-- Used for local debugging only!
-- Assumes the `reflect` database and `reflect` user have been created and will be retained.
-- Assumes the `pgcrypto` extension has been created and will be retained.
-- Execute as user `reflect` in database `reflect`.

drop function if exists jsonb_merge_conditions;

drop table if exists users;

drop table if exists session;
drop index if exists idx_session_expire;

drop table if exists flyway_schema_history;
