import { motion } from "motion/react";
import { Link } from "react-router-dom";
import type { Exhibit } from "../lib/types";
import { exhibitNo, fileDate, sized } from "../lib/format";
import { EASE } from "../lib/motion";
import { witnessedAt } from "../lib/witness";

/** One record on the wall: the image wipes up out of the dark as it scrolls in. */
export default function ExhibitCard({ exhibit, index = 0 }: { exhibit: Exhibit; index?: number }) {
  const seen = witnessedAt(exhibit.id);

  return (
    <motion.div
      className="mb-12 break-inside-avoid"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 1.1, ease: EASE, delay: (index % 4) * 0.09 }}
    >
      <Link to={`/exhibit/${exhibit.id}`} className="group block focus:outline-none" data-cursor="Open">
        <div className="relative overflow-hidden bg-char">
          <motion.img
            src={sized(exhibit.imageUrl, 900)}
            alt={exhibit.title}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full transition-transform duration-[1.6s] ease-[cubic-bezier(0.2,0.7,0.1,1)] group-hover:scale-[1.05]"
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ once: true, margin: "0px 0px -6% 0px" }}
            transition={{ duration: 1.3, ease: EASE, delay: 0.1 + (index % 4) * 0.09 }}
          />
          {/* red light rising from below on hover */}
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-rust/80 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-ember transition-transform duration-700 group-hover:scale-x-100 glow-box" />
          {seen && (
            <span className="label absolute left-3 top-3 flex items-center gap-2 bg-ink/75 px-2 py-1 !text-bone backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden="true" /> Witnessed
            </span>
          )}
        </div>

        <div className="mt-5 flex gap-4">
          <span className="font-display text-lg leading-none text-ember">{exhibitNo(exhibit.id)}</span>
          <div className="min-w-0">
            <h3 className="font-display text-[1.65rem] uppercase leading-[1.02] tracking-wide text-bone transition-colors duration-500 group-hover:text-ember">
              {exhibit.title}
            </h3>
            <p className="label mt-3">
              {exhibit.location || "Place unknown"} · {fileDate(exhibit.uploadedAt)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
