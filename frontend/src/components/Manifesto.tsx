import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

const MANIFESTO =
  "Every photograph here was once on every screen in the world. For a day. Maybe two. Then the feed moved on. The people in them *did *not. This place refuses to scroll past.";

/** WHY THIS EXISTS: each word lights up as you scroll. */
export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = MANIFESTO.split(" ");

  return (
    <section className="mx-auto max-w-[1600px] px-4 pt-24 sm:px-8" aria-label="Why this exists">
      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <p className="label pt-4">Why this exists</p>
        <div ref={ref} className="py-[12vh]">
          <p className="font-serif text-[clamp(2.1rem,5.4vw,5.2rem)] leading-[1.06] tracking-[-0.01em]">
            <span className="sr-only">{MANIFESTO.replace(/\*/g, "")}</span>
            {words.map((w, i) => (
              <LitWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} red={w.startsWith("*")}>
                {w.replace(/^\*/, "")}
              </LitWord>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

function LitWord({
  children,
  progress,
  range,
  red,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  red: boolean;
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <>
      <motion.span aria-hidden="true" className={red ? "italic text-blood" : ""} style={{ opacity }}>
        {children}
      </motion.span>{" "}
    </>
  );
}
