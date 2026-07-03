"use client";

import { useEffect, useState } from "react";

const TRANSITION_MS = 260;

/**
 * Shared mount/unmount + enter/exit timing for bottom-sheet-on-mobile,
 * modal-on-desktop overlays. `isRendered` controls whether the sheet is in
 * the DOM at all; `isVisible` controls the enter/exit CSS transition
 * classes. Kept as one hook so QuickLogSheet and AddFlowerSheet don't
 * duplicate (and risk diverging on) the same animation-timing logic.
 */
export function useSheetTransition(open: boolean) {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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

  return { isRendered, isVisible };
}
