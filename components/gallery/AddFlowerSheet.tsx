"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GROUP_LABELS, type FlowerGroup } from "@/types/flower";
import { cn } from "@/lib/utils";
import { useSheetTransition } from "@/lib/hooks/useSheetTransition";
import { ToggleChip } from "@/components/quick-log/ToggleChip";
import { addFlower } from "@/lib/actions/flowers";

const CLOSE_AFTER_CONFIRM_MS = 900;

const GROUPS: FlowerGroup[] = [1, 2, 3, 4];

function TextField({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <p className="mb-1.5 font-sans text-caption uppercase text-muted">
        {label} {!required && <span className="normal-case text-muted/70">(optional)</span>}
      </p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-border bg-surface px-3.5 py-2 font-sans text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none"
      />
    </div>
  );
}

export function AddFlowerSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { isRendered, isVisible } = useSheetTransition(open);

  const [commonName, setCommonName] = useState("");
  const [latinName, setLatinName] = useState("");
  const [group, setGroup] = useState<FlowerGroup | null>(null);
  const [sunNeeds, setSunNeeds] = useState("");
  const [wateringRule, setWateringRule] = useState("");
  const [expectedGerminationDays, setExpectedGerminationDays] = useState("");
  const [diseaseRisk, setDiseaseRisk] = useState("");
  const [sowMethod, setSowMethod] = useState("");
  const [note, setNote] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isRendered) return null;

  function reset() {
    setCommonName("");
    setLatinName("");
    setGroup(null);
    setSunNeeds("");
    setWateringRule("");
    setExpectedGerminationDays("");
    setDiseaseRisk("");
    setSowMethod("");
    setNote("");
    setIsSubmitting(false);
    setSuccessMessage(null);
    setErrorMessage(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  const canSubmit = commonName.trim().length > 0 && group !== null;

  async function handleSubmit() {
    if (!canSubmit || group === null) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await addFlower({
        commonName,
        latinName: latinName || undefined,
        group,
        sunNeeds: sunNeeds || undefined,
        wateringRule: wateringRule || undefined,
        expectedGerminationDays: expectedGerminationDays || undefined,
        diseaseRisk: diseaseRisk || undefined,
        sowMethod: sowMethod || undefined,
        note: note || undefined,
      });
      router.refresh();
      setSuccessMessage(`Added ${commonName} to your gallery.`);
      setTimeout(handleClose, CLOSE_AFTER_CONFIRM_MS);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(
        err instanceof Error ? `Couldn't add that: ${err.message}` : "Couldn't add that — try again.",
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className={cn(
          "absolute inset-0 bg-ink/40 transition-opacity duration-300 ease-out",
          isVisible ? "opacity-100" : "opacity-0",
        )}
        onClick={handleClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add a flower"
        className={cn(
          "relative flex w-full flex-col overflow-hidden rounded-t-card bg-surface shadow-card-hover transition-all duration-300 ease-out",
          "max-h-[85vh] sm:my-8 sm:max-h-[80vh] sm:w-full sm:max-w-lg sm:rounded-card",
          isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-full opacity-0 sm:translate-y-4 sm:scale-95",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-serif text-h3 text-ink">Add a Flower</h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-full text-lg text-muted transition-colors hover:bg-track hover:text-ink"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {successMessage ? (
            <div className="rounded-card-sm border border-border bg-track/40 px-4 py-6 text-center font-sans text-sm font-medium text-ink">
              {successMessage}
            </div>
          ) : (
            <div className="space-y-5">
              <p className="font-sans text-sm text-body">
                New buckets start Dormant at day 0 — nothing&apos;s assumed planted until
                you log it with Quick Log.
              </p>

              {errorMessage && (
                <div className="rounded-card-sm border border-accent/40 bg-accent/10 px-4 py-3 font-sans text-sm text-ink">
                  {errorMessage}
                </div>
              )}

              <TextField
                label="Common name"
                value={commonName}
                onChange={setCommonName}
                placeholder="e.g. Portulaca"
                required
              />
              <TextField
                label="Latin name"
                value={latinName}
                onChange={setLatinName}
                placeholder="e.g. Portulaca grandiflora"
              />

              <div>
                <p className="mb-1.5 font-sans text-caption uppercase text-muted">Group</p>
                <div className="flex flex-wrap gap-2">
                  {GROUPS.map((g) => (
                    <ToggleChip
                      key={g}
                      label={GROUP_LABELS[g]}
                      selected={group === g}
                      onClick={() => setGroup(g)}
                    />
                  ))}
                </div>
              </div>

              <TextField
                label="Sun needs"
                value={sunNeeds}
                onChange={setSunNeeds}
                placeholder="e.g. Full sun"
              />
              <TextField
                label="Watering"
                value={wateringRule}
                onChange={setWateringRule}
                placeholder="e.g. Keep soil evenly moist"
              />
              <TextField
                label="Germination window"
                value={expectedGerminationDays}
                onChange={setExpectedGerminationDays}
                placeholder="e.g. 7-10 days"
              />
              <TextField
                label="Disease risk"
                value={diseaseRisk}
                onChange={setDiseaseRisk}
                placeholder="e.g. Root rot in waterlogged soil"
              />
              <TextField
                label="Sow method"
                value={sowMethod}
                onChange={setSowMethod}
                placeholder="e.g. Direct sow into bed"
              />

              <div>
                <p className="mb-1.5 font-sans text-caption uppercase text-muted">
                  Note <span className="normal-case text-muted/70">(optional)</span>
                </p>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Add a note…"
                  className="w-full resize-none rounded-card-sm border border-border bg-surface px-3.5 py-2.5 font-sans text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {!successMessage && (
          <div className="border-t border-border px-5 py-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="w-full rounded-full bg-primary px-4 py-3 text-center font-sans text-sm font-semibold text-paper transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Adding…" : "Add to Gallery"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
