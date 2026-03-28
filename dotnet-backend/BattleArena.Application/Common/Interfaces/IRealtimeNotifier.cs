namespace BattleArena.Application.Common.Interfaces;

/// <summary>
/// Pushes arena updates to connected clients (e.g. SignalR).
/// </summary>
public interface IRealtimeNotifier
{
    Task NotifyGameChangeAsync(int arenaId, long gameId, long userId, string userName, string topicName,
        int wagerAmount, string status, CancellationToken cancellationToken = default);

    Task NotifyJoinArenaAsync(int arenaId, long userId, string userName,
        CancellationToken cancellationToken = default);

    Task NotifyLeaveArenaAsync(int arenaId, long userId,
        CancellationToken cancellationToken = default);
}
