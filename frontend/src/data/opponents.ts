export interface Opponent {
  id: string;
  name: string;
  wins: number;
  losses: number;
  /** If set, opponent only appears when user's wager matches. Undefined = any wager. */
  wager?: number;
}

export const OPPONENTS: Opponent[] = [
  { id: 'qm', name: 'QuizMaster', wins: 42, losses: 18, wager: 1 },
  { id: 'bb', name: 'BrainBox', wins: 38, losses: 22, wager: 5 },
  { id: 'tk', name: 'TriviaKing', wins: 55, losses: 12, wager: 10 },
  { id: 'sc', name: 'SmartCookie', wins: 31, losses: 29, wager: 25 },
  { id: 'ff', name: 'FactFinder', wins: 48, losses: 15 },
  { id: 'tt', name: 'ThinkTank', wins: 27, losses: 33, wager: 1 },
  { id: 'wo', name: 'WiseOwl', wins: 61, losses: 9, wager: 5 },
  { id: 'cm', name: 'CuriousMind', wins: 35, losses: 25, wager: 10 },
];

export function getOpponentByName(name: string): Opponent | undefined {
  return OPPONENTS.find((o) => o.name === name);
}

export function getRandomOpponent(): Opponent {
  return OPPONENTS[Math.floor(Math.random() * OPPONENTS.length)];
}