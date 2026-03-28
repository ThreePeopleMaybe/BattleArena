using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.Arenas.Commands;

public sealed record LeaveArenaPlayerCommand(int ArenaId, long UserId) : IRequest<bool>;

public sealed class LeaveArenaPlayerCommandHandler(
    IArenaCommandRepository arenaCommandRepository,
    IRealtimeNotifier realtimeNotifier)
    : IRequestHandler<LeaveArenaPlayerCommand, bool>
{
    public async Task<bool> Handle(LeaveArenaPlayerCommand request, CancellationToken cancellationToken)
    {
        var ok = await arenaCommandRepository.LeaveArenaAsync(request.ArenaId, request.UserId, cancellationToken);
        if (ok)
        {
            await realtimeNotifier.NotifyLeaveArenaAsync(request.ArenaId, request.UserId, cancellationToken);
        }

        return ok;
    }
}
