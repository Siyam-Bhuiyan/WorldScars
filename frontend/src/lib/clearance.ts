// The admin "clearance key" is remembered on this device only.
const KEY = "worldscars.clearance";

export function loadClearance(): string {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function saveClearance(value: string): void {
  try {
    if (value) localStorage.setItem(KEY, value);
    else localStorage.removeItem(KEY);
  } catch {
    /* storage unavailable: key just isn't remembered */
  }
}
