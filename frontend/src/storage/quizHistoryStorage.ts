import AsyncStorage from '@react-native-async-storage/async-storage';

const QUIZ_HISTORY_KEY = '@trivia_quiz_history';

export interface QuizHistoryEntry {
  id: string;
  topicId: string;
  topicName: string;
  playerName?: string;
  wagerAmount?: number;
  mode: 'solo' | 'battle' | 'arena';
  userCorrect: number;
  totalQuestions: number;
  userTimeMs: number;
  opponentName?: string;
  opponentCorrect?: number;
  opponentTimeMs?: number;
  playedAt: number;
}

export async function getQuizHistory(): Promise<QuizHistoryEntry[]> {
  try {
    const value = await AsyncStorage.getItem(QUIZ_HISTORY_KEY);
    if (!value) return [];
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addQuizHistory(
  entry: Omit<QuizHistoryEntry, 'id' | 'playedAt'>
): Promise<void> {
  const history = await getQuizHistory();
  const newEntry: QuizHistoryEntry = {
    ...entry,
    id: `quiz_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    playedAt: Date.now(),
  };
  history.unshift(newEntry);
  try {
    await AsyncStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(history));
  } catch {
    // ignore storage errors
  }
}

function createDummyEntry(
  topicId: string,
  topicName: string,
  playerName: string,
  wagerAmount: number,
  playedAt: number
): QuizHistoryEntry {
  return {
    id: `quiz_dummy_${playedAt}_${Math.random().toString(36).slice(2, 7)}`,
    topicId,
    topicName,
    playerName,
    wagerAmount: wagerAmount > 0 ? wagerAmount : undefined,
    mode: 'battle',
    userCorrect: 8,
    totalQuestions: 10,
    userTimeMs: 45000,
    playedAt,
  };
}

export async function seedDummyQuizHistory(): Promise<void> {
  const existing = await getQuizHistory();
  if (existing.length > 0) return;

  const now = Date.now();
  const hour = 60 * 60 * 1000;
  const day = 24 * hour;

  const dummy: QuizHistoryEntry[] = [
    createDummyEntry('science', 'Science', 'Alex', 10, now - 2 * hour),
    createDummyEntry('music', 'Music', 'Sam', 0, now - 5 * hour),
    createDummyEntry('biology', 'Biology', 'Jordan', 25, now - 1 * day),
    createDummyEntry('history', 'History', 'Casey', 50, now - 1 * day - 3 * hour),
    createDummyEntry('geography', 'Geography', 'Morgan', 5, now - 2 * day),
    createDummyEntry('sports', 'Sports', 'Alex', 15, now - 2 * day - 2 * hour),
    createDummyEntry('movies', 'Movies', 'Jordan', 0, now - 3 * day),
    createDummyEntry('science', 'Science', 'Taylor', 100, now - 2 * day - 5 * hour),
    createDummyEntry('music', 'Music', 'Sam', 20, now - 4 * day),
    createDummyEntry('biology', 'Biology', 'Casey', 0, now - 5 * day),
  ];

  try {
    await AsyncStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(dummy));
  } catch {
    // ignore
  }
}