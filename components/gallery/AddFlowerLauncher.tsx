"use client";

import { useState } from "react";
import { AddFlowerSheet } from "@/components/gallery/AddFlowerSheet";

export function AddFlowerLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 font-sans text-sm font-semibold text-paper transition-colors hover:bg-primary-hover"
      >
        <span aria-hidden className="text-base leading-none">+</span>
        Add Flower
      </button>

      <AddFlowerSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}
