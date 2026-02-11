create extension if not exists pgcrypto;

create table if not exists public.observer_profiles (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  avatar_preset_id text not null,
  observer_role text not null check (observer_role in ('host', 'observer')),
  session_code text,
  created_at timestamptz not null default now()
);

create table if not exists public.voice_enrollments (
  id uuid primary key default gen_random_uuid(),
  observer_id uuid not null,
  session_code text,
  observer_role text not null check (observer_role in ('host', 'observer')),
  display_name text not null,
  avatar_preset_id text not null,
  script_id text not null,
  script_text text not null,
  script_objective text not null,
  transcript_estimate text,
  tendency_summary text not null,
  confidence numeric not null,
  duration_ms integer,
  created_at timestamptz not null default now()
);

create index if not exists idx_voice_enrollments_observer_id on public.voice_enrollments (observer_id);
create index if not exists idx_voice_enrollments_session_code on public.voice_enrollments (session_code);
