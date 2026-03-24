import AsyncStorage from '@react-native-async-storage/async-storage';

const FAV_OPPONENTS_KEY = '@trivia_battle_fav_opponents';
const FAV_TOPICS_KEY = '@trivia_battle_fav_topics';

export async function getFavouriteOpponentIds(): Promise<string[]> {
  try {
    const value = await AsyncStorage.getItem(FAV_OPPONENTS_KEY);
    if (value !== null) {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) return parsed.filter((id) => typeof id === 'string');
    }
  } catch (_) {}
  return [];
}

export async function saveFavouriteOpponentIds(ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(FAV_OPPONENTS_KEY, JSON.stringify(ids));
  } catch (_) {}
}

export async function toggleFavouriteOpponent(id: string): Promise<string[]> {
  const ids = await getFavouriteOpponentIds();
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
  await saveFavouriteOpponentIds(next);
  return next;
}

export async function getFavouriteTopicIds(): Promise<number[]> {
  try {
    const value = await AsyncStorage.getItem(FAV_TOPICS_KEY);
    if (value !== null) {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) {
        const topicIds = parsed.filter((id): id is number => typeof id === 'number');
        return [...new Set(topicIds)];
      }
    }
  } catch (_) {}
  return [];
}

export async function saveFavouriteTopicIds(ids: number[]): Promise<void> {
  try {
    await AsyncStorage.setItem(FAV_TOPICS_KEY, JSON.stringify(ids));
  } catch (_) {}
}

export async function toggleFavouriteTopic(topicId: number): Promise<number[]> {
  const ids = await getFavouriteTopicIds();
  const next = ids.includes(topicId) ? ids.filter((x) => x !== topicId) : [...ids, topicId];
  const unique = [...new Set(next)];
  await saveFavouriteTopicIds(unique);
  return unique;
}