-- SYBORG Typing Arena — live competition schema
-- Run this once in the Supabase SQL Editor (Table Editor → SQL Editor → New query)

create table if not exists rooms (
  code text primary key,
  host_name text not null,
  difficulty text not null,
  prompt_mode text not null default 'words',
  seed bigint not null,
  status text not null default 'lobby', -- lobby | running | finished
  created_at timestamptz not null default now()
);

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  room_code text not null references rooms(code) on delete cascade,
  name text not null,
  wpm int not null default 0,
  accuracy int not null default 100,
  progress int not null default 0, -- characters typed, for a live progress bar
  finished boolean not null default false,
  joined_at timestamptz not null default now()
);

-- club-internal, no auth: allow anon read/write scoped to what the app needs.
alter table rooms enable row level security;
alter table players enable row level security;

create policy "anyone can read rooms" on rooms for select using (true);
create policy "anyone can create rooms" on rooms for insert with check (true);
create policy "anyone can update rooms" on rooms for update using (true);

create policy "anyone can read players" on players for select using (true);
create policy "anyone can join as a player" on players for insert with check (true);
create policy "anyone can update their own progress" on players for update using (true);

-- auto-expire old rooms (run manually or on a schedule) — optional housekeeping
-- delete from rooms where created_at < now() - interval '2 hours';

-- enable realtime broadcasts for live progress updates
alter publication supabase_realtime add table players;
alter publication supabase_realtime add table rooms;
