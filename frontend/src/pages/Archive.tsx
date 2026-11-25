import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import ExhibitCard from "../components/ExhibitCard";
import { Words } from "../components/Reveal";
import { Failure, Retrieving } from "../components/Status";
import { listExhibits } from "../lib/api";
import { exhibitNo, fileDate, sized } from "../lib/format";
import { EASE, hasFinePointer } from "../lib/motion";
import type { Exhibit } from "../lib/types";

const PAGE_SIZE = 24;
const VIEW_KEY = "worldscars.view";
type View = "wall" | "index";

function savedView(): View {
  try {
    return localStorage.getItem(VIEW_KEY) === "index" ? "index" : "wall";
  } catch {
    return "wall";
  }
}

export default function Archive() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const [input, setInput] = useState(q);
  const [view, setView] = useState<View>(savedView);

  const [items, setItems] = useState<Exhibit[]>([]);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(true);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const load = useCallback(async (query: string, pageNo: number) => {
    const id = ++requestId.current;
    if (pageNo === 0) setLoading(true);
    else setLoadingMore(true);
    setError(null);
    try {
      const res = await listExhibits({ q: query || undefined, page: pageNo, size: PAGE_SIZE });
      if (id !== requestId.current) return; // a newer search superseded this one
      setItems((prev) => (pageNo === 0 ? res.items : [...prev, ...res.items]));
      setPage(res.page);
      setLast(res.last);
      setTotal(res.totalItems);
    } catch (e) {
      if (id === requestId.current) setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      if (id === requestId.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    load(q, 0);
  }, [q, load]);

  // Debounce typing into the URL.
  useEffect(() => {
    if (input === q) return;
    const t = window.setTimeout(() => {
      setParams(input.trim() ? { q: input.trim() } : {}, { replace: true });
    }, 350);
    return () => window.clearTimeout(t);
  }, [input, q, setParams]);

  const choose = (v: View) => {
    setView(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      /* not remembered */
    }
  };

  return (
    <Layout>
      <section className="relative mx-auto max-w-[1600px] px-4 pt-32 sm:px-8 sm:pt-40">
        <div className="pointer-events-none absolute -top-20 right-0 h-[480px] w-[480px] rounded-full bg-ember/10 blur-[120px]" />
        <p className="label mb-6 flex items-center gap-3">
          <span className="beat inline-block h-2 w-2 rounded-full bg-ember" aria-hidden="true" />
          The record · open to everyone
        </p>
        <h1 className="font-display text-[clamp(4rem,15vw,14rem)] uppercase leading-[0.8] tracking-tight">
          <Words text="The archive" immediate delay={0.6} stagger={0.12} />
        </h1>
        <motion.p
          className="mt-4 max-w-2xl font-serif text-[clamp(1.5rem,3vw,2.4rem)] italic leading-tight text-dim"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1 }}
        >
          Every face here was <span className="text-ember">someone's whole world.</span>
        </motion.p>

        <motion.div
          className="mt-14 grid gap-8 border-b border-ash pb-8 md:grid-cols-[1fr_auto] md:items-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="max-w-2xl">
            <label htmlFor="search" className="label">
              Search the record
            </label>
            <div className="mt-2 flex items-center gap-4">
              <span className="font-serif text-4xl italic text-ember" aria-hidden="true">
                ⟶
              </span>
              <input
                id="search"
                type="search"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="a place, an event, a name…"
                className="field !border-0 !py-2 !font-serif !text-[clamp(1.6rem,3.4vw,2.6rem)] !italic focus:!shadow-none"
                autoComplete="off"
              />
            </div>
            <p className="label mt-3" aria-live="polite">
              {loading ? "Searching…" : error ? "Record unavailable" : `${total} record${total === 1 ? "" : "s"} ${q ? `matching “${q}”` : "kept"}`}
            </p>
          </div>

          <div className="flex gap-1 self-end border border-ash p-1" role="group" aria-label="Layout">
            {(["wall", "index"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={view === v}
                onClick={() => choose(v)}
                className={`label relative px-4 py-2 transition-colors ${view === v ? "!text-ink" : "hover:!text-bone"}`}
              >
                {view === v && <motion.span layoutId="view-pill" className="absolute inset-0 bg-ember" transition={{ duration: 0.45, ease: EASE }} />}
                <span className="relative">{v === "wall" ? "Wall" : "Index"}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 pt-14 sm:px-8">
        {loading ? (
          <Retrieving what="the record" />
        ) : error ? (
          <Failure
            message={error}
            action={
              <button type="button" className="btn" onClick={() => load(q, 0)}>
                Try again
              </button>
            }
          />
        ) : items.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-[clamp(3rem,9vw,7rem)] uppercase leading-none">{q ? "No record found." : "The record is empty."}</p>
            <p className="mt-6 font-serif text-2xl italic text-dim">
              {q ? "Nothing matches that. Silence is also evidence." : "For now. Somebody has to begin."}
            </p>
            <Link to="/file" className="btn btn-blood mt-10">
              Bear witness
            </Link>
          </div>
        ) : (
          <>
            {view === "wall" ? (
              <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 2xl:columns-4">
                {items.map((e, i) => (
                  <ExhibitCard key={e.id} exhibit={e} index={i} />
                ))}
              </div>
            ) : (
              <IndexList items={items} />
            )}

            <div className="mt-16 flex justify-center">
              {last ? (
                <p className="label">— End of the record. For now. —</p>
              ) : (
                <button type="button" className="btn" disabled={loadingMore} onClick={() => load(q, page + 1)}>
                  {loadingMore ? "Pulling files…" : "Pull more records"}
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </Layout>
  );
}

/**
 * The index: a typeset list. Hovering a row turns it red and the picture
 * surfaces next to the mouse.
 */
function IndexList({ items }: { items: Exhibit[] }) {
  const [hover, setHover] = useState<Exhibit | null>(null);
  const [fine] = useState(hasFinePointer);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 22, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 160, damping: 22, mass: 0.5 });

  return (
    <div
      onPointerMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onPointerLeave={() => setHover(null)}
    >
      <div className="label hidden grid-cols-[90px_1fr_240px_120px] gap-6 border-b border-ash pb-3 md:grid">
        <span>No.</span>
        <span>What happened</span>
        <span>Where</span>
        <span className="text-right">Kept</span>
      </div>
      <ul>
        {items.map((e, i) => (
          <motion.li
            key={e.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: Math.min(i, 8) * 0.05 }}
          >
            <Link
              to={`/exhibit/${e.id}`}
              onPointerEnter={() => setHover(e)}
              className="group relative grid grid-cols-[60px_1fr] items-baseline gap-x-4 gap-y-2 overflow-hidden border-b border-ash py-6 md:grid-cols-[90px_1fr_240px_120px] md:gap-6"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-ember transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.1,1)] group-hover:scale-y-100" />
              <span className="relative font-display text-xl text-ember transition-colors group-hover:text-ink">{exhibitNo(e.id)}</span>
              <span className="relative font-display text-[clamp(1.6rem,3.4vw,3rem)] uppercase leading-[0.95] transition-all duration-500 group-hover:translate-x-3 group-hover:text-ink">
                {e.title}
              </span>
              <span className="label relative col-start-2 transition-colors group-hover:!text-ink md:col-start-auto">
                {e.location || "Place unknown"}
              </span>
              <span className="label relative hidden text-right transition-colors group-hover:!text-ink md:block">{fileDate(e.uploadedAt)}</span>
            </Link>
          </motion.li>
        ))}
      </ul>

      {fine && (
        <motion.div className="pointer-events-none fixed left-0 top-0 z-[80]" style={{ x: sx, y: sy }} aria-hidden="true">
          <AnimatePresence>
            {hover && (
              <motion.img
                key={hover.id}
                src={sized(hover.imageUrl, 600)}
                alt=""
                className="ml-8 w-[300px] object-cover shadow-[0_30px_80px_-20px_rgba(255,53,39,0.45)]"
                style={{ y: "-50%" }}
                initial={{ opacity: 0, scale: 0.85, rotate: -4, clipPath: "inset(50% 0% 50% 0%)" }}
                animate={{ opacity: 1, scale: 1, rotate: 0, clipPath: "inset(0% 0% 0% 0%)" }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.45, ease: EASE }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
