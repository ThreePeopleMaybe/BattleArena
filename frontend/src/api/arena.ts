import { Arena, ArenaLeaderboardResult } from '../types';
import { battleArenaClient } from './battleArenaClient';
import { isBattleArenaApiError } from './httpErrorMessage';

export async function getArenaById(arenaId: number): Promise<Arena | null> {
  try {
    const { data } = await battleArenaClient.get<Arena>(`/api/v1/arenas/${arenaId}`);
    return {
      ...data,
      members: Array.isArray(data.members) ? data.members : [],
    };
  } catch (e) {
    if (isBattleArenaApiError(e) && e.status === 404) return null;
    throw e;
  }
}

export async function createArena(arenaName: string, arenaOwner: number, wager: number, gameTypeId: number): Promise<Arena> {
    const { data } = await battleArenaClient.post<Arena>('/api/v1/arenas', {
      arenaName,
      arenaOwner,
      wager: Math.max(0, Math.floor(wager)),
      gameTypeId,
    });
    return {
      ...data,
      members: Array.isArray(data.members) ? data.members : [],
    };
}

export async function deleteArena(arenaId: number): Promise<void> {
    await battleArenaClient.delete(`/api/v1/arenas/${arenaId}`);
}

export async function getArenasByUser(userId: number, gameTypeId: number): Promise<Arena[]> {
    const { data } = await battleArenaClient.get<Arena[]>(`/api/v1/arenas/user/${userId}?gameTypeId=${gameTypeId}`);
    if (!Array.isArray(data)) return [];
    return data.map((a) => ({
      ...a,
      members: Array.isArray(a.members) ? a.members : [],
    }));
}

export async function joinArena(arenaCode: string, userId: number): Promise<number> {
    const { data } =await battleArenaClient.post<number>('/api/v1/arenas/join', {
      arenaCode,
      userId,
    });

    return typeof data === 'number' ? data : Number(data);
}

export async function leaveArena(arenaId: number, userId: number): Promise<void> {
    await battleArenaClient.delete(`/api/v1/arenas/${arenaId}/player/user/${userId}`);
}

export async function updateArenaWager(arenaId: number, wagerAmount: number): Promise<void> {
    await battleArenaClient.patch(`/api/v1/arenas/${arenaId}/wager`, {
      wagerAmount: Math.max(0, wagerAmount),
    });
}

export async function getArenaLeaderboard(arenaId: number): Promise<ArenaLeaderboardResult[]> {
  if (!Number.isFinite(arenaId) || arenaId <= 0) {
    throw new Error('Invalid arena id');
  }
    const { data } = await battleArenaClient.get<ArenaLeaderboardResult[]>(
      `/api/v1/arenas/leaderboard/${arenaId}`
    );
    if (!Array.isArray(data)) return [];
    return data;
}