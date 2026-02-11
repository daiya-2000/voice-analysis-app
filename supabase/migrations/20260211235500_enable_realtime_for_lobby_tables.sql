do $$
begin
  alter publication supabase_realtime add table public.observer_profiles;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.session_lobbies;
exception
  when duplicate_object then null;
end $$;
