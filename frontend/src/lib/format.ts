/** 14 -> "014" */
export function exhibitNo(id: number): string {
  return String(id).padStart(3, "0");
}

/** "2023-09-08T..." -> "08.09.2023" (case-file style) */
export function fileDate(iso: string | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

/** Only http(s) links are ever rendered as hrefs. */
export function safeHref(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:" ? u.href : null;
  } catch {
    return null;
  }
}

export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Ask Cloudinary for a resized, auto-format version of an image.
 * Non-Cloudinary URLs are returned unchanged.
 */
export function sized(url: string, width: number): string {
  const marker = "/image/upload/";
  const i = url.indexOf(marker);
  if (i === -1) return url;
  return `${url.slice(0, i + marker.length)}f_auto,q_auto,c_limit,w_${width}/${url.slice(i + marker.length)}`;
}
