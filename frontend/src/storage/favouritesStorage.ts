import AsyncStorage from '@react-native-async-storage/async-storage';

const FAV_OPPONENTS_KEY = '@trivia_battle_fav_opponents';
const FAV_TOPICS_KEY = '@trivia_battle_fav_topics';

// --- Favourite Opponents ---

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

// --- Favourite Topics ---

export async function getFavouriteTopicIds(): Promise<string[]> {
  try {
    const value = await AsyncStorage.getItem(FAV_TOPICS_KEY);
    if (value !== null) {
      const parsed = JSON.parse(value) as unknown;
      if (Array.isArray(parsed)) return parsed.filter((id) => typeof id === 'string');
    }
  } catch (_) {}
  return [];
}

export async function saveFavouriteTopicIds(ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(FAV_TOPICS_KEY, JSON.stringify(ids));
  } catch (_) {}
}

export async function toggleFavouriteTopic(id: string): Promise<string[]> {
  const ids = await getFavouriteTopicIds();
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
  await saveFavouriteTopicIds(next);
  return next;
}