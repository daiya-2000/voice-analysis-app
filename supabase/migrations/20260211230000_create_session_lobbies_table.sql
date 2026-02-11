create table if not exists public.session_lobbies (
  session_code text primary key,
  join_password text not null,
  qr_payload text not null,
  host_observer_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_session_lobbies_created_at on public.session_lobbies (created_at desc);

create or replace function public.set_updated_at_session_lobbies()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_session_lobbies_updated_at on public.session_lobbies;
create trigger trg_session_lobbies_updated_at
before update on public.session_lobbies
for each row
execute function public.set_updated_at_session_lobbies();
