import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Ecg from "./Ecg";
import Ticker from "./Ticker";

/** The last thing on every page: the dark turns red and the words fill in as you reach them. */
export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "end end"] });
  const fill = useTransform(scrollYProgress, [0.1, 0.75], ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"]);
  const red = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <footer ref={ref} className="relative mt-24 overflow-hidden">
      <Ticker items={["The world watched", "Then it scrolled past", "Nothing here is fiction", "Every image is a witness", "Do not look away"]} />

      {/* black to red: the bottom of the page bleeds as you arrive */}
      <motion.div
        className="pointer-events-none absolute inset-0 top-8 bg-gradient-to-b from-ink via-[#2a0604] to-[#8e0f09]"
        style={{ opacity: red }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1600px] px-4 pb-10 pt-16 sm:px-8">
        <Ecg className="h-20 w-full text-blood sm:h-28" />

        <div className="relative mt-8">
          <p className="hollow font-display text-[clamp(4.2rem,17vw,16rem)] uppercase leading-[0.82] tracking-tight" aria-hidden="true">
            Remember
            <br />
            them.
          </p>
          <motion.p
            className="absolute inset-0 font-display text-[clamp(4.2rem,17vw,16rem)] uppercase leading-[0.82] tracking-tight text-bone"
            style={{ clipPath: fill }}
          >
            Remember
            <br />
            <span className="text-blood">them.</span>
          </motion.p>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-bone/15 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md font-typed text-sm text-bone/80">
            A photograph is often the last witness. This archive keeps the testimony open.
          </p>
          <p className="label !text-bone/70">WorldScars · Record open since 2025 · No case closed</p>
        </div>
      </div>
    </footer>
  );
}
