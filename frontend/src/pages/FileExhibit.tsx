import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type DragEvent, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import AccessRequest from "../components/AccessRequest";
import Layout from "../components/Layout";
import { Words } from "../components/Reveal";
import { fileExhibit } from "../lib/api";
import { loadClearance, saveClearance } from "../lib/clearance";
import { safeHref } from "../lib/format";
import { EASE } from "../lib/motion";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1, ease: EASE }}
    >
      <p className="mb-6 flex items-baseline gap-4">
        <span className="font-display text-3xl text-ember">{n}</span>
        <span className="font-serif text-2xl italic text-bone/80">{title}</span>
      </p>
      {children}
    </motion.div>
  );
}

export default function FileExhibit() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [source, setSource] = useState("");
  const [clearance, setClearance] = useState(loadClearance);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const pick = (f: File | undefined) => {
    if (!f) return;
    if (!ACCEPT.includes(f.type)) {
      setError("The picture must be a JPEG, PNG, WebP, GIF or AVIF image.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError("That file is larger than 10 MB.");
      return;
    }
    setError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    pick(e.dataTransfer.files?.[0]);
  };

  const sourceInvalid = source.trim() !== "" && !safeHref(source.trim());
  const ready = !!file && title.trim() !== "" && clearance.trim() !== "" && !sourceInvalid;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!ready || !file) return;
    setBusy(true);
    setError(null);

    const form = new FormData();
    form.append("file", file);
    form.append("title", title.trim());
    form.append("description", description.trim());
    form.append("location", location.trim());
    form.append("source", source.trim());

    try {
      const saved = await fileExhibit(form, clearance.trim());
      saveClearance(clearance.trim());
      navigate(`/exhibit/${saved.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setBusy(false);
    }
  };

  return (
    <Layout>
      <section className="relative mx-auto max-w-[1600px] px-4 pt-32 sm:px-8 sm:pt-40">
        <div className="pointer-events-none absolute -top-10 left-0 h-[420px] w-[420px] rounded-full bg-ember/10 blur-[120px]" />
        <p className="label mb-6">Add to the record</p>
        <h1 className="font-display text-[clamp(4rem,14vw,13rem)] uppercase leading-[0.8] tracking-tight">
          <Words text="Bear" immediate delay={0.6} />{" "}
          <span className="font-serif normal-case italic text-ember glow">
            <Words text="witness." immediate delay={0.8} />
          </span>
        </h1>
        <motion.p
          className="mt-6 max-w-2xl border-b border-ash pb-12 font-serif text-[clamp(1.4rem,2.6vw,2.1rem)] italic leading-snug text-dim"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1.1 }}
        >
          Post a picture and tell what happened, so it is never only a picture.
        </motion.p>
      </section>

      <form onSubmit={submit} className="mx-auto mt-14 grid max-w-[1600px] gap-16 px-4 sm:px-8 lg:grid-cols-2" noValidate>
        {/* ---------- THE PICTURE ---------- */}
        <Step n="01" title="The picture">
          <div
            role="button"
            tabIndex={0}
            data-cursor={file ? "Replace" : "Choose"}
            aria-label={file ? `Selected ${file.name}. Choose a different image` : "Choose an image"}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), inputRef.current?.click())}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`group relative flex min-h-[460px] items-center justify-center overflow-hidden border transition-colors duration-500 ${
              dragging ? "border-ember bg-rust/30" : "border-ash hover:border-ember/60"
            }`}
          >
            <AnimatePresence mode="wait">
              {preview ? (
                <motion.div
                  key={preview}
                  className="relative"
                  initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: EASE }}
                >
                  <img src={preview} alt="Selected picture" className="max-h-[600px] w-auto max-w-full" />
                  <motion.span
                    className="stamp absolute right-5 top-5 bg-ink/50 text-xl"
                    initial={{ opacity: 0, scale: 2.4, rotate: -16 }}
                    animate={{ opacity: 0.9, scale: 1, rotate: -6 }}
                    transition={{ delay: 0.7, type: "spring", stiffness: 420, damping: 18 }}
                  >
                    Received
                  </motion.span>
                  <span className="label absolute bottom-3 left-3 bg-ink/80 px-2 py-1 !text-bone">
                    {file?.name} · {((file?.size ?? 0) / 1024 / 1024).toFixed(1)} MB · click to replace
                  </span>
                </motion.div>
              ) : (
                <motion.div key="empty" className="p-8 text-center" exit={{ opacity: 0 }}>
                  {/* a ring of light that breathes, waiting */}
                  <span className="relative mx-auto mb-10 flex h-24 w-24 items-center justify-center" aria-hidden="true">
                    <span className="absolute inset-0 animate-ping rounded-full border border-ember/40" />
                    <span className="beat absolute inset-4 rounded-full bg-ember/20 blur-md" />
                    <span className="h-3 w-3 rounded-full bg-ember glow-box" />
                  </span>
                  <p className="font-display text-5xl uppercase leading-none sm:text-6xl">
                    Drop the <span className="text-ember glow">picture</span> here
                  </p>
                  <p className="label mt-5">or click to choose · JPEG PNG WebP GIF AVIF · max 10 MB</p>
                </motion.div>
              )}
            </AnimatePresence>
            {/* corner marks, like a viewfinder */}
            {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map((c) => (
              <span key={c} className={`pointer-events-none absolute h-5 w-5 border-ember ${c}`} aria-hidden="true" />
            ))}
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT.join(",")}
              className="sr-only"
              tabIndex={-1}
              onChange={(e) => pick(e.target.files?.[0])}
            />
          </div>
        </Step>

        {/* ---------- WHAT HAPPENED ---------- */}
        <div className="space-y-14">
          <Step n="02" title="What happened">
            <div className="space-y-8">
              <div>
                <label htmlFor="title" className="label block">
                  In a few words <span className="text-ember">*</span>
                </label>
                <input
                  id="title"
                  className="field !font-display !text-3xl uppercase"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={500}
                  placeholder="What happened"
                  required
                />
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="location" className="label block">
                    Where
                  </label>
                  <input
                    id="location"
                    className="field"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    maxLength={300}
                    placeholder="City, country"
                  />
                </div>
                <div>
                  <label htmlFor="source" className="label block">
                    Source link
                  </label>
                  <input
                    id="source"
                    type="url"
                    className="field"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    maxLength={1000}
                    placeholder="https://…"
                    aria-invalid={sourceInvalid}
                    aria-describedby="source-hint"
                  />
                  <p id="source-hint" className={`label mt-2 ${sourceInvalid ? "!text-ember" : ""}`}>
                    {sourceInvalid ? "Must be an http(s) link" : "So it can't be denied"}
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="label block">
                  The story
                </label>
                <textarea
                  id="description"
                  className="field min-h-[200px] resize-y leading-relaxed"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={2000}
                  placeholder="Who was there. What was lost. Why it must be remembered."
                />
                <div className="mt-2 flex items-center justify-between gap-4">
                  <span className="h-px flex-1 bg-ash">
                    <span className="block h-full bg-ember transition-[width] duration-300" style={{ width: `${(description.length / 2000) * 100}%` }} />
                  </span>
                  <p className="label">{description.length} / 2000</p>
                </div>
              </div>
            </div>
          </Step>

          <Step n="03" title="Your key">
            <label htmlFor="clearance" className="label block">
              Clearance key <span className="text-ember">*</span>
            </label>
            <input
              id="clearance"
              type="password"
              className="field"
              value={clearance}
              onChange={(e) => setClearance(e.target.value)}
              autoComplete="current-password"
              required
            />
            <p className="label mt-2">Remembered on this device after a successful post.</p>
            <div className="mt-6">
              <AccessRequest />
            </div>
          </Step>

          {error && (
            <p className="border-l-2 border-ember pl-4 font-typed text-ember" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-blood w-full !py-6 !text-sm" disabled={!ready || busy} data-cursor="Post">
            {busy ? <span className="cursor">Entering into the record</span> : "Enter into the record →"}
          </button>
        </div>
      </form>
    </Layout>
  );
}
