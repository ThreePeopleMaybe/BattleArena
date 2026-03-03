/**
 * Base URL for the trivia API.
 * Override with EXPO_PUBLIC_API_URL in .env or set here for production.
 */
export const API_BASE_URL = 'https://api.example.com';

/**
 * Base URL for BattleArena.Api (e.g. GET /api/v1/users/favorites/{userId}).
 * Override with EXPO_PUBLIC_BATTLEARENA_API_URL in .env if different from API_BASE_URL.
 */
export const BATTLEARENA_API_URL =
  (typeof process !== 'undefined' && (process as unknown as { env?: { EXPO_PUBLIC_BATTLEARENA_API_URL?: string } }).env?.EXPO_PUBLIC_BATTLEARENA_API_URL) ||
  API_BASE_URL;