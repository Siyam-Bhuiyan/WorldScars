import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { heartbeatOn, setHeartbeat } from "../lib/heartbeat";
import { EASE, EASE_IO } from "../lib/motion";
import { lockScroll } from "../lib/scroll";
import Ecg from "./Ecg";
import Ticker from "./Ticker";

function ScarMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M8 52 L24 36 L28 40 L40 22 L44 26 L56 10" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="square" />
    </svg>
  );
}

const NAV = [
  { to: "/archive", label: "Archive" },
  { to: "/file", label: "Bear witness" },
];

/** Four bars that breathe while the heartbeat sound is on. */
function SoundToggle({ className = "" }: { className?: string }) {
  const [on, setOn] = useState(heartbeatOn);
  return (
    <button
      type="button"
      className={`group flex items-center gap-3 ${className}`}
      aria-pressed={on}
      onClick={() => {
        setHeartbeat(!on);
        setOn(!on);
      }}
    >
      <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
        {[0.5, 1, 0.7, 0.35].map((h, i) => (
          <motion.span
            key={i}
            className={`w-[2px] ${on ? "bg-ember" : "bg-dim"}`}
            animate={on ? { height: ["20%", `${h * 100}%`, "30%", "100%", "20%"] } : { height: "20%" }}
            transition={on ? { duration: 1.11, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" } : { duration: 0.3 }}
          />
        ))}
      </span>
      <span className="label transition-colors group-hover:!text-bone">{on ? "Heartbeat on" : "Sound off"}</span>
    </button>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const [menu, setMenu] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 180);
    setSolid(v > 40);
  });

  useEffect(() => {
    if (!menu) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  return (
    <div className="grain relative flex min-h-screen flex-col overflow-x-clip bg-ink text-bone">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:bg-ember focus:px-3 focus:py-2 focus:text-ink">
        Skip to content
      </a>

      {/* ---------- HEADER ---------- */}
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          solid && !menu ? "border-b border-ash/70 bg-ink/70 backdrop-blur-md" : "border-b border-transparent"
        }`}
        animate={{ y: hidden && !menu ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:h-20 sm:px-8">
          <Link to="/" className="group flex items-center gap-3" aria-label="WorldScars home" data-cursor="Home">
            <ScarMark className="h-6 w-6 text-ember transition-transform duration-500 group-hover:rotate-[-12deg]" />
            <span className="font-display text-2xl uppercase leading-none tracking-wide">WorldScars</span>
          </Link>

          <p className="label hidden items-center gap-3 xl:flex">
            <span className="beat inline-block h-2 w-2 rounded-full bg-ember glow-box" aria-hidden="true" />
            Live record · 54 BPM · No case closed
          </p>

          <div className="hidden items-center gap-10 md:flex">
            <nav className="flex items-center gap-8" aria-label="Main">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) => `roll label !text-[0.72rem] ${isActive ? "!text-ember" : "!text-bone"}`}
                >
                  <span>{n.label}</span>
                  <span aria-hidden="true">{n.label}</span>
                </NavLink>
              ))}
            </nav>
            <SoundToggle />
          </div>

          <button
            type="button"
            className="label relative z-[60] flex items-center gap-3 !text-bone md:hidden"
            aria-expanded={menu}
            aria-controls="mobile-nav"
            onClick={() => setMenu((m) => !m)}
          >
            {menu ? "Close" : "Menu"}
            <span className="relative block h-3 w-5" aria-hidden="true">
              <span className={`absolute left-0 h-px w-full bg-current transition-transform duration-500 ${menu ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-full bg-ember transition-transform duration-500 ${menu ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </motion.header>

      {/* ---------- MOBILE MENU ---------- */}
      <AnimatePresence>
        {menu && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            className="fixed inset-0 z-[45] flex flex-col justify-between bg-ink px-4 pb-8 pt-28 md:hidden"
            initial={{ clipPath: "circle(0% at 92% 4%)" }}
            animate={{ clipPath: "circle(150% at 92% 4%)" }}
            exit={{ clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: 0.8, ease: EASE_IO }}
          >
            <ul className="space-y-2">
              {[{ to: "/", label: "Home" }, ...NAV].map((n, i) => (
                <li key={n.to} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.08 }}
                  >
                    <NavLink
                      to={n.to}
                      end
                      onClick={() => setMenu(false)}
                      className={({ isActive }) => `block font-display text-[3.4rem] uppercase leading-[1.05] ${isActive ? "text-ember" : ""}`}
                    >
                      {n.label}
                    </NavLink>
                  </motion.div>
                </li>
              ))}
            </ul>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <Ecg className="mb-6 h-14 w-full text-ember" />
              <div className="flex items-center justify-between">
                <SoundToggle />
                <p className="label">No case closed</p>
              </div>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>

      <main id="main" className="flex-1">
        {children}
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer className="relative mt-32 overflow-hidden">
        <Ticker
          tone="void"
          items={["The world watched", "Then it scrolled past", "Nothing here is fiction", "Every image is a witness", "Do not look away"]}
        />
        {/* red light pooling up from the bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_at_50%_120%,rgba(255,53,39,0.22),transparent_65%)]" />

        <div className="relative mx-auto max-w-[1600px] px-4 pb-10 pt-16 sm:px-8">
          <Ecg className="h-20 w-full text-ember sm:h-28" />
          <p className="mt-6 font-display text-[clamp(4.2rem,17vw,16rem)] uppercase leading-[0.8] tracking-tight">Remember</p>
          <p className="font-serif text-[clamp(3.4rem,12vw,11rem)] italic leading-[0.9] text-ember glow">them.</p>

          <div className="mt-14 grid gap-8 border-t border-ash pt-8 sm:grid-cols-3">
            <p className="max-w-sm font-serif text-xl italic leading-snug text-dim">
              A photograph is often the last witness. This place keeps the testimony open.
            </p>
            <ul className="space-y-2">
              {[{ to: "/", label: "Home" }, ...NAV].map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="roll label !text-bone">
                    <span>{n.label}</span>
                    <span aria-hidden="true">{n.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="label sm:text-right">
              WorldScars · Record open since 2025
              <br />
              No case closed
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
