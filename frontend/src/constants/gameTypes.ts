export const GAME_TYPE_TRIVIA = 1;
export const GAME_TYPE_SUDOKU = 2;
export const GAME_TYPE_ARCHERY = 3;

export type ChallengePlayScreen = 'Archery' | 'Sudoku';

export type GameTypeRegistryEntry = {
  id: number;
  title: string;
  challengePlayScreen?: ChallengePlayScreen;
};

export const GAME_TYPE_REGISTRY: readonly GameTypeRegistryEntry[] = [
  {
    id: GAME_TYPE_TRIVIA,
    title: 'Trivia',
  },
  {
    id: GAME_TYPE_SUDOKU,
    title: 'Sudoku',
    challengePlayScreen: 'Sudoku',
  },
  {
    id: GAME_TYPE_ARCHERY,
    title: 'Archery',
    challengePlayScreen: 'Archery',
  },
] as const;

const CONFIG_BY_ID = new Map<number, GameTypeRegistryEntry>(
  GAME_TYPE_REGISTRY.map((entry) => [entry.id, entry])
);

export function getGameTypeConfig(gameTypeId: number): GameTypeRegistryEntry {
  return CONFIG_BY_ID.get(gameTypeId) ?? GAME_TYPE_REGISTRY[0];
}

export function getHomeGameMeta(gameTypeId: number): { title: string } {
  const c = getGameTypeConfig(gameTypeId);
  return { title: c.title };
}

export function getChallengePlayScreen(gameTypeId: number): ChallengePlayScreen | undefined {
  return getGameTypeConfig(gameTypeId).challengePlayScreen;
}