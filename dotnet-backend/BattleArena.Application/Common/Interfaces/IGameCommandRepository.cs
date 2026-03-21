namespace BattleArena.Application.Common.Interfaces;

public interface IGameCommandRepository
{
    Task<long> InsertGameAsync(int gameTypeId, int wager, CancellationToken cancellationToken = default);
    Task<bool> FinishGameAsync(long gameId, CancellationToken cancellationToken = default);
}
