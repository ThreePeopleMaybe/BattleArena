using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.Arenas.Commands;

public sealed record DeleteArenaPlayerCommand(int ArenaPlayerId) : IRequest<bool>;

public sealed class DeleteArenaPlayerCommandHandler(IArenaCommandRepository arenaCommandRepository)
    : IRequestHandler<DeleteArenaPlayerCommand, bool>
{
    public Task<bool> Handle(DeleteArenaPlayerCommand request, CancellationToken cancellationToken)
    {
        return arenaCommandRepository.DeleteArenaPlayerAsync(request.ArenaPlayerId, cancellationToken);
    }
}
