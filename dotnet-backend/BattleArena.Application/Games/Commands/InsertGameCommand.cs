using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.Games.Commands;

public sealed record InsertGameCommand(int GameTypeId, int Wager) : IRequest<long>;

public sealed class InsertGameCommandHandler(IGameCommandRepository gameCommandRepository)
    : IRequestHandler<InsertGameCommand, long>
{
    public Task<long> Handle(InsertGameCommand request, CancellationToken cancellationToken)
    {
        return gameCommandRepository.InsertGameAsync(request.GameTypeId, request.Wager, cancellationToken);
    }
}
