import { QuestionTopic } from '../types';
import { battleArenaClient } from './battleArenaClient';
import { BATTLEARENA_API_URL } from './config';


export async function getQuestionTopics(): Promise<QuestionTopic[]> {
  if (!BATTLEARENA_API_URL?.trim()) {
    throw new Error(
      'BattleArena API URL is empty. Set BATTLEARENA_API_URL in .env.local (KEY=value, no spaces) and restart Metro.'
    );
  }

  const { data, status } = await battleArenaClient.get<unknown>('/api/v1/topics/topics');

  if (status !== 200) {
    throw new Error(`Topics request failed (${status}).`);
  }

  if (!Array.isArray(data)) {
    throw new Error(
      'Invalid topics response (expected a JSON array). Check that BATTLEARENA_API_URL points to BattleArena.Api.'
    );
  }

  return data;
}