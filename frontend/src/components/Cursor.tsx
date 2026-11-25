import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { hasFinePointer } from "../lib/motion";

/**
 * A red point of light with a ring that trails it. Over anything marked
 * data-cursor="Open" the ring swells into a lit disc carrying that word.
 * Only on devices with a real mouse.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const rx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 220, damping: 26, mass: 0.6 });

  useEffect(() => {
    if (!hasFinePointer()) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const inspect = (el: Element | null) => {
      const tagged = el?.closest("[data-cursor]");
      setLabel(tagged ? tagged.getAttribute("data-cursor") : null);
      setHovering(!!el?.closest("a, button, [role='button'], label, input, textarea, select"));
    };
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      inspect(e.target instanceof Element ? e.target : null);
    };
    // content moves under a still mouse while scrolling
    const scrolled = () => inspect(document.elementFromPoint(x.get(), y.get()));
    const leave = () => setVisible(false);
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scrolled, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scrolled);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [x, y]);

  if (!enabled) return null;

  const size = label ? 92 : hovering ? 54 : 34;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200]" aria-hidden="true" style={{ opacity: visible ? 1 : 0 }}>
      {/* trailing ring / labelled disc */}
      <motion.div className="absolute left-0 top-0" style={{ x: rx, y: ry }}>
        <div className="-translate-x-1/2 -translate-y-1/2">
        <motion.div
          className={`flex items-center justify-center rounded-full ${
            label ? "bg-ember text-ink glow-box" : "border border-ember/70"
          }`}
          animate={{ width: size, height: size, scale: pressed ? 0.82 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          <AnimatePresence>
            {label && (
              <motion.span
                key={label}
                className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.2em]"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
        </div>
      </motion.div>

      {/* the point itself */}
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full bg-ember transition-[width,height,opacity] duration-200 ${
            label ? "h-0 w-0 opacity-0" : "h-[6px] w-[6px]"
          }`}
          style={{ boxShadow: "0 0 10px 2px rgba(255,53,39,0.8)" }}
        />
      </motion.div>
    </div>
  );
}
