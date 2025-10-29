-- Members
create table if not exists public.members (
  id text primary key, -- phone or email (lowercased)
  name text not null,
  email text,
  phone text,
  created_at timestamp with time zone default now()
);

-- Pours / Points ledger
create table if not exists public.pours (
  id bigserial primary key,
  member_id text references public.members(id) on delete cascade,
  points int not null default 0,
  reason text not null, -- neat_pour, flight, new_bottle_bonus, pos_auto
  created_at timestamp with time zone default now()
);

-- Rewards catalog (for future use)
create table if not exists public.rewards (
  code text primary key, -- e.g., PERK_MICROPOUR
  name text not null,
  cost int not null default 0,
  active boolean default true
);

-- Redemptions
create table if not exists public.redemptions (
  id bigserial primary key,
  member_id text references public.members(id) on delete cascade,
  reward_code text references public.rewards(code),
  meta jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

-- Bottles (for POS whitelist / achievements later)
create table if not exists public.bottles (
  sku text primary key,
  label text not null,
  region text,
  style text, -- irish, scotch, bourbon, rye, japanese, etc.
  points_per_pour int default 1
);

-- Achievements (optional; can be computed or stored as earned badges)
create table if not exists public.achievements (
  code text primary key, -- e.g., IRISH_TENNER, PEAT_FREAK
  name text not null,
  rule jsonb not null -- future: JSON rules for unlocking
);

-- Staff users (optional future real auth/roles)
create table if not exists public.staff_users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default 'staff',
  created_at timestamp with time zone default now()
);

-- Simple view for member totals
create or replace view public.member_points as
select m.id as member_id, m.name,
  coalesce(sum(p.points),0) as total_points
from public.members m
left join public.pours p on p.member_id = m.id
group by m.id, m.name;