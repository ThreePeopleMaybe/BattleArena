import type { Question } from '../types';
import { battleArenaClient } from './battleArenaClient';

export function parseQuestionTopicIds(topicId: number, opponentTopicId?: number): number[] {
  if (opponentTopicId) {
    const a = Number(topicId);
    const b = Number(opponentTopicId);
    return [...new Set([a, b].filter((n) => Number.isFinite(n) && n > 0))];
  }
  const n = Number(topicId);
  return Number.isFinite(n) && n > 0 ? [n] : [];
}

export async function getQuestionsByTopicId(
  topicId: number,
  options?: { opponentTopicId?: number; maxQuestions?: number }
): Promise<Question[]> {
  const ids = parseQuestionTopicIds(topicId, options?.opponentTopicId);
  if (ids.length === 0) return [];

  const params = new URLSearchParams();
  for (const id of ids) {
    params.append('topicIds', String(id));
  }

  const { data } = await battleArenaClient.get<unknown>(
    `/api/v1/questions/topics?${params.toString()}`
  );

  if (!Array.isArray(data)) return [];
  return data;
}