import type { FlowerEventType, Stage } from "@/types/flower";

export interface StageToken {
  stage: Stage;
  index: number;
  fill: string;
  fg: string;
  wash: string;
}

export const STAGES: StageToken[] = [
  { stage: "Dormant", index: 0, fill: "#9A9080", fg: "#FBF6EA", wash: "#EEE8DA" },
  { stage: "Germinated", index: 1, fill: "#86976A", fg: "#FBF6EA", wash: "#E6EEDB" },
  { stage: "Seedling", index: 2, fill: "#6C9F5C", fg: "#FBF6EA", wash: "#E0EAD3" },
  { stage: "Vegetative", index: 3, fill: "#3E7A4B", fg: "#F6EFE1", wash: "#D9E6CC" },
  { stage: "Budding", index: 4, fill: "#CE9243", fg: "#3B2A0F", wash: "#F5E6C8" },
  { stage: "Flowering", index: 5, fill: "#C1573E", fg: "#FCEEE6", wash: "#F6DCCB" },
];

export const STAGE_ILLUSTRATION_STROKE = "#3E7A4B";

export function getStageToken(stage: Stage): StageToken {
  return STAGES.find((s) => s.stage === stage) ?? STAGES[0];
}

const EVENT_TYPE_STAGE: Partial<Record<FlowerEventType, Stage>> = {
  sown: "Dormant",
  germinated: "Germinated",
  thinned: "Seedling",
  transplanted: "Vegetative",
  budding: "Budding",
  bloomed: "Flowering",
};

/** Neutral indicator color for events that aren't a stage transition (e.g. "note"). */
export const NEUTRAL_MARKER = "#D9CFB2";

const QUICK_LOG_MARKER: Partial<Record<FlowerEventType, string>> = {
  watered: "#8FA07E",
  photo: "#CE9243",
  "disease-spotted": "#C1573E",
};

export function getEventMarkerColor(type: FlowerEventType): string {
  if (type in QUICK_LOG_MARKER) return QUICK_LOG_MARKER[type]!;
  const stage = EVENT_TYPE_STAGE[type];
  return stage ? getStageToken(stage).fill : NEUTRAL_MARKER;
}
