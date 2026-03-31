using BattleArena.Db;
using static BattleArena.Application.Common.Dto;

namespace BattleArena.Application.Common.Interfaces;

public interface IGameQueryRepository
{
    Task<IReadOnlyList<ActiveGameData>> GetActiveGamesAsync(int gameTypeId, int arenaId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<GameResult>?> GetGameResultAsync(long gameId, CancellationToken cancellationToken = default);
}
