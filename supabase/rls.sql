-- Row-level security for a single-user app.
--
-- There's no login flow in Vriksha today, so every request — from the
-- browser or from a Next.js Server Action — authenticates with the same
-- publishable ("anon") key. These policies grant that key full read/write
-- access to both tables, which is the only way the app can function
-- without an auth layer.
--
-- The trade-off: because the publishable key ships in the client bundle,
-- ANYONE who has your Supabase URL and this key can read and write your
-- data — there's no per-user isolation, only "you know the URL or you
-- don't." That's a reasonable trade for a private hobby project, but if
-- you ever add Supabase Auth, tighten these to `using (auth.uid() = ...)`
-- once you have a user column to check against.

alter table public.flowers enable row level security;
alter table public.events  enable row level security;

create policy "flowers: full access"
  on public.flowers
  for all
  to anon, authenticated
  using (true)
  with check (true);

create policy "events: full access"
  on public.events
  for all
  to anon, authenticated
  using (true)
  with check (true);
