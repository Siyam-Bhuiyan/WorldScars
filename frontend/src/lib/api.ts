import type { Exhibit, Page } from "./types";

/**
 * The one place the backend URL lives. Set VITE_API_BASE_URL at build time
 * (Docker build arg, Railway variable, or frontend/.env.local for dev).
 */
export const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "https://worldscars-backend-production.up.railway.app"
).replace(/\/+$/, "");

export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, init);
  } catch {
    throw new ApiError("The archive is unreachable. Check your connection and try again.", 0);
  }

  const text = await res.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }

  if (!res.ok) {
    const message =
      body && typeof body === "object" && "error" in body && typeof body.error === "string"
        ? body.error
        : typeof body === "string" && body
          ? body
          : `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }
  return body as T;
}

export async function listExhibits(params: { q?: string; page?: number; size?: number } = {}): Promise<Page<Exhibit>> {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  qs.set("page", String(params.page ?? 0));
  qs.set("size", String(params.size ?? 24));

  const data = await request<Page<Exhibit> | Exhibit[]>(`/api/images?${qs}`);

  // Older backends returned a plain array; normalise so either works.
  if (Array.isArray(data)) {
    return { items: data, page: 0, size: data.length, totalItems: data.length, totalPages: 1, last: true };
  }
  return data;
}

export function getExhibit(id: number | string): Promise<Exhibit> {
  return request<Exhibit>(`/api/images/${encodeURIComponent(String(id))}`);
}

export function fileExhibit(form: FormData, clearance: string): Promise<Exhibit> {
  return request<Exhibit>("/api/images/upload", {
    method: "POST",
    headers: { "X-Admin-Token": clearance },
    body: form,
  });
}

export function expungeExhibit(id: number, clearance: string): Promise<void> {
  return request<void>(`/api/images/${id}`, {
    method: "DELETE",
    headers: { "X-Admin-Token": clearance },
  });
}
