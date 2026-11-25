export default function Ticker({ items, tone = "blood" }: { items: string[]; tone?: "blood" | "bone" | "void" }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <li key={i} className="flex items-center whitespace-nowrap px-6 font-display text-lg uppercase tracking-wider">
          {t}
          <span className={`ml-12 inline-block h-2 w-2 rounded-full ${tone === "void" ? "beat bg-ember" : "bg-current"}`} aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  const tones = {
    blood: "bg-ember text-ink",
    bone: "bg-bone text-ink",
    void: "border-y border-ash bg-ink text-bone/80",
  };

  return (
    <div className={`overflow-hidden py-2.5 ${tones[tone]}`} role="marquee" aria-label={items.join(". ")}>
      <div className="ticker">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
