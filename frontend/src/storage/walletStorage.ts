import AsyncStorage from '@react-native-async-storage/async-storage';
const WALLET_STORAGE_KEY = '@trivia_battle_wallet';
const DEFAULT_BALANCE = 20;

export async function getWalletBalance(): Promise<number> {
  try {
    const value = await AsyncStorage.getItem(WALLET_STORAGE_KEY);
    if (value !== null) {
      const num = parseFloat(value);
      if (!Number.isNaN(num) && num >= 0) return num;
    }
  } catch (_) {}
  return DEFAULT_BALANCE;
}

export async function setWalletBalance(amount: number): Promise<number> {
  const balance = Math.max(0, Math.round(amount * 100) / 100);
  try {
    await AsyncStorage.setItem(WALLET_STORAGE_KEY, String(balance));
  } catch (_) {}
  return balance;
}

/** Add a delta to the current balance (positive or negative). Returns new balance. */
export async function addToWallet(delta: number): Promise<number> {
  const current = await getWalletBalance();
  return setWalletBalance(current + delta);
}