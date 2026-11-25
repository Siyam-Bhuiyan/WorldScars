import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Magnetic from "../components/Magnetic";
import { Reveal, Words } from "../components/Reveal";
import Ticker from "../components/Ticker";
import { listExhibits } from "../lib/api";
import { exhibitNo, sized } from "../lib/format";
import { EASE, hasFinePointer, introPending, prefersReducedMotion } from "../lib/motion";
import type { Exhibit } from "../lib/types";
import marrakesh from "../assets/hero/marrakesh.jpg";
import camp from "../assets/hero/camp.jpg";
import child from "../assets/hero/child.jpg";

const SLIDES = [
  { src: child, place: "Refugee camp", when: "Ongoing" },
  { src: marrakesh, place: "Marrakesh, Morocco", when: "09.2023" },
  { src: camp, place: "Refugee camp", when: "Ongoing" },
];

export default function Home() {
  const [recent, setRecent] = useState<Exhibit[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [lead] = useState(() => (introPending() ? 3.3 : 0.5)); // wait for the intro to finish

  useEffect(() => {
    let alive = true;
    listExhibits({ size: 8 })
      .then((p) => {
        if (!alive) return;
        setRecent(p.items);
        setTotal(p.totalItems);
      })
      .catch(() => {
        /* home still works without the archive */
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Layout>
      <Hero lead={lead} />
      <Ticker
        tone="bone"
        items={[
          total === null ? "Lives on record" : `${total} ${total === 1 ? "life" : "lives"} on record`,
          "None forgotten",
          "No case closed",
          "Look closer",
        ]}
      />
      <Manifesto />
      {recent.length > 0 && <Wall items={recent} />}
      <Time />
      <Protocol />
      <Final />
    </Layout>
  );
}

/* ================================================================== */
/* I. THE TORCH: the image is in the dark; your light finds it.        */
/* ================================================================== */

function Hero({ lead }: { lead: number }) {
  const ref = useRef<HTMLElement>(null);
  const [slide, setSlide] = useState(0);
  const [fine] = useState(hasFinePointer);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);

  useEffect(() => {
    const t = window.setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 9000);
    return () => window.clearInterval(t);
  }, []);

  // The light: follows the mouse or finger, and drifts on its own when left alone.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const still = prefersReducedMotion();
    let w = el.clientWidth;
    let h = el.clientHeight;
    let tx = w * 0.6;
    let ty = h * 0.42;
    let cx = tx;
    let cy = ty;
    let auto = true;
    let idle = 0;
    let raf = 0;

    const onResize = () => {
      w = el.clientWidth;
      h = el.clientHeight;
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      auto = false;
      window.clearTimeout(idle);
      idle = window.setTimeout(() => (auto = true), 3500);
    };
    const loop = (t: number) => {
      if (window.scrollY < h) {
        if (auto && !still) {
          const s = t / 1000;
          tx = w * (0.56 + 0.26 * Math.sin(s * 0.31));
          ty = h * (0.42 + 0.17 * Math.sin(s * 0.53 + 1.2));
        }
        cx += (tx - cx) * 0.07;
        cy += (ty - cy) * 0.07;
        el.style.setProperty("--x", `${cx.toFixed(1)}px`);
        el.style.setProperty("--y", `${cy.toFixed(1)}px`);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    el.addEventListener("pointermove", onMove);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(idle);
      el.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const current = SLIDES[slide];

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink" aria-label="Introduction">
      <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
        {/* what the dark still shows: almost nothing */}
        {SLIDES.map((s, i) => (
          <img
            key={`dim-${s.src}`}
            src={s.src}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[2200ms] ${i === slide ? "opacity-[0.16] sm:opacity-[0.14]" : "opacity-0"}`}
          />
        ))}
        {/* what your light finds */}
        <div className="torch absolute inset-0">
          {SLIDES.map((s, i) => (
            <img
              key={`lit-${s.src}`}
              src={s.src}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[2200ms] ${i === slide ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
      </motion.div>

      {/* the light is warm, and red */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{ background: "radial-gradient(circle clamp(120px,20vw,300px) at var(--x,60%) var(--y,42%), rgba(255,53,39,0.22), transparent 72%)" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(7,7,6,0.92)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink via-ink/75 to-transparent" />

      <motion.p
        className="label absolute right-4 top-24 z-10 flex items-center gap-3 !text-bone/80 sm:right-8 sm:top-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: lead + 1.6, duration: 1 }}
      >
        <span className="relative flex h-3 w-3 items-center justify-center" aria-hidden="true">
          <span className="absolute h-full w-full animate-ping rounded-full bg-ember/60" />
          <span className="h-1.5 w-1.5 rounded-full bg-ember" />
        </span>
        {fine ? "Move your light. Someone is still here." : "Touch the dark. Someone is still here."}
      </motion.p>

      <motion.div
        className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-4 pb-14 sm:px-8 sm:pb-16"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          key={slide}
          className="label mb-6 !text-bone"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: slide === 0 ? lead : 0 }}
        >
          <span className="beat mr-3 inline-block h-2 w-2 rounded-full bg-ember align-middle" />
          In the dark · {current.place} · {current.when}
        </motion.p>

        <h1>
          <span className="block font-display text-[clamp(3.5rem,13.5vw,13rem)] uppercase leading-[0.84] tracking-tight">
            <Words text="The world watched." immediate delay={lead} stagger={0.09} />
          </span>
          <span className="mt-1 block font-serif text-[clamp(2.5rem,9vw,8.4rem)] italic leading-[0.98] text-ember glow">
            <Words text="then it looked away." immediate delay={lead + 0.45} stagger={0.09} />
          </span>
        </h1>

        <motion.div
          className="mt-10 grid gap-8 md:grid-cols-[1fr_auto] md:items-end"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: lead + 1.1 }}
        >
          <p className="max-w-xl font-serif text-xl leading-snug text-bone/85 sm:text-2xl">
            Pictures the world saw for a moment and forgot, each kept here with what happened. Someone in every one of them
            is still waiting to be remembered.
          </p>
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <Link to="/archive" className="btn btn-blood" data-cursor="Enter">
                Enter the archive <span aria-hidden="true">→</span>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link to="/file" className="btn">
                Bear witness
              </Link>
            </Magnetic>
          </div>
        </motion.div>
      </motion.div>

      {/* scroll cue: a line that keeps bleeding downward */}
      <div className="absolute bottom-0 left-1/2 z-10 hidden h-12 w-px -translate-x-1/2 overflow-hidden bg-ash md:block" aria-hidden="true">
        <span className="drip block h-full w-full bg-ember" />
      </div>
    </section>
  );
}

/* ================================================================== */
/* II. THE MANIFESTO: each word lights as you read it.                 */
/* ================================================================== */

const MANIFESTO =
  "Every photograph here was once on every screen in the world. For a day. Maybe two. Then the feed moved on. The people in them *did *not. This place refuses to scroll past.";

function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = MANIFESTO.split(" ");

  return (
    <section className="mx-auto max-w-[1600px] px-4 py-[22vh] sm:px-8" aria-label="Why this exists">
      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <p className="label pt-4">I — Why this exists</p>
        <div ref={ref}>
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
  const opacity = useTransform(progress, range, [0.1, 1]);
  const blur = useTransform(progress, range, ["blur(4px)", "blur(0px)"]);
  return (
    <>
      <motion.span aria-hidden="true" className={red ? "italic text-ember glow" : ""} style={{ opacity, filter: blur }}>
        {children}
      </motion.span>{" "}
    </>
  );
}

/* ================================================================== */
/* III. THE WALL: the latest records move past you, sideways.          */
/* ================================================================== */

function Wall({ items }: { items: Exhibit[] }) {
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
            <p className="label">II — The record</p>
            <div>
              <h2 className="font-display text-[clamp(3.4rem,8vw,7.5rem)] uppercase leading-[0.86]">
                Recently
                <br />
                <span className="text-ember glow">entered</span>
              </h2>
              <p className="mt-6 max-w-sm font-serif text-2xl italic leading-snug text-dim">
                They move past you the way they moved past the world. This time, stop.
              </p>
            </div>
            <p className="label">Keep scrolling →</p>
          </div>

          {items.map((e) => (
            <Link
              key={e.id}
              to={`/exhibit/${e.id}`}
              data-cursor="Open"
              className="group relative block w-[78vw] shrink-0 sm:w-[46vw] lg:w-[32vw]"
            >
              <div className="relative aspect-[4/5] max-h-[72vh] overflow-hidden bg-char">
                <img
                  src={sized(e.imageUrl, 1000)}
                  alt={e.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.2,0.7,0.1,1)] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <span className="hollow absolute right-4 top-2 font-display text-[clamp(4rem,9vw,8rem)] leading-none transition-colors duration-700 group-hover:text-ember/90">
                  {exhibitNo(e.id)}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="label !text-ember">{e.location || "Place unknown"}</p>
                  <h3 className="mt-2 font-display text-[clamp(1.7rem,2.6vw,2.6rem)] uppercase leading-[0.98]">{e.title}</h3>
                </div>
                <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-ember transition-transform duration-700 group-hover:scale-x-100" />
              </div>
            </Link>
          ))}

          <Link
            to="/archive"
            data-cursor="Enter"
            className="group flex w-[70vw] shrink-0 flex-col justify-center border border-ash px-8 transition-colors duration-700 hover:border-ember hover:bg-rust/30 sm:w-[36vw] lg:w-[24vw]"
          >
            <p className="label">Every record</p>
            <p className="mt-4 font-display text-[clamp(2.8rem,5vw,4.6rem)] uppercase leading-[0.9] transition-colors group-hover:text-ember">
              Open the
              <br />
              archive →
            </p>
          </Link>
        </motion.div>

        <div className="mx-4 mt-10 h-px bg-ash sm:mx-8">
          <motion.div className="h-full origin-left bg-ember glow-box" style={{ scaleX: scrollYProgress }} />
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* IV. TIME: how long you have been here.                              */
/* ================================================================== */

function Time() {
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const t = window.setInterval(() => setSecs(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => window.clearInterval(t);
  }, []);

  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const digits = (s: string, className = "") =>
    s.split("").map((d, i) => (
      <span key={i} className={`inline-block w-[0.52em] text-center ${className}`}>
        {d}
      </span>
    ));

  return (
    <section className="relative overflow-hidden py-32 sm:py-44" aria-label="Time">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(255,53,39,0.12),transparent_60%)]" />
      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-8">
        <p className="label">III — Time</p>
        <Reveal>
          <p className="mt-10 font-serif text-[clamp(1.8rem,4vw,3.4rem)] italic text-dim">You have been here for</p>
        </Reveal>
        <p
          className="font-display text-[clamp(4.6rem,21vw,20rem)] leading-[0.82] tracking-tight tabular-nums"
          aria-label={`${hh} hours, ${mm} minutes, ${ss} seconds`}
        >
          {digits(hh, "text-bone/30")}
          <span className="text-bone/30">:</span>
          {digits(mm, "text-bone/70")}
          <span className="text-bone/70">:</span>
          {digits(ss, "text-ember glow")}
        </p>
        <Reveal className="mt-10 grid gap-6 md:grid-cols-[1fr_1fr]">
          <p className="max-w-2xl font-serif text-[clamp(1.6rem,3.4vw,2.8rem)] leading-[1.15]">
            Some of the people in these photographs <span className="italic text-ember">did not get that much time.</span>
          </p>
          <p className="max-w-md self-end font-mono text-sm leading-relaxed text-dim md:justify-self-end">
            The clock started when you arrived. It stops when you leave. Theirs stopped when the picture was taken.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ================================================================== */
/* V. HOW TO BE HERE                                                   */
/* ================================================================== */

const PROTOCOL = [
  ["Look.", "Don't scroll past. Stay with one picture longer than feels comfortable."],
  ["Read.", "Every picture is kept with what happened. The context is the point."],
  ["Bear witness.", "Post what the world tried to forget, and tell the story with it."],
] as const;

function Protocol() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 sm:px-8" aria-labelledby="protocol">
      <h2 id="protocol" className="label mb-10">
        IV — How to be here
      </h2>
      <ol className="border-b border-ash">
        {PROTOCOL.map(([word, body], i) => (
          <motion.li
            key={word}
            className="group relative grid gap-4 overflow-hidden border-t border-ash py-8 sm:grid-cols-[100px_1fr_minmax(0,380px)] sm:items-center sm:py-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, ease: EASE, delay: i * 0.1 }}
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-rust/40 transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.1,1)] group-hover:scale-x-100" />
            <span className="relative font-display text-2xl text-ember">{String(i + 1).padStart(2, "0")}</span>
            <span className="hollow relative font-display text-[clamp(3rem,8vw,7rem)] uppercase leading-[0.9] transition-colors duration-500 group-hover:text-bone">
              {word}
            </span>
            <p className="relative max-w-sm font-serif text-xl leading-snug text-dim transition-colors group-hover:text-bone">{body}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

/* ================================================================== */
/* VI. DO NOT LOOK AWAY: the words fill with red as you arrive.        */
/* ================================================================== */

function Final() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "center 0.5"] });
  const clip = useTransform(scrollYProgress, [0, 1], ["inset(-30% 100% -30% -10%)", "inset(-30% -10% -30% -10%)"]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  return (
    <section className="px-4 pt-40 text-center sm:px-8" aria-label="Do not look away">
      <motion.div ref={ref} className="relative mx-auto inline-block" style={{ scale }}>
        <p className="hollow font-display text-[clamp(3.4rem,14vw,14rem)] uppercase leading-[0.84]">
          Do not
          <br />
          look away
        </p>
        <motion.p
          className="absolute inset-0 font-display text-[clamp(3.4rem,14vw,14rem)] uppercase leading-[0.84] text-ember glow"
          style={{ clipPath: clip }}
          aria-hidden="true"
        >
          Do not
          <br />
          look away
        </motion.p>
      </motion.div>
      <Reveal className="mt-12 flex flex-wrap justify-center gap-3">
        <Magnetic>
          <Link to="/archive" className="btn btn-blood" data-cursor="Enter">
            Enter the archive →
          </Link>
        </Magnetic>
        <Magnetic>
          <Link to="/file" className="btn">
            Bear witness
          </Link>
        </Magnetic>
      </Reveal>
    </section>
  );
}
