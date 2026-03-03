import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = '@trivia_battle_auth';

export interface AuthUser {
  email: string;
  password?: string;
}

export async function getSavedAuth(): Promise<AuthUser | null> {
  try {
    const value = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (value !== null) {
      const parsed = JSON.parse(value) as AuthUser;
      if (parsed?.email) return parsed;
    }
  } catch (_) {}
  return null;
}

export async function saveAuth(user: AuthUser): Promise<void> {
  try {
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (_) {}
}

export async function clearAuth(): Promise<void> {
  try {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (_) {}
}