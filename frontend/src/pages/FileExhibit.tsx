import { useEffect, useRef, useState, type DragEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { fileExhibit } from "../lib/api";
import { loadClearance, saveClearance } from "../lib/clearance";
import { safeHref } from "../lib/format";
import AccessRequest from "../components/AccessRequest";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

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

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const pick = (f: File | undefined) => {
    if (!f) return;
    if (!ACCEPT.includes(f.type)) {
      setError("Evidence must be a JPEG, PNG, WebP, GIF or AVIF image.");
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
      <section className="mx-auto max-w-[1600px] px-4 pt-14 sm:px-8 sm:pt-20">
        <p className="label mb-4">Form WS-01 · Exhibit intake</p>
        <h1 className="border-b border-ash pb-10 font-display text-[clamp(3.2rem,10vw,8.5rem)] uppercase leading-[0.85]">
          File an <span className="text-blood">exhibit</span>
        </h1>
      </section>

      <form onSubmit={submit} className="mx-auto mt-12 grid max-w-[1600px] gap-12 px-4 sm:px-8 lg:grid-cols-2" noValidate>
        {/* ---------- EVIDENCE ---------- */}
        <div>
          <p className="label mb-3">01 · Evidence</p>
          <div
            role="button"
            tabIndex={0}
            aria-label={file ? `Selected ${file.name}. Choose a different image` : "Choose an image"}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), inputRef.current?.click())}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`relative flex min-h-[420px] cursor-pointer items-center justify-center overflow-hidden border-2 border-dashed transition-colors ${
              dragging ? "border-blood bg-rust/20" : "border-smoke hover:border-bone"
            }`}
          >
            {preview ? (
              <>
                <img src={preview} alt="Selected evidence" className="max-h-[560px] w-auto max-w-full grayscale" />
                <span className="stamp absolute right-6 top-6 bg-ink/40 text-xl">Received</span>
                <span className="label absolute bottom-3 left-3 bg-ink/80 px-2 py-1 !text-bone">
                  {file?.name} · {((file?.size ?? 0) / 1024 / 1024).toFixed(1)} MB · click to replace
                </span>
              </>
            ) : (
              <div className="p-8 text-center">
                <p className="font-display text-5xl uppercase leading-none sm:text-6xl">
                  Drop <span className="text-blood">evidence</span> here
                </p>
                <p className="label mt-5">or click to choose · JPEG PNG WebP GIF AVIF · max 10 MB</p>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT.join(",")}
              className="sr-only"
              tabIndex={-1}
              onChange={(e) => pick(e.target.files?.[0])}
            />
          </div>
        </div>

        {/* ---------- RECORD ---------- */}
        <div className="space-y-8">
          <div>
            <p className="label mb-3">02 · Record</p>
            <label htmlFor="title" className="label block">
              Title <span className="text-blood">*</span>
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
                Location
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
              <p id="source-hint" className={`label mt-2 ${sourceInvalid ? "!text-blood" : ""}`}>
                {sourceInvalid ? "Must be an http(s) link" : "So it can't be denied"}
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="label block">
              Testimony
            </label>
            <textarea
              id="description"
              className="field min-h-[180px] resize-y leading-relaxed"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={5000}
              placeholder="Who was there. What was lost. Why it must be remembered."
            />
            <p className="label mt-2 text-right">{description.length} / 5000</p>
          </div>

          <div className="border-t border-ash pt-8">
            <p className="label mb-3">03 · Authorisation</p>
            <label htmlFor="clearance" className="label block">
              Clearance key <span className="text-blood">*</span>
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
            <p className="label mt-2">Remembered on this device after a successful filing.</p>
            <div className="mt-6">
              <AccessRequest />
            </div>
          </div>

          {error && (
            <p className="border-l-2 border-blood pl-4 font-typed text-blood" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-blood w-full !py-5 !text-sm" disabled={!ready || busy}>
            {busy ? <span className="cursor">Entering into the record</span> : "Enter into the record →"}
          </button>
        </div>
      </form>
    </Layout>
  );
}
