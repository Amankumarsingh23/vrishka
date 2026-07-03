"use client";

import { useState } from "react";
import type { Flower } from "@/types/flower";
import { QuickLogSheet } from "@/components/quick-log/QuickLogSheet";

export function QuickLogLauncher({ flowers }: { flowers: Flower[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Quick log"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-paper shadow-fab transition-all duration-150 ease-out hover:scale-105 hover:bg-primary-hover active:scale-95"
      >
        <span className="text-[26px] leading-none">+</span>
      </button>

      <QuickLogSheet open={open} onClose={() => setOpen(false)} flowers={flowers} />
    </>
  );
}
