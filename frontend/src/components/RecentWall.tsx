import { motion, useScroll, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { exhibitNo, sized } from "../lib/format";
import type { Exhibit } from "../lib/types";

/** RECENTLY ENTERED: the latest records slide sideways as you scroll down. */
export default function RecentWall({ items }: { items: Exhibit[] }) {
  const target = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => setDist(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [items.length]);

  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);

  return (
    <section ref={target} className="relative" style={{ height: `calc(100vh + ${dist}px)` }} aria-label="Latest records">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} className="flex w-max items-stretch gap-5 px-4 sm:gap-8 sm:px-8" style={{ x }}>
          <div className="flex w-[78vw] shrink-0 flex-col justify-between py-2 sm:w-[42vw] lg:w-[30vw]">
            <p className="label">The record</p>
            <div>
              <h2 className="font-display text-[clamp(3.4rem,8vw,7.5rem)] uppercase leading-[0.86]">
                Recently
                <br />
                <span className="text-blood">entered</span>
              </h2>
              <p className="mt-6 max-w-sm font-serif text-2xl italic leading-snug text-dim">
                They move past you the way they moved past the world. This time, stop.
              </p>
            </div>
            <p className="label">Keep scrolling →</p>
          </div>

          {items.map((e) => (
            <Link key={e.id} to={`/exhibit/${e.id}`} className="group relative block w-[78vw] shrink-0 sm:w-[46vw] lg:w-[32vw]">
              <div className="relative aspect-[4/5] max-h-[72vh] overflow-hidden bg-char">
                <img
                  src={sized(e.imageUrl, 1000)}
                  alt={e.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <span className="hollow absolute right-4 top-2 font-display text-[clamp(4rem,9vw,8rem)] leading-none transition-colors duration-500 group-hover:text-blood">
                  {exhibitNo(e.id)}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="label !text-blood">{e.location || "Place unknown"}</p>
                  <h3 className="mt-2 font-display text-[clamp(1.7rem,2.6vw,2.6rem)] uppercase leading-[0.98]">{e.title}</h3>
                </div>
                <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-blood transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            </Link>
          ))}

          <Link
            to="/archive"
            className="group flex w-[70vw] shrink-0 flex-col justify-center border border-ash px-8 transition-colors duration-500 hover:border-blood hover:bg-rust/30 sm:w-[36vw] lg:w-[24vw]"
          >
            <p className="label">Every record</p>
            <p className="mt-4 font-display text-[clamp(2.8rem,5vw,4.6rem)] uppercase leading-[0.9] transition-colors group-hover:text-blood">
              Open the
              <br />
              archive →
            </p>
          </Link>
        </motion.div>

        <div className="mx-4 mt-10 h-px bg-ash sm:mx-8">
          <motion.div className="h-full origin-left bg-blood" style={{ scaleX: scrollYProgress }} />
        </div>
      </div>
    </section>
  );
}
