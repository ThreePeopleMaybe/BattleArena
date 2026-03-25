export interface Opponent {
    id: string;
    name: string;
    wins: number;
    wager?: number;
}

export const OPPONENTS: Opponent[] = [
];

export function getOpponentByName(name: string): Opponent | undefined {
    return OPPONENTS.find((o) => o.name === name);
}

export function getRandomOpponent(): Opponent {
    return OPPONENTS[Math.floor(Math.random() * OPPONENTS.length)];
}