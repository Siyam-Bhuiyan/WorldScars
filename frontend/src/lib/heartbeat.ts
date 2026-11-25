/**
 * A synthesised heartbeat (no audio files): two soft low thumps, "lub-dub",
 * at 54 beats per minute. Off by default; only starts after a click.
 */
const BPM = 54;

let ctx: AudioContext | null = null;
let timer = 0;
let playing = false;

function thump(at: number, freq: number, gain: number) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const amp = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq, at);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.55, at + 0.2);
  filter.type = "lowpass";
  filter.frequency.value = 420;
  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(gain, at + 0.018);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + 0.26);
  osc.connect(filter).connect(amp).connect(ctx.destination);
  osc.start(at);
  osc.stop(at + 0.3);
}

function beat() {
  if (!ctx) return;
  const t = ctx.currentTime + 0.02;
  thump(t, 78, 0.6);
  thump(t + 0.23, 64, 0.38);
}

export function setHeartbeat(on: boolean): void {
  window.clearInterval(timer);
  playing = on;
  if (!on) {
    void ctx?.suspend();
    return;
  }
  ctx ??= new AudioContext();
  void ctx.resume();
  beat();
  timer = window.setInterval(beat, 60000 / BPM);
}

/** Sound is never auto-played; it only runs after the visitor turns it on. */
export function heartbeatOn(): boolean {
  return playing;
}
