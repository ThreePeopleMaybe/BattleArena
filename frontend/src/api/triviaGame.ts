import type { Question } from '../types';
import { battleArenaClient } from './battleArenaClient';

export interface CreateTriviaGameResponse {
    gameId: number;
    questions: Question[];
}

export async function createTriviaGame(params: {
    gameTypeId: number;
    wagerAmount: number;
    startedBy: number;
    topicId: number;
    arenaId?: number;
}): Promise<CreateTriviaGameResponse> {
    const { data } = await battleArenaClient.post<CreateTriviaGameResponse>('/api/v1/trivia-games/create', {
        gameTypeId: params.gameTypeId,
        wagerAmount: params.wagerAmount,
        startedBy: params.startedBy,
        topicId: params.topicId,
        arenaId: params.arenaId,
    });

    return {
        gameId: Number(data.gameId),
        questions: Array.isArray(data.questions) ? data.questions : [],
    };
}

export async function getTriviaGameQuestionsByGameId(gameId: number): Promise<Question[]> {
    const { data } = await battleArenaClient.get<Question[]>(`/api/v1/trivia-games/${gameId}`);
    return Array.isArray(data) ? data : [];
}