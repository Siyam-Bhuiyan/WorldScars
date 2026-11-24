import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Ticker from "./Ticker";

function ScarMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path
        d="M8 52 L24 36 L28 40 L40 22 L44 26 L56 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="square"
      />
    </svg>
  );
}

const NAV = [
  { to: "/archive", label: "Archive" },
  { to: "/file", label: "File an exhibit" },
];

export default function Layout({ children, bleed = false }: { children: ReactNode; bleed?: boolean }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="grain relative flex min-h-screen flex-col bg-ink text-bone">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:bg-blood focus:px-3 focus:py-2">
        Skip to content
      </a>

      <header
        className={`${bleed ? "absolute inset-x-0 top-0" : "sticky top-0 border-b border-ash bg-ink/90 backdrop-blur"} z-40`}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-8">
          <Link to="/" className="group flex items-center gap-3" aria-label="WorldScars home">
            <ScarMark className="h-6 w-6 text-blood transition-transform duration-500 group-hover:rotate-[-8deg]" />
            <span className="font-display text-2xl uppercase leading-none tracking-wide">WorldScars</span>
            <span className="label hidden border-l border-ash pl-3 lg:inline">Archive of wounds</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `label !text-[0.72rem] transition-colors hover:!text-bone ${isActive ? "!text-bone underline decoration-blood decoration-2 underline-offset-8" : ""}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="label !text-bone md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "[ Close ]" : "[ Menu ]"}
          </button>
        </div>

        {open && (
          <nav id="mobile-nav" className="border-t border-ash bg-ink px-4 py-6 md:hidden" aria-label="Mobile">
            <ul className="space-y-4">
              {NAV.map((n) => (
                <li key={n.to}>
                  <NavLink to={n.to} className="font-display text-4xl uppercase">
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="mt-24 border-t border-ash">
        <Ticker
          items={["The world watched", "Then it scrolled past", "Nothing here is fiction", "Every image is a witness", "Do not look away"]}
        />
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div>
            <p className="font-display text-5xl uppercase leading-none sm:text-6xl">
              Remember <span className="text-blood">them.</span>
            </p>
            <p className="mt-3 max-w-md font-typed text-sm text-dim">
              A photograph is often the last witness. This archive keeps the testimony open.
            </p>
          </div>
          <p className="label">WorldScars · Record open since 2025 · No case closed</p>
        </div>
      </footer>
    </div>
  );
}
