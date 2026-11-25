import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { EASE, EASE_IO, ECG_PATH, INTRO_KEY, introPending } from "../lib/motion";
import { lockScroll } from "../lib/scroll";

const LENGTH = 3200;

/**
 * The first thing a visitor sees, once per visit: a heart monitor draws two
 * beats across the dark, a counter climbs, a sentence surfaces. Then the
 * screen tears open. Any click or key skips it.
 */
export default function Intro() {
  const [show, setShow] = useState(introPending);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!show) return;
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* will just play again */
    }
    lockScroll(true);

    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (LENGTH - 700));
      setCount(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const done = window.setTimeout(() => setShow(false), LENGTH);
    const skip = () => setShow(false);
    window.addEventListener("keydown", skip);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(done);
      window.removeEventListener("keydown", skip);
      lockScroll(false);
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[150] cursor-pointer"
          onClick={() => setShow(false)}
          aria-hidden="true"
        >
          {/* the two halves of the dark that tear apart */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-ink"
            exit={{ y: "-100%" }}
            transition={{ duration: 1.1, ease: EASE_IO, delay: 0.25 }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-ink"
            exit={{ y: "100%" }}
            transition={{ duration: 1.1, ease: EASE_IO, delay: 0.25 }}
          />
          {/* the seam glows red as it opens */}
          <motion.div
            className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ember glow-box"
            initial={{ scaleX: 0, opacity: 0 }}
            exit={{ scaleX: 1, opacity: [0, 1, 0] }}
            transition={{ duration: 0.9, ease: EASE_IO }}
          />

          <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="absolute left-0 top-1/2 h-[18vh] w-full -translate-y-1/2 text-ember">
              <motion.path
                d={ECG_PATH}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.4, ease: "linear" }}
                style={{ filter: "drop-shadow(0 0 8px rgba(255,53,39,0.95))" }}
              />
            </svg>

            <div className="absolute inset-x-0 top-[calc(50%+12vh)] px-6 text-center">
              <motion.p
                className="font-serif text-[clamp(1.5rem,3.4vw,2.6rem)] italic leading-tight text-bone"
                initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
              >
                Everything you are about to see
              </motion.p>
              <motion.p
                className="font-serif text-[clamp(1.5rem,3.4vw,2.6rem)] italic leading-tight text-ember glow"
                initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1.2, ease: EASE, delay: 1.3 }}
              >
                happened to someone.
              </motion.p>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-6 sm:px-8">
              <p className="label">Opening the record</p>
              <p className="font-display text-[clamp(3rem,9vw,7rem)] leading-none text-bone/90 tabular-nums">
                {String(count).padStart(3, "0")}
              </p>
            </div>
            <p className="label absolute left-4 top-6 sm:left-8">WorldScars</p>
            <p className="label absolute right-4 top-6 sm:right-8">Click to skip</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
