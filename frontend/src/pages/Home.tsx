import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Manifesto from "../components/Manifesto";
import RecentWall from "../components/RecentWall";
import Redacted from "../components/Redacted";
import Ticker from "../components/Ticker";
import { listExhibits } from "../lib/api";
import type { Exhibit } from "../lib/types";
import marrakesh from "../assets/hero/marrakesh.jpg";
import camp from "../assets/hero/camp.jpg";
import child from "../assets/hero/child.jpg";

const SLIDES = [
  { src: marrakesh, place: "Marrakesh, Morocco", when: "09.2023", note: "Dust where homes stood." },
  { src: camp, place: "Refugee camp", when: "Ongoing", note: "Tents are not homes." },
  { src: child, place: "Refugee camp", when: "Ongoing", note: "Name unknown." },
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [recent, setRecent] = useState<Exhibit[]>([]);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    const t = window.setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 7000);
    return () => window.clearInterval(t);
  }, []);

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

  const current = SLIDES[slide];

  return (
    <Layout bleed>
      {/* ---------- HERO ---------- */}
      <section className="relative h-[100svh] min-h-[620px] overflow-hidden" aria-label="Introduction">
        {SLIDES.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1800ms] ${
              i === slide ? "flicker opacity-100" : "opacity-0"
            }`}
            style={{ filter: "grayscale(1) contrast(1.25) brightness(0.55)" }}
          />
        ))}
        {/* vignette + bottom fade */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,10,9,0.85)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/70 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-4 pb-14 sm:px-8 sm:pb-20">
          <p className="label rise mb-6 !text-bone">
            <span className="mr-3 inline-block h-2 w-2 animate-pulse bg-blood align-middle" />
            Exhibit in view · {current.place} · {current.when}
          </p>

          <h1 className="rise font-display uppercase leading-[0.86] tracking-tight" style={{ animationDelay: "120ms" }}>
            <span className="block text-[clamp(3.6rem,13vw,12rem)]">The world</span>
            <span className="block text-[clamp(3.6rem,13vw,12rem)] text-blood">watched.</span>
          </h1>

          <div className="rise mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-end" style={{ animationDelay: "260ms" }}>
            <p className="max-w-xl font-typed text-lg leading-relaxed text-bone/90 sm:text-xl">
              Then it <span className="line-through decoration-blood decoration-2">grieved</span> scrolled past. This
              archive keeps the images the world saw for a moment and forgot. Every one of them is a witness, and{" "}
              <Redacted>someone</Redacted> is still waiting for an answer.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/archive" className="btn btn-blood">
                Open the archive <span aria-hidden="true">→</span>
              </Link>
              <Link to="/file" className="btn">
                File an exhibit
              </Link>
            </div>
          </div>

          <p className="label mt-10 italic !normal-case !tracking-normal" aria-live="polite">
            “{current.note}”
          </p>
        </div>

        {/* slide index */}
        <div className="absolute right-4 top-24 z-10 flex flex-col gap-2 sm:right-8" aria-hidden="true">
          {SLIDES.map((_, i) => (
            <span key={i} className={`h-8 w-[3px] transition-colors ${i === slide ? "bg-blood" : "bg-bone/25"}`} />
          ))}
        </div>
      </section>

      <Ticker
        tone="bone"
        items={[
          total === null ? "Exhibits on file" : `${total} exhibit${total === 1 ? "" : "s"} on file`,
          "None forgotten",
          "No case closed",
          "Look closer",
        ]}
      />

      <Manifesto />

      {/* ---------- THE RULES ---------- */}
      <section className="mx-auto max-w-[1600px] px-4 py-24 sm:px-8" aria-labelledby="rules">
        <h2 id="rules" className="label mb-12">
          Protocol for visitors
        </h2>
        <ol className="grid gap-px bg-ash md:grid-cols-3">
          {[
            ["Look.", "Do not look away. Stay with one picture longer than feels comfortable."],
            ["Remember.", "A photograph is often the last witness. Read the testimony beside it."],
            ["File.", "Add what the world tried to forget, with a source, so it can't be denied."],
          ].map(([title, body], i) => (
            <li key={title} className="bg-ink p-8 sm:p-10">
              <span className="font-display text-7xl leading-none text-blood">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 font-display text-4xl uppercase">{title}</h3>
              <p className="mt-4 max-w-sm font-typed text-dim">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      {recent.length > 0 && <RecentWall items={recent} />}
    </Layout>
  );
}
