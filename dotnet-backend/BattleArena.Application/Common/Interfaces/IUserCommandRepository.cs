namespace BattleArena.Application.Common.Interfaces;

public interface IUserCommandRepository
{
    Task UpsertActivePlayerAsync(long userId, int gameTypeId, bool isActive, bool isPlaying, CancellationToken cancellationToken = default);
}
