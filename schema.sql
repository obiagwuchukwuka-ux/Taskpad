-- Run this in the Supabase SQL editor.
create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users on delete cascade,
  title       text not null,
  notes       text not null default '',
  priority    text not null default 'medium' check (priority in ('low','medium','high')),
  due_date    date,
  done        boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Row Level Security: each user can only see and change their own tasks.
alter table public.tasks enable row level security;

create policy "Users manage their own tasks"
  on public.tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
