import type { Flower, FlowerEvent, FlowerEventType, FlowerGroup, Stage } from "@/types/flower";
import { GROUP_LABELS } from "@/types/flower";
import { supabase } from "@/lib/supabase/client";

/**
 * Data-access layer for flowers, backed by Supabase. Every exported
 * function here keeps the exact same name/signature it had when this
 * module read from the in-memory mock — screens import from "@/lib/data/flowers"
 * and never touch Supabase directly, so this file is the only thing that
 * changed when we swapped storage.
 */

interface FlowerRow {
  id: string;
  bucket_no: number;
  common_name: string;
  latin_name: string;
  group_no: number;
  group_label: string;
  stage: string;
  days_planted: number;
  sow_method: string;
  sun_needs: string;
  watering_rule: string;
  expected_germination_days: string;
  disease_risk: string;
  note: string;
  events?: EventRow[];
}

interface EventRow {
  id: string;
  flower_id: string;
  type: string;
  label: string;
  day_number: number;
  notes: string | null;
  photo_url: string | null;
  to_stage: string | null;
  created_at: string;
}

const FLOWER_SELECT = "*, events(*)";

function mapEventRow(row: EventRow): FlowerEvent {
  return {
    type: row.type as FlowerEventType,
    date: row.created_at.slice(0, 10),
    label: row.label,
    dayNumber: row.day_number,
    notes: row.notes ?? undefined,
    toStage: (row.to_stage as Stage | null) ?? undefined,
    photoUrl: row.photo_url ?? undefined,
  };
}

function mapFlowerRow(row: FlowerRow): Flower {
  // Sorted by created_at (true chronological order) rather than dayNumber:
  // every event logged live through the app gets dayNumber = the flower's
  // current (frozen) daysPlanted, so two events logged on different real
  // days can tie on dayNumber. created_at never ties in practice, so it's
  // the only reliable way to tell which photo/event is actually newest.
  const sortedRows = [...(row.events ?? [])].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  return {
    id: row.id,
    bucketNo: row.bucket_no,
    commonName: row.common_name,
    latinName: row.latin_name,
    group: row.group_no as FlowerGroup,
    groupLabel: row.group_label,
    stage: row.stage as Stage,
    daysPlanted: row.days_planted,
    sowMethod: row.sow_method,
    sunNeeds: row.sun_needs,
    wateringRule: row.watering_rule,
    expectedGerminationDays: row.expected_germination_days,
    diseaseRisk: row.disease_risk,
    note: row.note,
    events: sortedRows.map(mapEventRow),
  };
}

export async function listFlowers(): Promise<Flower[]> {
  const { data, error } = await supabase.from("flowers").select(FLOWER_SELECT).order("bucket_no");
  if (error) throw error;
  return (data as unknown as FlowerRow[]).map(mapFlowerRow);
}

export async function getFlower(id: string): Promise<Flower | undefined> {
  const { data, error } = await supabase
    .from("flowers")
    .select(FLOWER_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapFlowerRow(data as unknown as FlowerRow) : undefined;
}

export async function listFlowersByGroup(group: FlowerGroup): Promise<Flower[]> {
  const { data, error } = await supabase
    .from("flowers")
    .select(FLOWER_SELECT)
    .eq("group_no", group)
    .order("bucket_no");
  if (error) throw error;
  return (data as unknown as FlowerRow[]).map(mapFlowerRow);
}

export async function listFlowersByStage(stage: Stage): Promise<Flower[]> {
  const { data, error } = await supabase
    .from("flowers")
    .select(FLOWER_SELECT)
    .eq("stage", stage)
    .order("bucket_no");
  if (error) throw error;
  return (data as unknown as FlowerRow[]).map(mapFlowerRow);
}

export async function appendFlowerEvent(id: string, event: FlowerEvent): Promise<Flower | undefined> {
  const { error } = await supabase.from("events").insert({
    flower_id: id,
    type: event.type,
    label: event.label,
    day_number: event.dayNumber,
    notes: event.notes ?? null,
    photo_url: event.photoUrl ?? null,
    to_stage: event.toStage ?? null,
    created_at: `${event.date}T12:00:00Z`,
  });
  if (error) throw error;
  return getFlower(id);
}

export async function setFlowerStage(id: string, stage: Stage): Promise<Flower | undefined> {
  const { error } = await supabase.from("flowers").update({ stage }).eq("id", id);
  if (error) throw error;
  return getFlower(id);
}

export interface NewFlowerInput {
  commonName: string;
  latinName?: string;
  group: FlowerGroup;
  sowMethod?: string;
  sunNeeds?: string;
  wateringRule?: string;
  expectedGerminationDays?: string;
  diseaseRisk?: string;
  note?: string;
}

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base || "bucket";
}

/**
 * New buckets always start Dormant at day 0 with no events — same rule
 * as everything else in this app: nothing is "planted" until you log it
 * yourself. bucketNo auto-increments past whatever's already there; id is
 * a slug derived from the name, disambiguated against existing ids.
 */
export async function createFlower(input: NewFlowerInput): Promise<Flower> {
  const existing = await listFlowers();
  const existingIds = new Set(existing.map((f) => f.id));

  const baseSlug = slugify(input.commonName);
  let id = baseSlug;
  let suffix = 2;
  while (existingIds.has(id)) {
    id = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const nextBucketNo = existing.reduce((max, f) => Math.max(max, f.bucketNo), 0) + 1;

  const { data, error } = await supabase
    .from("flowers")
    .insert({
      id,
      bucket_no: nextBucketNo,
      common_name: input.commonName,
      latin_name: input.latinName ?? "",
      group_no: input.group,
      group_label: GROUP_LABELS[input.group],
      stage: "Dormant",
      days_planted: 0,
      sow_method: input.sowMethod ?? "",
      sun_needs: input.sunNeeds ?? "",
      watering_rule: input.wateringRule ?? "",
      expected_germination_days: input.expectedGerminationDays ?? "",
      disease_risk: input.diseaseRisk ?? "",
      note: input.note ?? "",
    })
    .select(FLOWER_SELECT)
    .single();

  if (error) throw error;
  return mapFlowerRow(data as unknown as FlowerRow);
}
