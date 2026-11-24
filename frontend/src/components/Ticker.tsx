export default function Ticker({ items, tone = "blood" }: { items: string[]; tone?: "blood" | "bone" }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <li key={i} className="flex items-center whitespace-nowrap px-6 font-display text-lg uppercase tracking-wider">
          {t}
          <span className="ml-12 inline-block h-2 w-2 rotate-45 bg-current" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`overflow-hidden py-2 ${tone === "blood" ? "bg-blood text-bone" : "bg-bone text-ink"}`}
      role="marquee"
      aria-label={items.join(". ")}
    >
      <div className="ticker">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
