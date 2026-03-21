using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.Arenas.Commands;

public sealed record DeleteArenaCommand(int ArenaId) : IRequest<bool>;

public sealed class DeleteArenaCommandHandler(IArenaCommandRepository arenaCommandRepository)
    : IRequestHandler<DeleteArenaCommand, bool>
{
    public Task<bool> Handle(DeleteArenaCommand request, CancellationToken cancellationToken)
    {
        return arenaCommandRepository.DeleteArenaAsync(request.ArenaId, cancellationToken);
    }
}
