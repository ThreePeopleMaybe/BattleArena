using BattleArena.Db;
using static BattleArena.Application.Common.Dto;

namespace BattleArena.Application.Common.Interfaces;

public interface IArenaQueryRepository
{
    Task<IReadOnlyList<Arena>> GetArenasByUserIdAsync(long userId, int gameTypeId, CancellationToken cancellationToken = default);

    Task<Arena?> GetArenaByIdAsync(int arenaId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ArenaPlayerDto>> GetArenaPlayersAsync(int arenaId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ArenaLeaderboardEntryDto>> GetArenaLeaderboardAsync(int arenaId, CancellationToken cancellationToken = default);
}
