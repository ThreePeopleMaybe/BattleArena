using BattleArena.Db;

namespace BattleArena.Application.Common.Interfaces;

public interface IArenaCommandRepository
{
    Task<Arena> CreateArenaAsync(string arenaName, string arenaCode, int arenaOwner, int wagerAmount, CancellationToken cancellationToken = default);

    Task<bool> ArenaCodeExistsAsync(string arenaCode, CancellationToken cancellationToken = default);

    Task<int> InsertArenaPlayerAsync(int arenaId, long userId, CancellationToken cancellationToken = default);

    Task<bool> DeleteArenaAsync(int arenaId, CancellationToken cancellationToken = default);

    Task<bool> LeaveArenaAsync(int arenaId, long userId, CancellationToken cancellationToken = default);

    Task<bool> UpdateArenaWagerAsync(int arenaId, int wagerAmount, CancellationToken cancellationToken = default);
}
