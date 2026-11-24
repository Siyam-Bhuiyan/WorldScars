import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Redacted from "../components/Redacted";
import { Failure, Retrieving } from "../components/Status";
import { ApiError, expungeExhibit, getExhibit } from "../lib/api";
import { loadClearance, saveClearance } from "../lib/clearance";
import { exhibitNo, fileDate, hostOf, safeHref, sized } from "../lib/format";
import type { Exhibit } from "../lib/types";

const CONFIRM_WORD = "EXPUNGE";

export default function Dossier() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [exhibit, setExhibit] = useState<Exhibit | null>(null);
  const [error, setError] = useState<{ message: string; status: number } | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    setExhibit(null);
    setError(null);
    setRevealed(false);
    getExhibit(id)
      .then((e) => alive && setExhibit(e))
      .catch((e) => alive && setError({ message: e.message, status: e instanceof ApiError ? e.status : 0 }));
    return () => {
      alive = false;
    };
  }, [id]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  if (error) {
    return (
      <Layout>
        {error.status === 404 ? (
          <div className="mx-auto max-w-3xl px-4 py-32 text-center">
            <p className="label">Exhibit {id}</p>
            <p className="mt-4 font-display text-6xl uppercase sm:text-8xl">
              Record <span className="text-blood">missing.</span>
            </p>
            <p className="mt-6 font-typed text-dim">Expunged, or never filed. Either way, someone was here.</p>
            <Link to="/archive" className="btn mt-10">
              Back to the archive
            </Link>
          </div>
        ) : (
          <Failure message={error.message} action={<Link to="/archive" className="btn">Back to the archive</Link>} />
        )}
      </Layout>
    );
  }

  if (!exhibit) {
    return (
      <Layout>
        <Retrieving what={`exhibit ${id}`} />
      </Layout>
    );
  }

  const source = safeHref(exhibit.source);

  return (
    <Layout>
      <article className="mx-auto max-w-[1600px] px-4 pt-10 sm:px-8 sm:pt-14">
        {/* breadcrumb */}
        <nav className="label mb-8" aria-label="Breadcrumb">
          <Link to="/archive" className="hover:!text-bone">
            Archive
          </Link>
          <span className="mx-3 text-smoke">/</span>
          <span className="!text-bone">Exhibit {exhibitNo(exhibit.id)}</span>
        </nav>

        <header className="relative border-b border-ash pb-8">
          <p className="label !text-blood">Exhibit {exhibitNo(exhibit.id)}</p>
          <h1 className="mt-3 max-w-5xl font-display text-[clamp(2.6rem,7vw,6.5rem)] uppercase leading-[0.9]">
            {exhibit.title}
          </h1>
          <span className="stamp absolute right-0 top-0 hidden text-2xl md:inline-block">Not forgotten</span>
        </header>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,1fr)]">
          {/* ---------- THE IMAGE ---------- */}
          <figure>
            <div className="relative overflow-hidden bg-char">
              <img
                src={sized(exhibit.imageUrl, 1800)}
                alt={exhibit.title}
                className="mx-auto block max-h-[78vh] w-auto max-w-full transition-[filter] duration-[2000ms] ease-out"
                style={{ filter: revealed ? "none" : "grayscale(1) blur(22px) brightness(0.45)" }}
              />

              {!revealed ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <p className="label !text-blood">Sensitive material</p>
                  <p className="mt-4 max-w-md font-typed text-lg text-bone sm:text-xl">
                    What follows is real. It happened to someone.
                  </p>
                  <button type="button" className="btn btn-blood mt-8" onClick={() => setRevealed(true)}>
                    Look anyway
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setLightbox(true)}
                  className="label absolute bottom-3 right-3 bg-ink/80 px-3 py-2 !text-bone hover:!text-blood"
                >
                  [ Full view ]
                </button>
              )}
            </div>
            <figcaption className="label mt-3 flex justify-between">
              <span>Fig. {exhibitNo(exhibit.id)}</span>
              <span>{exhibit.location || "Location withheld"}</span>
            </figcaption>
          </figure>

          {/* ---------- THE CASE FILE ---------- */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="torn bg-bone px-6 pb-10 pt-6 text-ink sm:px-8">
              <div className="flex items-center justify-between border-b-2 border-ink pb-3">
                <p className="font-display text-2xl uppercase">Case file</p>
                <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-file">WS-{exhibitNo(exhibit.id)}</p>
              </div>

              <dl className="mt-4 divide-y divide-ink/15 font-mono text-sm">
                <Row term="Location">
                  {exhibit.location ? exhibit.location : <Redacted dark>Withheld</Redacted>}
                </Row>
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

            <Expunge exhibit={exhibit} onDone={() => navigate("/archive", { replace: true })} />
          </aside>
        </div>
      </article>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={exhibit.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4"
          onClick={() => setLightbox(false)}
        >
          <img src={exhibit.imageUrl} alt={exhibit.title} className="max-h-full max-w-full object-contain" />
          <button type="button" className="label absolute right-4 top-4 !text-bone hover:!text-blood" autoFocus>
            [ Close · Esc ]
          </button>
        </div>
      )}
    </Layout>
  );
}

function Row({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-3 py-3">
      <dt className="text-[0.68rem] font-semibold uppercase tracking-file text-ink/60">{term}</dt>
      <dd>{children}</dd>
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
      <button type="button" className="label mt-8 hover:!text-blood" onClick={() => setOpen(true)}>
        Record control → expunge this exhibit
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 border border-blood/60 bg-rust/15 p-5">
      <p className="label !text-blood">Expunge exhibit {exhibitNo(exhibit.id)}</p>
      <p className="mt-2 font-typed text-sm text-dim">
        This permanently removes the record and its image. Erasing evidence should never be easy.
      </p>

      <label className="label mt-5 block" htmlFor="ex-key">
        Clearance key
      </label>
      <input
        id="ex-key"
        type="password"
        className="field"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        autoComplete="current-password"
        required
      />

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
        <p className="mt-4 font-typed text-sm text-blood" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          className="btn btn-blood"
          disabled={busy || !key.trim() || word.trim().toUpperCase() !== CONFIRM_WORD}
        >
          {busy ? "Expunging…" : "Expunge record"}
        </button>
        <button type="button" className="btn" onClick={() => setOpen(false)} disabled={busy}>
          Keep it on file
        </button>
      </div>
    </form>
  );
}
