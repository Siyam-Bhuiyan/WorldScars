import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ExhibitCard from "../components/ExhibitCard";
import Layout from "../components/Layout";
import Redacted from "../components/Redacted";
import { Words } from "../components/Reveal";
import { Failure, Retrieving } from "../components/Status";
import { ApiError, expungeExhibit, getExhibit, listExhibits } from "../lib/api";
import { loadClearance, saveClearance } from "../lib/clearance";
import { exhibitNo, fileDate, hostOf, safeHref, sized } from "../lib/format";
import { EASE } from "../lib/motion";
import { lockScroll } from "../lib/scroll";
import type { Exhibit } from "../lib/types";
import { markWitnessed, witnessedAt } from "../lib/witness";

const CONFIRM_WORD = "EXPUNGE";

export default function Dossier() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [exhibit, setExhibit] = useState<Exhibit | null>(null);
  const [error, setError] = useState<{ message: string; status: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const [more, setMore] = useState<Exhibit[]>([]);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    setExhibit(null);
    setError(null);
    getExhibit(id)
      .then((e) => alive && setExhibit(e))
      .catch((e) => alive && setError({ message: e.message, status: e instanceof ApiError ? e.status : 0 }));
    listExhibits({ size: 4 })
      .then((p) => alive && setMore(p.items.filter((e) => String(e.id) !== id).slice(0, 3)))
      .catch(() => {
        /* optional */
      });
    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(false);
    window.addEventListener("keydown", onKey);
    lockScroll(true);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [lightbox]);

  if (error) {
    return (
      <Layout>
        {error.status === 404 ? (
          <div className="mx-auto max-w-3xl px-4 pb-20 pt-40 text-center">
            <p className="label">Record {id}</p>
            <p className="mt-4 font-display text-6xl uppercase sm:text-8xl">
              Record <span className="text-ember glow">missing.</span>
            </p>
            <p className="mt-6 font-serif text-2xl italic text-dim">Expunged, or never filed. Either way, someone was here.</p>
            <Link to="/archive" className="btn mt-10">
              Back to the archive
            </Link>
          </div>
        ) : (
          <div className="pt-28">
            <Failure message={error.message} action={<Link to="/archive" className="btn">Back to the archive</Link>} />
          </div>
        )}
      </Layout>
    );
  }

  if (!exhibit) {
    return (
      <Layout>
        <div className="pt-24">
          <Retrieving what={`record ${id}`} />
        </div>
      </Layout>
    );
  }

  const source = safeHref(exhibit.source);

  return (
    <Layout>
      <article className="relative mx-auto max-w-[1600px] px-4 pt-28 sm:px-8 sm:pt-32">
        <div className="pointer-events-none absolute left-1/3 top-10 h-[420px] w-[620px] rounded-full bg-ember/[0.07] blur-[120px]" />

        {/* breadcrumb */}
        <motion.nav
          className="label relative mb-8"
          aria-label="Breadcrumb"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link to="/archive" className="roll hover:!text-bone">
            <span>Archive</span>
            <span aria-hidden="true">Archive</span>
          </Link>
          <span className="mx-3 text-smoke">/</span>
          <span className="!text-bone">Record {exhibitNo(exhibit.id)}</span>
        </motion.nav>

        <header className="relative border-b border-ash pb-8">
          <p className="label flex items-center gap-3 !text-ember">
            <span className="beat inline-block h-2 w-2 rounded-full bg-ember" aria-hidden="true" />
            Record {exhibitNo(exhibit.id)} · {exhibit.location || "Place unknown"}
          </p>
          <h1 className="mt-4 max-w-5xl font-display text-[clamp(2.6rem,7vw,6.5rem)] uppercase leading-[0.9]">
            <Words text={exhibit.title} immediate delay={0.7} stagger={0.05} />
          </h1>
          {/* the stamp lands hard */}
          <motion.span
            className="stamp absolute right-0 top-0 hidden text-2xl md:inline-block"
            initial={{ opacity: 0, scale: 2.6, rotate: -18 }}
            animate={{ opacity: 0.9, scale: 1, rotate: -6 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 420, damping: 18 }}
          >
            Not forgotten
          </motion.span>
        </header>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,1fr)]">
          {/* ---------- THE IMAGE ---------- */}
          <figure>
            <motion.button
              type="button"
              onClick={() => setLightbox(true)}
              data-cursor="View"
              aria-label="View the image full screen"
              className="group relative block w-full overflow-hidden bg-char"
              initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{ duration: 1.4, ease: EASE, delay: 0.5 }}
            >
              <motion.img
                src={sized(exhibit.imageUrl, 1800)}
                alt={exhibit.title}
                className="mx-auto block max-h-[78vh] w-auto max-w-full"
                initial={{ scale: 1.25 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2, ease: EASE, delay: 0.5 }}
              />
              <span className="label absolute bottom-3 right-3 bg-ink/80 px-3 py-2 !text-bone backdrop-blur transition-colors group-hover:!text-ember">
                [ Full view ]
              </span>
            </motion.button>
            <figcaption className="label mt-3 flex justify-between">
              <span>Fig. {exhibitNo(exhibit.id)}</span>
              <span>{exhibit.location || "Location withheld"}</span>
            </figcaption>
          </figure>

          {/* ---------- THE CASE FILE ---------- */}
          <motion.aside
            className="lg:sticky lg:top-28 lg:self-start"
            initial={{ opacity: 0, x: 60, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.9 }}
          >
            <div className="torn bg-bone px-6 pb-10 pt-6 text-ink shadow-[0_40px_80px_-30px_rgba(255,53,39,0.35)] sm:px-8">
              <div className="flex items-center justify-between border-b-2 border-ink pb-3">
                <p className="font-display text-2xl uppercase">Case file</p>
                <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-file">WS-{exhibitNo(exhibit.id)}</p>
              </div>

              <dl className="mt-4 divide-y divide-ink/15 font-mono text-sm">
                <Row term="Location">{exhibit.location ? exhibit.location : <Redacted dark>Withheld</Redacted>}</Row>
                <Row term="Filed">{fileDate(exhibit.uploadedAt)}</Row>
                <Row term="Source">
                  {source ? (
                    <a
                      href={source}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="break-all underline decoration-blood decoration-2 underline-offset-4 hover:text-blood"
                    >
                      {hostOf(source)} ↗
                    </a>
                  ) : (
                    <Redacted dark>Unverified</Redacted>
                  )}
                </Row>
                <Row term="Status">
                  <span className="font-semibold text-blood">Open file · not forgotten</span>
                </Row>
              </dl>

              <div className="mt-8">
                <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-file text-ink/60">Testimony</p>
                {exhibit.description ? (
                  <p className="mt-3 whitespace-pre-line font-typed text-[1.05rem] leading-relaxed">{exhibit.description}</p>
                ) : (
                  <p className="mt-3 font-typed text-[1.05rem] leading-relaxed text-ink/60">
                    No testimony was recorded. <Redacted dark>The silence is part of the record.</Redacted>
                  </p>
                )}
              </div>
            </div>

            <Witness key={`w-${exhibit.id}`} id={exhibit.id} />
            <Expunge key={`x-${exhibit.id}`} exhibit={exhibit} onDone={() => navigate("/archive", { replace: true })} />
          </motion.aside>
        </div>
      </article>

      {/* ---------- KEEP WITNESSING ---------- */}
      {more.length > 0 && (
        <section className="mx-auto mt-32 max-w-[1600px] px-4 sm:px-8" aria-labelledby="more">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-ash pb-6">
            <h2 id="more" className="font-display text-[clamp(2.6rem,6vw,5rem)] uppercase leading-none">
              Keep <span className="font-serif normal-case italic text-ember glow">witnessing</span>
            </h2>
            <Link to="/archive" className="roll label !text-bone">
              <span>Every record →</span>
              <span aria-hidden="true">Every record →</span>
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((e, i) => (
              <ExhibitCard key={e.id} exhibit={e} index={i} />
            ))}
          </div>
        </section>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={exhibit.title}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 p-4 backdrop-blur"
            onClick={() => setLightbox(false)}
            data-cursor="Close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.img
              src={exhibit.imageUrl}
              alt={exhibit.title}
              className="max-h-full max-w-full object-contain"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            />
            <button type="button" className="label absolute right-4 top-4 !text-bone hover:!text-ember" autoFocus>
              [ Close · Esc ]
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

function Row({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[92px_1fr] gap-3 py-2.5">
      <dt className="text-[0.68rem] font-semibold uppercase tracking-file text-ink/55">{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}

/** "I bear witness": a private promise, kept on this device only. */
function Witness({ id }: { id: number }) {
  const [at, setAt] = useState(() => witnessedAt(id));
  const [flash, setFlash] = useState(0);

  return (
    <div className="relative mt-6">
      <AnimatePresence>
        {flash > 0 && (
          <motion.span
            key={flash}
            className="pointer-events-none absolute inset-0 bg-ember"
            initial={{ opacity: 0.9, scale: 1 }}
            animate={{ opacity: 0, scale: 1.25 }}
            transition={{ duration: 1.1, ease: EASE }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
      {at ? (
        <div className="border border-ember/50 px-5 py-4" role="status">
          <p className="label flex items-center gap-2 !text-ember">
            <span className="beat inline-block h-2 w-2 rounded-full bg-ember" aria-hidden="true" /> You bore witness · {fileDate(at)}
          </p>
          <p className="mt-2 font-serif text-lg italic text-dim">You stayed. That is more than the world did.</p>
        </div>
      ) : (
        <button
          type="button"
          className="btn btn-blood w-full !py-5"
          data-cursor="Hold"
          onClick={() => {
            setAt(markWitnessed(id));
            setFlash((f) => f + 1);
          }}
        >
          I bear witness
        </button>
      )}
    </div>
  );
}

/** Deleting a record is deliberately slow: clearance key + typed confirmation. */
function Expunge({ exhibit, onDone }: { exhibit: Exhibit; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(loadClearance);
  const [word, setWord] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await expungeExhibit(exhibit.id, key.trim());
      saveClearance(key.trim());
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button type="button" className="label mt-8 hover:!text-ember" onClick={() => setOpen(true)}>
        Record control → expunge this record
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 border border-ember/50 bg-rust/20 p-5">
      <p className="label !text-ember">Expunge record {exhibitNo(exhibit.id)}</p>
      <p className="mt-2 font-typed text-sm text-dim">
        This permanently removes the record and its image. Erasing evidence should never be easy.
      </p>

      <label className="label mt-5 block" htmlFor="ex-key">
        Clearance key
      </label>
      <input id="ex-key" type="password" className="field" value={key} onChange={(e) => setKey(e.target.value)} autoComplete="current-password" required />

      <label className="label mt-5 block" htmlFor="ex-word">
        Type {CONFIRM_WORD} to confirm
      </label>
      <input
        id="ex-word"
        className="field uppercase"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        autoComplete="off"
        spellCheck={false}
      />

      {error && (
        <p className="mt-4 font-typed text-sm text-ember" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" className="btn btn-blood" disabled={busy || !key.trim() || word.trim().toUpperCase() !== CONFIRM_WORD}>
          {busy ? "Expunging…" : "Expunge record"}
        </button>
        <button type="button" className="btn" onClick={() => setOpen(false)} disabled={busy}>
          Keep it on file
        </button>
      </div>
    </form>
  );
}
