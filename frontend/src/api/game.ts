import { battleArenaClient } from './battleArenaClient';

export async function finishGame(gameId: number): Promise<void> {
    await battleArenaClient.put(`/api/v1/games/games/${gameId}/finish`);
}