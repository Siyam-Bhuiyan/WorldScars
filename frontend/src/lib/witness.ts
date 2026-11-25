/** "I bear witness": remembered on this device only. Nothing is sent anywhere. */
const KEY = "worldscars.witnessed";

function read(): Record<string, string> {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}

export function witnessedAt(id: number): string | null {
  return read()[String(id)] ?? null;
}

export function markWitnessed(id: number): string {
  const now = new Date().toISOString();
  try {
    const all = read();
    all[String(id)] = now;
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable */
  }
  return now;
}
