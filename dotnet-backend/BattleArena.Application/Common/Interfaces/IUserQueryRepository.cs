using BattleArena.Db;
using BattleArena.Domain.Models;

namespace BattleArena.Application.Common.Interfaces;

public interface IUserQueryRepository
{
    Task<IReadOnlyList<Player>> GetFavoritePlayersAsync(long userId, int gameTypeId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Player>> GetActivePlayersByGameTypeIdAsync(int gameTypeId, CancellationToken cancellationToken = default);
    Task<Player?> GetMatchedPlayerAsync(long userId, int gameTypeId, CancellationToken cancellationToken = default);
    Task<User?> GetUserByIdAsync(long id, CancellationToken cancellationToken = default);
    Task<Player?> GetPlayerByUserNameAsync(string userName, int gameTypeId, CancellationToken cancellationToken = default);
}
