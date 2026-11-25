import { motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { EASE } from "../lib/motion";

/**
 * Words rise one by one out of a hidden line, like type surfacing from the dark.
 * Screen readers get the plain sentence.
 */
export function Words({
  text,
  className = "",
  delay = 0,
  stagger = 0.06,
  immediate = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  /** animate on mount instead of when scrolled into view */
  immediate?: boolean;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          <Word word={w} immediate={immediate} delay={delay + i * stagger} />
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}

/**
 * One word in its mask. Once it has risen, the mask opens so glows and
 * descenders are never cut off.
 */
function Word({ word, immediate, delay }: { word: string; immediate: boolean; delay: number }) {
  const [risen, setRisen] = useState(false);
  const play = immediate ? { animate: { y: "0%" } } : { whileInView: { y: "0%" }, viewport: { once: true, margin: "0px 0px -10% 0px" } };
  return (
    <span className={`inline-block pb-[0.1em] align-bottom -mb-[0.1em] ${risen ? "overflow-visible" : "overflow-hidden"}`}>
      <motion.span
        className="inline-block"
        initial={{ y: "115%" }}
        {...play}
        transition={{ duration: 1, ease: EASE, delay }}
        onAnimationComplete={() => setRisen(true)}
      >
        {word}
      </motion.span>
    </span>
  );
}

/** Fade-and-rise when the block scrolls into view. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 40,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
