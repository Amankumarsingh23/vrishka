export type Stage =
  | "Dormant"
  | "Germinated"
  | "Seedling"
  | "Vegetative"
  | "Budding"
  | "Flowering";

export const STAGE_ORDER: Stage[] = [
  "Dormant",
  "Germinated",
  "Seedling",
  "Vegetative",
  "Budding",
  "Flowering",
];

export type FlowerGroup = 1 | 2 | 3 | 4;

export const GROUP_LABELS: Record<FlowerGroup, string> = {
  1: "Direct Sow — Thriving",
  2: "Started in Cups",
  3: "Borderline",
  4: "Wrong Season — Dormant",
};

export type FlowerEventType =
  | "sown"
  | "germinated"
  | "thinned"
  | "transplanted"
  | "budding"
  | "bloomed"
  | "note"
  | "watered"
  | "photo"
  | "disease-spotted"
  | "stage-change";

export interface FlowerEvent {
  type: FlowerEventType;
  /** ISO date, e.g. "2026-06-24" */
  date: string;
  label: string;
  /** Days since sowing (0 = sow day). */
  dayNumber: number;
  notes?: string;
  /** Only set when type is "stage-change" — the stage the flower moved to. */
  toStage?: Stage;
  photoUrl?: string;
}

export interface Flower {
  id: string;
  bucketNo: number;
  commonName: string;
  latinName: string;
  group: FlowerGroup;
  groupLabel: string;
  stage: Stage;
  daysPlanted: number;
  sowMethod: string;
  sunNeeds: string;
  wateringRule: string;
  expectedGerminationDays: string;
  diseaseRisk: string;
  note: string;
  events: FlowerEvent[];
}
