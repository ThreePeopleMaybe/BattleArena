using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.Arenas.Commands;

public sealed record UpdateArenaWagerCommand(int ArenaId, int WagerAmount) : IRequest<bool>;

public sealed class UpdateArenaWagerCommandHandler(IArenaCommandRepository arenaCommandRepository)
    : IRequestHandler<UpdateArenaWagerCommand, bool>
{
    public Task<bool> Handle(UpdateArenaWagerCommand request, CancellationToken cancellationToken) =>
        arenaCommandRepository.UpdateArenaWagerAsync(request.ArenaId, request.WagerAmount, cancellationToken);
}
