import Lenis from "lenis";
import { prefersReducedMotion } from "./motion";

/** One smooth-scroll instance for the whole site (off when reduced motion is requested). */
let lenis: Lenis | null = null;

export function startSmoothScroll(): () => void {
  if (prefersReducedMotion()) return () => {};
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
  let raf = 0;
  const loop = (time: number) => {
    lenis?.raf(time);
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return () => {
    cancelAnimationFrame(raf);
    lenis?.destroy();
    lenis = null;
  };
}

export function lockScroll(locked: boolean): void {
  if (locked) {
    lenis?.stop();
    document.body.style.overflow = "hidden";
  } else {
    lenis?.start();
    document.body.style.overflow = "";
  }
}

export function scrollToTop(): void {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}
