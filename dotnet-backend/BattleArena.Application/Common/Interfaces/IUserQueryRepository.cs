using BattleArena.Db;
using BattleArena.Domain.Models;

namespace BattleArena.Application.Common.Interfaces;

public interface IUserQueryRepository
{
    Task<IReadOnlyList<Player>> GetFavoritePlayersAsync(long userId, int gameTypeId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Player>> GetActivePlayersByGameTypeIdAsync(int gameTypeId, CancellationToken cancellationToken = default);
    Task<User?> GetUserByIdAsync(long id, CancellationToken cancellationToken = default);
    Task<Player?> GetPlayerByUserNameAsync(string userName, int gameTypeId, CancellationToken cancellationToken = default);
}

public record UserDto(long Id, string Username, string FirstName, string LastName, string? Email, string? PhoneNumber, int wins, int losses, int amount);
public record PlayerDto(long Id, string Username, int Wins, int Losses, int Wager);
