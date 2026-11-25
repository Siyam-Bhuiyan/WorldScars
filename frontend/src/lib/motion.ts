export const EASE = [0.2, 0.7, 0.1, 1] as const; // long, soft settle
export const EASE_IO = [0.76, 0, 0.24, 1] as const; // curtains and wipes

/** Two heartbeats on a 1000 x 100 canvas: P wave, QRS spike, T wave. */
export const ECG_PATH =
  "M0 50 L290 50 L308 44 L324 50 L342 50 L352 58 L364 6 L378 94 L390 50 L418 50 L440 37 L466 50 L612 50 L630 44 L646 50 L664 50 L674 58 L686 6 L700 94 L712 50 L740 50 L762 37 L788 50 L1000 50";
