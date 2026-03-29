export const GAME_TYPE_TRIVIA = 1;
export const GAME_TYPE_BOWLING = 2;
export const GAME_TYPE_ARCHERY = 3;

export type HomeGameVariant = 'trivia' | 'bowling' | 'archery';

type HomeGameMeta = { title: string; variant: HomeGameVariant };

const TRIVIA_HOME: HomeGameMeta = { title: 'Trivia', variant: 'trivia' };

const HOME_META_BY_TYPE: Record<number, HomeGameMeta> = {
  [GAME_TYPE_TRIVIA]: TRIVIA_HOME,
  [GAME_TYPE_BOWLING]: { title: 'Bowling', variant: 'bowling' },
  [GAME_TYPE_ARCHERY]: { title: 'Archery', variant: 'archery' },
};

// references
export function getHomeGameMeta(gameTypeId: number): HomeGameMeta {
  return HOME_META_BY_TYPE[gameTypeId] ?? TRIVIA_HOME;
}