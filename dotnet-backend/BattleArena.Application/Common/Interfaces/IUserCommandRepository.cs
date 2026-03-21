using BattleArena.Db;

namespace BattleArena.Application.Common.Interfaces;

public interface IUserCommandRepository
{
    Task<User?> SignUpUserAsync(string username, string firstName, string lastName, string? email, string? phoneNumber, int? amount, CancellationToken cancellationToken = default);
    Task UpsertActivePlayerAsync(long userId, int gameTypeId, bool isActive, bool isPlaying, CancellationToken cancellationToken = default);
    Task<bool> TrySetPlayersPlayingAsync(long userId, long matchedUserId, int gameTypeId, CancellationToken cancellationToken = default);
}
