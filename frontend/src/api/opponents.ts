import type { Opponent } from '../data/opponents';
import { API_BASE_URL } from './config';
import { OPPONENTS } from '../data/opponents';

export type { Opponent };

/**
 * Fetches the list of opponents from the API.
 * Expected response: { opponents: Opponent[] } or Opponent[]
 * Each item: { id, name, wins, losses, wager?: number } - wager filters by default in UI.
 */
export async function fetchOpponents(): Promise<Opponent[]> {
  return OPPONENTS;
  /*
  const res = await fetch(`${API_BASE_URL}/opponents`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Failed to load opponents (${res.status})`);
  const data = (await res.json()) as unknown;
  const list = Array.isArray(data) ? data : (data as { opponents?: Opponent[] }).opponents;
  if (!Array.isArray(list)) throw new Error('Invalid response shape');
  const opponents: Opponent[] = list.map((o: unknown) => {
    const item = o as Record<string, unknown>;
    const w = item.wager;
    return {
      id: String(item.id ?? ''),
      name: String(item.name ?? ''),
      wins: Number(item.wins) || 0,
      losses: Number(item.losses) || 0,
      wager: w != null && w !== '' ? Number(w) : undefined,
    };
  });
  return opponents;
  */
}