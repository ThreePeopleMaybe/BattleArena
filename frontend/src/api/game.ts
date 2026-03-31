import { ActiveGame, UserGameResult } from '../types';
import { battleArenaClient } from './battleArenaClient';

export async function getUserGameResults(userId: number, gameTypeId: number): Promise<UserGameResult[]> {
    const params = 
        gameTypeId != null && gameTypeId > 0 ? { params: { gameTypeId } } : undefined;
    const { data } = await battleArenaClient.get<UserGameResult[]>(
        `/api/v1/games/results/user/${userId}/gametype/${gameTypeId}`,
        params
    );
    if (!Array.isArray(data)) {
        return [];
    }
    return data;
}

export type GameResultDetail = { questionId: number; choiceId: number };

export async function insertGameResult(payload: {
    gameId: number;
    userId: number;
    numberOfCorrectAnswers: number;
    timeTakenInSeconds: number;
    details?: GameResultDetail[];
}): Promise<number> {
    const { data } = await battleArenaClient.post<number>('/api/v1/games/results', {
        gameId: payload.gameId,
        userId: payload.userId,
        numberOfCorrectAnswers: payload.numberOfCorrectAnswers,
        timeTakenInSeconds: payload.timeTakenInSeconds,
        details: payload.details ?? [],
    });

    return typeof data === 'number' ? data : Number(data);
}

export async function setGameInProgress(gameId: number): Promise<void> {
    await battleArenaClient.put(`/api/v1/games/games/${gameId}/in-progress`);
}

export async function getActiveGame(gameTypeId: number, arenaId: number = 0): Promise<ActiveGame[]> {
    const { data } = await battleArenaClient.get<ActiveGame[]>(`/api/v1/games/active/${gameTypeId}/${arenaId}`);
    return Array.isArray(data) ? data : [];
}