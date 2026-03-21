using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.Games.Commands;

public sealed record FinishGameCommand(long GameId) : IRequest<bool>;

public sealed class FinishGameCommandHandler(IGameCommandRepository gameCommandRepository)
    : IRequestHandler<FinishGameCommand, bool>
{
    public Task<bool> Handle(FinishGameCommand request, CancellationToken cancellationToken)
    {
        return gameCommandRepository.FinishGameAsync(request.GameId, cancellationToken);
    }
}
