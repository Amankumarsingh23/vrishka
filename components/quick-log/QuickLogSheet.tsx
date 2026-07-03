"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Flower } from "@/types/flower";
import { STAGES } from "@/lib/stages";
import { cn } from "@/lib/utils";
import { uploadFlowerPhoto } from "@/lib/upload/uploadFlowerPhoto";
import { StagePill } from "@/components/ui/StagePill";
import { ToggleChip } from "@/components/quick-log/ToggleChip";
import {
  submitQuickLog,
  waterAllOutdoorBuckets,
  type QuickLogAction,
} from "@/lib/actions/quick-log";

const TRANSITION_MS = 260;
const CLOSE_AFTER_CONFIRM_MS = 700;

const ACTION_OPTIONS: Array<{ key: QuickLogAction; label: string }> = [
  { key: "watered", label: "Watered" },
  { key: "photo", label: "Photo" },
  { key: "stage-change", label: "Stage change" },
  { key: "note", label: "Note" },
  { key: "disease-spotted", label: "Disease spotted" },
];

function CheckIcon() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
      <path d="M1 4L3.5 6.5L9 1" stroke="#FBF6EA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function QuickLogSheet({
  open,
  onClose,
  flowers,
}: {
  open: boolean;
  onClose: () => void;
  flowers: Flower[];
}) {
  const router = useRouter();
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [action, setAction] = useState<QuickLogAction | null>(null);
  const [toStage, setToStage] = useState<Flower["stage"] | null>(null);
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressLabel, setProgressLabel] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const outdoorCount = useMemo(
    () => flowers.filter((f) => f.group === 1 || f.group === 3).length,
    [flowers],
  );

  const filteredFlowers = useMemo(
    () => flowers.filter((f) => f.commonName.toLowerCase().includes(search.trim().toLowerCase())),
    [flowers, search],
  );

  useEffect(() => {
    if (open) {
      setIsRendered(true);
      const raf = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setIsVisible(false);
    const timeout = setTimeout(() => setIsRendered(false), TRANSITION_MS);
    return () => clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (isRendered) return;
    setSelectedIds(new Set());
    setAction(null);
    setToStage(null);
    setNote("");
    setSearch("");
    setPhotoFile(null);
    setPhotoPreviewUrl(null);
    setSuccessMessage(null);
    setErrorMessage(null);
    setProgressLabel(null);
    setIsSubmitting(false);
  }, [isRendered]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!isRendered) return null;

  function toggleFlower(id: string) {
    // A photo belongs to exactly one bucket, so picking one while the
    // Photo action is active replaces the selection instead of adding to it.
    if (action === "photo") {
      setSelectedIds(new Set([id]));
      return;
    }
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAction(key: QuickLogAction) {
    setAction(key);
    if (key === "photo" && selectedIds.size > 1) {
      setSelectedIds(new Set(Array.from(selectedIds).slice(0, 1)));
    }
  }

  function selectAllFiltered() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      filteredFlowers.forEach((f) => next.add(f.id));
      return next;
    });
  }

  function handlePhotoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoFile(file);
    setPhotoPreviewUrl(URL.createObjectURL(file));
  }

  // Optimistic: the success message shows the instant the request fires,
  // before the network round-trip to Supabase resolves — logging should
  // feel instant even though it's now backed by a real database. If the
  // write actually fails outright, we swap the optimistic message for an
  // error and leave the sheet open so nothing is silently lost. If it
  // partially succeeds (some buckets in a batch failed, not all), we
  // correct the message with the real count rather than leaving the
  // optimistic guess uncorrected.
  async function runQuickLog(
    task: () => Promise<{ count: number }>,
    expectedCount: number,
    describeCount: (count: number) => string,
  ) {
    setSuccessMessage(describeCount(expectedCount));
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const result = await task();
      if (result.count !== expectedCount) {
        setSuccessMessage(
          `${describeCount(result.count)} (${expectedCount - result.count} didn't save — try again for those.)`,
        );
      }
      router.refresh();
      setTimeout(onClose, CLOSE_AFTER_CONFIRM_MS);
    } catch (err) {
      setSuccessMessage(null);
      setIsSubmitting(false);
      setErrorMessage(
        err instanceof Error
          ? `Couldn't save that: ${err.message}`
          : "Couldn't save that — check your connection and try again.",
      );
    }
  }

  function handleWaterAllOutdoor() {
    if (outdoorCount === 0 || isSubmitting) return;
    runQuickLog(
      waterAllOutdoorBuckets,
      outdoorCount,
      (n) => `Watered ${n} outdoor bucket${n === 1 ? "" : "s"}.`,
    );
  }

  const noteRequired = action === "note" || action === "disease-spotted";
  const canSubmit =
    action !== null &&
    selectedIds.size > 0 &&
    (action !== "stage-change" || toStage !== null) &&
    (action !== "photo" || photoFile !== null) &&
    (!noteRequired || note.trim().length > 0);

  // Photo uploads are slower and more failure-prone than a plain DB write
  // (compression + a real network transfer, not just an insert), so unlike
  // the other actions this isn't shown as instantly-optimistic — the user
  // sees real progress instead of a success message that might be a lie.
  async function handlePhotoSubmit() {
    if (!photoFile || selectedIds.size !== 1) return;
    const flowerId = Array.from(selectedIds)[0];

    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      setProgressLabel("Uploading photo…");
      const photoUrl = await uploadFlowerPhoto(flowerId, photoFile);
      setProgressLabel("Saving…");
      await submitQuickLog({
        action: "photo",
        flowerIds: [flowerId],
        photoUrl,
        note: note.trim() || undefined,
      });
      router.refresh();
      setProgressLabel(null);
      setSuccessMessage("Photo added.");
      setTimeout(onClose, CLOSE_AFTER_CONFIRM_MS);
    } catch (err) {
      setProgressLabel(null);
      setIsSubmitting(false);
      setErrorMessage(
        err instanceof Error ? `Couldn't upload that photo: ${err.message}` : "Couldn't upload that photo.",
      );
    }
  }

  function handleSubmit() {
    if (!action || !canSubmit) return;

    if (action === "photo") {
      handlePhotoSubmit();
      return;
    }

    const count = selectedIds.size;
    const actionLabel = ACTION_OPTIONS.find((o) => o.key === action)?.label ?? "entry";
    runQuickLog(
      () =>
        submitQuickLog({
          action,
          flowerIds: Array.from(selectedIds),
          note: note.trim() || undefined,
          toStage: action === "stage-change" ? toStage ?? undefined : undefined,
        }),
      count,
      (n) => `Logged ${actionLabel.toLowerCase()} for ${n} bucket${n === 1 ? "" : "s"}.`,
    );
  }

  const confirmLabel = action
    ? action === "photo"
      ? `Upload photo for ${selectedIds.size} bucket${selectedIds.size === 1 ? "" : "s"}`
      : `Log ${ACTION_OPTIONS.find((o) => o.key === action)?.label.toLowerCase()} for ${selectedIds.size} bucket${selectedIds.size === 1 ? "" : "s"}`
    : "Confirm";

  return (
    <div className={cn("fixed inset-0 z-50 flex items-end justify-center sm:items-center")}>
      <div
        className={cn(
          "absolute inset-0 bg-ink/40 transition-opacity duration-300 ease-out",
          isVisible ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Quick log"
        className={cn(
          "relative flex w-full flex-col overflow-hidden rounded-t-card bg-surface shadow-card-hover transition-all duration-300 ease-out",
          "max-h-[85vh] sm:my-8 sm:max-h-[80vh] sm:w-full sm:max-w-lg sm:rounded-card",
          isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-full opacity-0 sm:translate-y-4 sm:scale-95",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-serif text-h3 text-ink">Quick Log</h2>
          <button
            type="button"
            onClick={onClose}
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
          ) : progressLabel ? (
            <div className="rounded-card-sm border border-border bg-track/40 px-4 py-6 text-center font-sans text-sm font-medium text-ink">
              <span className="animate-pulse">{progressLabel}</span>
            </div>
          ) : flowers.length === 0 ? (
            <div className="rounded-card-sm border border-border bg-track/40 px-4 py-6 text-center font-sans text-sm text-body">
              No buckets yet — seed your Supabase database to start logging.
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="mb-4 rounded-card-sm border border-accent/40 bg-accent/10 px-4 py-3 font-sans text-sm text-ink">
                  {errorMessage}
                </div>
              )}

              <button
                type="button"
                onClick={handleWaterAllOutdoor}
                disabled={isSubmitting || outdoorCount === 0}
                className="flex w-full items-center justify-between rounded-card border border-sage/40 bg-sage/10 px-4 py-3.5 text-left transition-colors hover:bg-sage/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>
                  <span className="block font-sans text-sm font-semibold text-ink">
                    Water all outdoor buckets
                  </span>
                  <span className="mt-0.5 block font-sans text-xs text-muted">
                    {outdoorCount === 0
                      ? "No outdoor buckets to water"
                      : `${outdoorCount} buckets · Groups 1 & 3 · one tap`}
                  </span>
                </span>
                <span aria-hidden className="font-serif text-xl text-primary">→</span>
              </button>

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="font-sans text-xs font-medium uppercase tracking-wide text-muted">
                  or log manually
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-sans text-caption uppercase text-muted">
                    Buckets ({selectedIds.size} selected)
                    {action === "photo" && " · choose one"}
                  </p>
                  <div className="flex shrink-0 gap-3">
                    {action !== "photo" && (
                      <button
                        type="button"
                        onClick={selectAllFiltered}
                        className="font-sans text-xs font-medium text-primary hover:underline"
                      >
                        Select all
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedIds(new Set())}
                      className="font-sans text-xs font-medium text-muted hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search buckets…"
                  className="mb-2 w-full rounded-full border border-border bg-surface px-3.5 py-2 font-sans text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none"
                />

                <div className="max-h-52 space-y-1 overflow-y-auto rounded-card-sm border border-border bg-paper/40 p-2">
                  {filteredFlowers.length === 0 && (
                    <p className="px-2 py-3 text-center font-sans text-sm text-muted">
                      No buckets match &quot;{search}&quot;.
                    </p>
                  )}
                  {filteredFlowers.map((flower) => {
                    const checked = selectedIds.has(flower.id);
                    return (
                      <button
                        type="button"
                        key={flower.id}
                        onClick={() => toggleFlower(flower.id)}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 rounded-card-sm px-2.5 py-2 text-left transition-colors",
                          checked ? "bg-primary/10" : "hover:bg-track/60",
                        )}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span
                            className={cn(
                              "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                              checked ? "border-primary bg-primary" : "border-border-alt bg-surface",
                            )}
                          >
                            {checked && <CheckIcon />}
                          </span>
                          <span className="truncate font-sans text-sm text-body">
                            <span className="text-muted">
                              #{String(flower.bucketNo).padStart(2, "0")}
                            </span>{" "}
                            {flower.commonName}
                          </span>
                        </span>
                        <StagePill stage={flower.stage} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-2 font-sans text-caption uppercase text-muted">Action</p>
                <div className="flex flex-wrap gap-2">
                  {ACTION_OPTIONS.map((opt) => (
                    <ToggleChip
                      key={opt.key}
                      label={opt.label}
                      selected={action === opt.key}
                      onClick={() => selectAction(opt.key)}
                    />
                  ))}
                </div>
              </div>

              {action === "stage-change" && (
                <div className="mt-5">
                  <p className="mb-2 font-sans text-caption uppercase text-muted">New stage</p>
                  <div className="flex flex-wrap gap-2">
                    {STAGES.map((s) => (
                      <ToggleChip
                        key={s.stage}
                        label={s.stage}
                        selected={toStage === s.stage}
                        onClick={() => setToStage(s.stage)}
                        color={s.fill}
                      />
                    ))}
                  </div>
                </div>
              )}

              {action === "photo" && (
                <div className="mt-5">
                  <p className="mb-2 font-sans text-caption uppercase text-muted">Photo</p>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoFileChange}
                    className="hidden"
                  />
                  {photoPreviewUrl ? (
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoPreviewUrl}
                        alt="Selected preview"
                        className="h-20 w-20 rounded-thumb border border-border object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="font-sans text-sm font-medium text-primary hover:underline"
                      >
                        Choose a different photo
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="flex w-full items-center justify-center gap-2 rounded-card-sm border-2 border-dashed border-border-alt py-6 font-sans text-sm font-medium text-muted transition-colors hover:border-primary hover:text-primary"
                    >
                      <span className="text-lg leading-none">+</span>
                      Take or choose a photo
                    </button>
                  )}
                </div>
              )}

              {action && (
                <div className="mt-5">
                  <p className="mb-2 font-sans text-caption uppercase text-muted">
                    {noteRequired ? "Details" : action === "photo" ? "Caption (optional)" : "Notes (optional)"}
                  </p>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    placeholder={
                      action === "disease-spotted"
                        ? "e.g. powdery mildew on lower leaves"
                        : "Add a note…"
                    }
                    className="w-full resize-none rounded-card-sm border border-border bg-surface px-3.5 py-2.5 font-sans text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {!successMessage && !progressLabel && flowers.length > 0 && (
          <div className="border-t border-border px-5 py-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="w-full rounded-full bg-primary px-4 py-3 text-center font-sans text-sm font-semibold text-paper transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {confirmLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
