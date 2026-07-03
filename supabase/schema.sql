-- Vriksha schema: run this once in the Supabase SQL Editor
-- (Project → SQL Editor → New query → paste → Run).

create extension if not exists pgcrypto;

-- One row per bucket. `id` keeps the same kebab-case slug used throughout
-- the app today (e.g. "african-marigold") so routes and the data module
-- don't need to change.
create table if not exists public.flowers (
  id                        text primary key,
  bucket_no                 integer not null unique,
  common_name               text not null,
  latin_name                text not null,
  -- "group" is a reserved word in Postgres, hence group_no/group_label.
  group_no                  integer not null check (group_no in (1, 2, 3, 4)),
  group_label               text not null,
  stage                     text not null check (
    stage in ('Dormant', 'Germinated', 'Seedling', 'Vegetative', 'Budding', 'Flowering')
  ),
  days_planted              integer not null default 0,
  sow_method                text not null,
  sun_needs                 text not null,
  watering_rule             text not null,
  expected_germination_days text not null,
  disease_risk              text not null,
  note                      text not null default ''
);

create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  flower_id   text not null references public.flowers (id) on delete cascade,
  type        text not null check (
    type in (
      'sown', 'germinated', 'thinned', 'transplanted', 'budding', 'bloomed',
      'note', 'watered', 'photo', 'disease-spotted', 'stage-change'
    )
  ),
  label       text not null,
  day_number  integer not null,
  notes       text,
  photo_url   text,
  -- Not in the originally requested column list, but required to keep the
  -- app's "stage-change" events working: the timeline/care-log dot color
  -- for a stage-change event comes from the stage it moved TO, and that
  -- has nowhere else to live. Drop this column (and the check constraint)
  -- if you'd rather not carry it.
  to_stage    text check (
    to_stage is null or to_stage in
      ('Dormant', 'Germinated', 'Seedling', 'Vegetative', 'Budding', 'Flowering')
  ),
  -- Doubles as the event's logical date — the app never shows time-of-day,
  -- just the date part. For the seed data this is set explicitly to the
  -- historical date instead of "now"; for events logged live through the
  -- app it's left to default, which is exactly "when this was logged."
  created_at  timestamptz not null default now()
);

create index if not exists events_flower_id_idx on public.events (flower_id);
