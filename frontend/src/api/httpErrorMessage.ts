import axios, { type AxiosError } from 'axios';

export class BattleArenaApiError extends Error {
  readonly status?: number;

  constructor(message: string, options?: { status?: number; cause?: unknown }) {
    super(message, options?.cause != null ? { cause: options.cause } : undefined);
    this.name = 'BattleArenaApiError';
    this.status = options?.status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function isBattleArenaApiError(e: unknown): e is BattleArenaApiError {
  return e instanceof BattleArenaApiError;
}

export function messageFromResponseBody(data: unknown): string | null {
  if (data == null) return null;
  if (typeof data === 'string') {
    const t = data.trim();
    return t.length > 0 ? t : null;
  }
  if (typeof data === 'object') {
    const o = data as { title?: unknown; detail?: unknown };
    if (typeof o.detail === 'string' && o.detail.trim()) return o.detail.trim();
    if (typeof o.title === 'string' && o.title.trim()) return o.title.trim();
  }
  return null;
}

export function messageFromAxiosError(error: unknown, fallback: string = 'Request failed.'): string {
  if (error instanceof BattleArenaApiError) return error.message;
  if (axios.isAxiosError(error)) {
    const ax = error as AxiosError<unknown>;
    const fromBody = messageFromResponseBody(ax.response?.data);
    if (fromBody) return fromBody;
    if (ax.response?.status != null) {
      return `Request failed (${ax.response.status}).`;
    }
  }
  if (error instanceof Error) return error.message;
  return fallback;
}