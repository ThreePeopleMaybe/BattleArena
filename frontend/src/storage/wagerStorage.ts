import AsyncStorage from '@react-native-async-storage/async-storage';
const WAGER_STORAGE_KEY = '@trivia_battle_wager';

export async function getSavedWager(): Promise<number> {
  try {
    const value = await AsyncStorage.getItem(WAGER_STORAGE_KEY);
    if (value !== null) {
      const num = parseInt(value, 10);
      if (!Number.isNaN(num) && num >= 0) return num;
    }
  } catch (_) {}
  return 0;
}

export async function saveWager(amount: number): Promise<void> {
  try {
    await AsyncStorage.setItem(WAGER_STORAGE_KEY, String(amount));
  } catch (_) {}
}