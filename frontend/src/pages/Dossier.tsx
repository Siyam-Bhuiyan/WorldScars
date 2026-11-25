import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
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
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    setExhibit(null);
    setError(null);
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
      <article className="pb-6 pt-8 sm:pt-10">
        {/* breadcrumb */}
        <nav className="label mx-auto mb-5 max-w-[1500px] px-4 sm:px-8" aria-label="Breadcrumb">
          <Link to="/archive" className="hover:!text-bone">
            Archive
          </Link>
          <span className="mx-3 text-smoke">/</span>
          <span className="!text-bone">#{exhibitNo(exhibit.id)}</span>
        </nav>

        {/* ---------- THE IMAGE: as large as the screen allows ---------- */}
        <figure className="mx-auto max-w-[1500px] px-0 sm:px-8">
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="group relative block w-full cursor-zoom-in bg-char focus:outline-none"
            aria-label="View the image full screen"
          >
            <img
              src={sized(exhibit.imageUrl, 2000)}
              alt={exhibit.title}
              className="mx-auto block max-h-[88vh] w-auto max-w-full"
            />
            <span className="label absolute bottom-3 right-3 bg-ink/80 px-3 py-2 !text-bone opacity-80 transition-opacity group-hover:opacity-100">
              Tap to enlarge
            </span>
          </button>
        </figure>

        {/* ---------- THE STORY: a narrow, comfortable reading column ---------- */}
        <div className="mx-auto mt-12 max-w-[42rem] px-5 sm:mt-16 sm:px-8">
          <h1 className="font-display text-[clamp(2.2rem,5.5vw,3.8rem)] uppercase leading-[1.02] tracking-wide">
            {exhibit.title}
          </h1>

          <p className="label mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 !normal-case !tracking-wider">
            {exhibit.location && <span className="!text-bone">{exhibit.location}</span>}
            {exhibit.location && <span className="text-smoke">·</span>}
            <span>{fileDate(exhibit.uploadedAt)}</span>
            {source && (
              <>
                <span className="text-smoke">·</span>
                <a
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="underline decoration-blood decoration-2 underline-offset-4 hover:!text-blood"
                >
                  Source: {hostOf(source)} ↗
                </a>
              </>
            )}
          </p>

          <div className="scar-rule mt-8 w-24" aria-hidden="true" />

          {exhibit.description ? (
            <div className="mt-8 space-y-6 font-read text-[1.2rem] leading-[1.85] text-bone/90 sm:text-[1.3rem]">
              {exhibit.description.split(/\n{2,}/).map((para, i) => (
                <p key={i} className="whitespace-pre-line">
                  {para}
                </p>
              ))}
            </div>
          ) : (
            <p className="mt-8 font-read text-[1.2rem] italic leading-[1.85] text-dim">No words were left with this one.</p>
          )}

          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-ash pt-6">
            <Link to="/archive" className="label !text-bone hover:!text-blood">
              ← Back to the archive
            </Link>
          </div>

          <Expunge exhibit={exhibit} onDone={() => navigate("/archive", { replace: true })} />
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
