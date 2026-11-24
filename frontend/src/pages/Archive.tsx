import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import ExhibitCard from "../components/ExhibitCard";
import { Failure, Retrieving } from "../components/Status";
import { listExhibits } from "../lib/api";
import type { Exhibit } from "../lib/types";

const PAGE_SIZE = 24;

export default function Archive() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const [input, setInput] = useState(q);

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

  // Re-query whenever the committed search (URL ?q=) changes.
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

  return (
    <Layout>
      <section className="mx-auto max-w-[1600px] px-4 pt-14 sm:px-8 sm:pt-20">
        <p className="label mb-4">Record · Public access</p>
        <div className="flex flex-col gap-10 border-b border-ash pb-10 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="font-display text-[clamp(3.5rem,11vw,9rem)] uppercase leading-[0.85]">
            The <span className="text-blood">archive</span>
          </h1>

          <div className="w-full max-w-md">
            <label htmlFor="search" className="label">
              Search the record
            </label>
            <div className="mt-1 flex items-center gap-3">
              <span className="font-typed text-blood" aria-hidden="true">
                &gt;
              </span>
              <input
                id="search"
                type="search"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="place, event, word…"
                className="field"
                autoComplete="off"
              />
            </div>
            <p className="label mt-3" aria-live="polite">
              {loading ? "Searching…" : error ? "Record unavailable" : `${total} exhibit${total === 1 ? "" : "s"} ${q ? `matching “${q}”` : "on file"}`}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 pt-12 sm:px-8">
        {loading ? (
          <Retrieving what="exhibits" />
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
            <p className="font-display text-5xl uppercase sm:text-7xl">
              {q ? "No record found." : "The record is empty."}
            </p>
            <p className="mt-4 font-typed text-dim">
              {q ? "Nothing matches that search. Silence is also evidence." : "For now. Somebody has to begin."}
            </p>
            <Link to="/file" className="btn btn-blood mt-10">
              File the first exhibit
            </Link>
          </div>
        ) : (
          <>
            <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 2xl:columns-4">
              {items.map((e) => (
                <ExhibitCard key={e.id} exhibit={e} />
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              {last ? (
                <p className="label">— End of record —</p>
              ) : (
                <button type="button" className="btn" disabled={loadingMore} onClick={() => load(q, page + 1)}>
                  {loadingMore ? "Pulling files…" : "Pull more files"}
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </Layout>
  );
}
