using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.Games.Commands;

public sealed record InsertGameCommand(int GameTypeId, int Wager, long StartedBy, int? ArenaId, int? TopicId) : IRequest<long>;

public sealed class InsertGameCommandHandler(IGameCommandRepository gameCommandRepository)
    : IRequestHandler<InsertGameCommand, long>
{
    public Task<long> Handle(InsertGameCommand request, CancellationToken cancellationToken)
    {
        return gameCommandRepository.InsertGameAsync(request.GameTypeId, request.Wager, request.StartedBy, request.ArenaId, request.TopicId, cancellationToken);
    }
}
