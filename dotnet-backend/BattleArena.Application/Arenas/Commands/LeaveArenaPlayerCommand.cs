using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.Arenas.Commands;

public sealed record LeaveArenaPlayerCommand(int ArenaId, long UserId) : IRequest<bool>;

public sealed class LeaveArenaPlayerCommandHandler(IArenaCommandRepository arenaCommandRepository)
    : IRequestHandler<LeaveArenaPlayerCommand, bool>
{
    public Task<bool> Handle(LeaveArenaPlayerCommand request, CancellationToken cancellationToken) =>
        arenaCommandRepository.LeaveArenaAsync(request.ArenaId, request.UserId, cancellationToken);
}
