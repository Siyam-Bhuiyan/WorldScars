import { ECG_PATH, FLAT_PATH } from "../lib/motion";

/** A heart monitor trace: a faint line with a bright pulse running along it. */
export default function Ecg({ className = "", flat = false }: { className?: string; flat?: boolean }) {
  const d = flat ? FLAT_PATH : ECG_PATH;
  return (
    <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d={d} pathLength={1000} fill="none" stroke="currentColor" strokeOpacity={0.16} strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
      <path
        d={d}
        pathLength={1000}
        className="ecg-run"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ filter: "drop-shadow(0 0 6px rgba(255,53,39,0.9))" }}
      />
    </svg>
  );
}
