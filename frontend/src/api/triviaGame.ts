import { Question } from '../types';
import { battleArenaClient } from './battleArenaClient';

export interface ApiQuestionChoiceDto {
  id: number;
  text: string;
  isCorrectChoice: boolean;
}

export interface ApiQuestionDto {
  id: number;
  text: string;
  correctChoiceId: number;
  choices: ApiQuestionChoiceDto[];
}

export interface CreateTriviaGameResponse {
  gameId: number;
  questions: Question[];
  triviaGameQuestionIdsByQuestionId: Record<string, number>;
}

export async function createTriviaGame(params: {
  gameTypeId: number;
  wager: number;
  topicCategoryIds: number[];
}): Promise<CreateTriviaGameResponse> {
  const { data } = await battleArenaClient.post<CreateTriviaGameResponse>('/api/v1/trivia-games/create', {
    gameTypeId: params.gameTypeId,
    wager: params.wager,
    topicCategoryIds: params.topicCategoryIds,
  });

  return {
    gameId: Number(data.gameId),
    questions: Array.isArray(data.questions) ? data.questions : [],
    triviaGameQuestionIdsByQuestionId:
      data.triviaGameQuestionIdsByQuestionId && typeof data.triviaGameQuestionIdsByQuestionId === 'object'
        ? data.triviaGameQuestionIdsByQuestionId
        : {},
  };
}

export async function insertTriviaGameResult(payload: {
  gameId: number;
  userId: number;
  numberOfCorrectAnswers: number;
  timeTakenInSeconds: number;
}): Promise<number> {
  const { data } = await battleArenaClient.post<number>('/api/v1/trivia-games/results', {
    gameId: payload.gameId,
    userId: payload.userId,
    numberOfCorrectAnswers: payload.numberOfCorrectAnswers,
    timeTakenInSeconds: payload.timeTakenInSeconds,
  });

  return typeof data === 'number' ? data : Number(data);
}

export interface ActiveTriviaGameResultDto {
  gameId: number;
  userId: number;
  userName: string;
  wager: number;
  topicId: number;
  topicName: string;
}

export async function getActiveTriviaGame(gameTypeId: number): Promise<ActiveTriviaGameResultDto[]> {
  const { data } = await battleArenaClient.get<ActiveTriviaGameResultDto[]>(`/api/v1/trivia-games/active/${gameTypeId}`);
  return Array.isArray(data) ? data : [];
}