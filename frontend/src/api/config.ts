import Constants from 'expo-constants';

const defaultBase = '';

function readFromExtra(): string | undefined {
  const extra = Constants.expoConfig?.extra as { battlearenaApiUrl?: string } | undefined;
  const url = extra?.battlearenaApiUrl;
  if (typeof url === 'string' && url.trim().length > 0) return url.trim();
  return undefined;
}

export const BATTLEARENA_API_URL = readFromExtra() ?? defaultBase;