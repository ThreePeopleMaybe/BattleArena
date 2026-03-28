using BattleArena.Application.Arenas.Queries;
using BattleArena.Application.Common.Interfaces;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace BattleArena.Api.Realtime;

public sealed class RealtimeNotifier(IHubContext<Hub> hubContext, ISender sender)
    : IRealtimeNotifier
{
    public async Task NotifyGameChangeAsync(int arenaId, long gameId, long userId, string userName, string topicName,
        int wagerAmount, string status, CancellationToken cancellationToken = default)
    {
        var payload = new GameRealtimePayload(arenaId, gameId, userId, userName, topicName, wagerAmount, status);
        await hubContext.Clients.Group(Hub.GroupName(arenaId))
            .SendAsync("GameChanged", payload, cancellationToken);
    }

    public async Task NotifyJoinArenaAsync(int arenaId, long userId, string userName,
        CancellationToken cancellationToken = default)
    {
        var arena = await sender.Send(new GetArenaByIdQuery(arenaId), cancellationToken);
        if (arena is null)
            return;

        var payload = new ArenaMemberChangedPayload(arenaId, userId, userName, "Join");
        await hubContext.Clients.Group(Hub.GroupName(arenaId))
            .SendAsync("ArenaLobbyChanged", payload, cancellationToken);
    }

    public async Task NotifyLeaveArenaAsync(int arenaId, long userId,
        CancellationToken cancellationToken = default)
    {
        var arena = await sender.Send(new GetArenaByIdQuery(arenaId), cancellationToken);
        if (arena is null)
            return;

        var payload = new ArenaMemberChangedPayload(arenaId, userId, string.Empty, "Leave");
        await hubContext.Clients.Group(Hub.GroupName(arenaId))
            .SendAsync("ArenaLobbyChanged", payload, cancellationToken);
    }
}
