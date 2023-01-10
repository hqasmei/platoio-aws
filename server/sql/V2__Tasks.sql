-- IMPORTANT: Once applied, migration files CANNOT be changed, even the whitespace or comments.
-- The hash flyway uses to compare applied versions uses the entire file, including whitespace and comments!

create type task_status as enum ('To Be Done', 'In Progress', 'Done');

-- creates table for tasks
create table tasks (
    id uuid unique not null primary key default gen_random_uuid(),
    task text,
    task_status task_status,
    user_id uuid not null constraint fk_users_id references users(id),
    created_at timestamp with time zone not null default now(),
    deleted_at timestamp with time zone
);

