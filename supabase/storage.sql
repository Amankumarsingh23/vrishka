-- Storage bucket for grow-journal photos. Run after schema.sql and rls.sql
-- (Project → SQL Editor → New query → paste → Run).

insert into storage.buckets (id, name, public)
values ('grow-photos', 'grow-photos', true)
on conflict (id) do nothing;

-- Public read: photo URLs are rendered directly in <img> tags across the
-- app (gallery cards, profile hero, photo strip), so anyone holding a
-- photo's URL must be able to fetch it without authenticating.
create policy "grow-photos: public read"
on storage.objects
for select
to public
using (bucket_id = 'grow-photos');

-- Upload: same single-user trade-off as flowers/events — anyone with your
-- publishable key can upload into this bucket. No update/delete policy is
-- included since the app never edits or removes a photo once uploaded;
-- add one later if you build that.
create policy "grow-photos: anon upload"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'grow-photos');
