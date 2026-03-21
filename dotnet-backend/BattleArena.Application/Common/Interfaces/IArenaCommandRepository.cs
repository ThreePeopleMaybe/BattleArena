using BattleArena.Db;
using BattleArena.Shared;

namespace BattleArena.Application.Common.Interfaces;

public interface IArenaCommandRepository
{
    Task<Arena> CreateArenaAsync(string arenaName, string arenaCode, int arenaOwner, CancellationToken cancellationToken = default);
    Task<bool> ArenaCodeExistsAsync(string arenaCode, CancellationToken cancellationToken = default);
    Task<int> InsertArenaPlayerAsync(int arenaId, int userId, CancellationToken cancellationToken = default);
    Task<bool> DeleteArenaAsync(int arenaId, CancellationToken cancellationToken = default);
    Task<bool> DeleteArenaPlayerAsync(int arenaPlayerId, CancellationToken cancellationToken = default);
}

public sealed record ArenaDto(int Id, string ArenaName, string ArenaCode, int ArenaOwner, ArenaStatus Status);
