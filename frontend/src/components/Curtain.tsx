import { motion } from "motion/react";
import { EASE_IO } from "../lib/motion";

/**
 * Plays on every page change: a red sheet and a black sheet pull up off the
 * new page, one after the other. Remounted (via key) for each route.
 */
export default function Curtain() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[120]" aria-hidden="true">
      <motion.div
        className="absolute inset-0 origin-top bg-blood"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.75, ease: EASE_IO, delay: 0.12 }}
      />
      <motion.div
        className="absolute inset-0 origin-top bg-ink"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.75, ease: EASE_IO }}
      />
    </div>
  );
}
