using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.Arenas.Commands;

public sealed record InsertArenaPlayerCommand(int ArenaId, int UserId) : IRequest<int>;

public sealed class InsertArenaPlayerCommandHandler(IArenaCommandRepository arenaCommandRepository)
    : IRequestHandler<InsertArenaPlayerCommand, int>
{
    public Task<int> Handle(InsertArenaPlayerCommand request, CancellationToken cancellationToken)
    {
        return arenaCommandRepository.InsertArenaPlayerAsync(request.ArenaId, request.UserId, cancellationToken);
    }
}
