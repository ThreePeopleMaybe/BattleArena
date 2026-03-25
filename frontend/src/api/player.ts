import { BATTLEARENA_API_URL } from './config';

export interface FavoritePlayerDto {
    id: number;
    username: string;
    wins: number;
    losses: number;
    wager?: number;
}

export async function getFavoritePlayers(userId: number): Promise<FavoritePlayerDto[]> {
    const res = await fetch(`${BATTLEARENA_API_URL}/api/v1/users/favorites/${userId}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
        throw new Error(`Failed to load favorite players (${res.status})`);
    }

    const data = (await res.json()) as unknown;
    const list = Array.isArray(data) ? data : (data as { items?: unknown[] }).items ?? [];

    return (list as unknown[]).map((o: unknown) => {
        const item = o as Record<string, unknown>;
        const w = item.wagerAmount;
        return {
            id: Number(item.id) ?? 0,
            username: String(item.username ?? ''),
            wins: Number(item.wins) ?? 0,
            losses: Number(item.losses) ?? 0,
            wagerAmount: w !== null && w !== '' ? Number(w) : undefined,
        };
    }) as any;
}