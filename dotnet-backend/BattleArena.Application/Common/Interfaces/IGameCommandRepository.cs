namespace BattleArena.Application.Common.Interfaces;

public interface IGameCommandRepository
{
    Task<long> InsertGameAsync(int gameTypeId, int wager, long startedBy, int? arenaId, int? topicId, CancellationToken cancellationToken = default);
    Task<(bool Success, int? ArenaId)> FinishGameAsync(long gameId, CancellationToken cancellationToken = default);
}
