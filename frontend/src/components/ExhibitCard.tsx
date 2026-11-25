import { Link } from "react-router-dom";
import type { Exhibit } from "../lib/types";
import { exhibitNo, fileDate, sized } from "../lib/format";
import Redacted from "./Redacted";

export default function ExhibitCard({ exhibit }: { exhibit: Exhibit }) {
  return (
    <Link
      to={`/exhibit/${exhibit.id}`}
      className="group mb-8 block break-inside-avoid focus:outline-none"
    >
      <article className="torn relative bg-char px-3 pb-6 pt-3 transition-colors duration-500 group-hover:bg-[#1b1a17]">
        <div className="mb-3 flex items-center justify-between">
          <span className="label !text-bone">
            Exhibit <span className="text-blood">{exhibitNo(exhibit.id)}</span>
          </span>
          <span className="label">{fileDate(exhibit.uploadedAt)}</span>
        </div>

        <div className="relative overflow-hidden bg-ink">
          <img
            src={sized(exhibit.imageUrl, 900)}
            alt={exhibit.title}
            loading="lazy"
            decoding="async"
            className="exhibit-img block h-auto w-full"
          />
          {/* red wash that bleeds in on hover */}
          <span className="pointer-events-none absolute inset-0 bg-blood opacity-0 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-25" />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-blood transition-transform duration-700 group-hover:scale-x-100" />
        </div>

        <h3 className="mt-4 font-display text-2xl uppercase leading-[1.05] tracking-wide text-bone transition-colors group-hover:text-blood sm:text-[1.7rem]">
          {exhibit.title}
        </h3>

        <p className="label mt-3 flex flex-wrap gap-x-2">
          <span>Loc:</span>
          {exhibit.location ? <span className="text-bone">{exhibit.location}</span> : <Redacted focusable={false}>Unknown</Redacted>}
        </p>
      </article>
    </Link>
  );
}
