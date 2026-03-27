import type { ActiveTriviaGame, Question, QuizResult } from '../types';
import { battleArenaClient } from './battleArenaClient';

export const DEFAULT_TRIVIA_GAME_TYPE_ID = 1;

export interface CreateTriviaGameResponse {
    gameId: number;
    questions: Question[];
}

export async function createTriviaGame(params: {
    gameTypeId: number;
    wagerAmount: number;
    topicId: number;
    arenaId?: number;
}): Promise<CreateTriviaGameResponse> {
    const { data } = await battleArenaClient.post<CreateTriviaGameResponse>('/api/v1/trivia-games/create', {
        gameTypeId: params.gameTypeId,
        wagerAmount: params.wagerAmount,
        topicId: params.topicId,
        arenaId: params.arenaId,
    });

    return {
        gameId: Number(data.gameId),
        questions: Array.isArray(data.questions) ? data.questions : [],
    };
}

export async function insertTriviaGameResult(payload: {
    gameId: number;
    userId: number;
    topicId: number;
    numberOfCorrectAnswers: number;
    timeTakenInSeconds: number;
    details: QuizResult[];
}): Promise<number> {
    const { data } = await battleArenaClient.post<number>('/api/v1/trivia-games/results', {
        gameId: payload.gameId,
        userId: payload.userId,
        topicId: payload.topicId,
        numberOfCorrectAnswers: payload.numberOfCorrectAnswers,
        timeTakenInSeconds: payload.timeTakenInSeconds,
        details: payload.details,
    });

    return typeof data === 'number' ? data : Number(data);
}

export async function getActiveTriviaGame(gameTypeId: number, arenaId: number = 0): Promise<ActiveTriviaGame[]> {
    const { data } = await battleArenaClient.get<ActiveTriviaGame[]>(`/api/v1/trivia-games/active/${gameTypeId}`);
    return Array.isArray(data) ? data : [];
}

export async function getTriviaGameQuestionsByGameId(gameId: number): Promise<Question[]> {
    const { data } = await battleArenaClient.get<Question[]>(`/api/v1/trivia-games/${gameId}`);
    return Array.isArray(data) ? data : [];
}