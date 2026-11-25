/** Shared motion curves so every animation on the site moves the same way. */
export const EASE = [0.2, 0.7, 0.1, 1] as const; // long, soft settle
export const EASE_IO = [0.76, 0, 0.24, 1] as const; // curtains and wipes

/** Two heartbeats on a 1000 x 100 canvas: P wave, QRS spike, T wave. */
export const ECG_PATH =
  "M0 50 L290 50 L308 44 L324 50 L342 50 L352 58 L364 6 L378 94 L390 50 L418 50 L440 37 L466 50 L612 50 L630 44 L646 50 L664 50 L674 58 L686 6 L700 94 L712 50 L740 50 L762 37 L788 50 L1000 50";

/** A flatline with one last, weak flicker. */
export const FLAT_PATH = "M0 50 L470 50 L482 43 L494 52 L504 50 L1000 50";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** The opening sequence plays once per visit; pages delay their entrance behind it. */
export const INTRO_KEY = "worldscars.intro";

export function introPending(): boolean {
  if (prefersReducedMotion()) return false;
  try {
    return !sessionStorage.getItem(INTRO_KEY);
  } catch {
    return false;
  }
}

export function hasFinePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
