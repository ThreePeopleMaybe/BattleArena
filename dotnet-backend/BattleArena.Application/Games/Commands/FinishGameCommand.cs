using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.Games.Commands;

public sealed record FinishGameCommand(long GameId) : IRequest<bool>;

public sealed class FinishGameCommandHandler(
    IGameCommandRepository gameCommandRepository,
    IRealtimeNotifier realtimeNotifier)
    : IRequestHandler<FinishGameCommand, bool>
{
    public async Task<bool> Handle(FinishGameCommand request, CancellationToken cancellationToken)
    {
        var (success, arenaId) = await gameCommandRepository.FinishGameAsync(request.GameId, cancellationToken);
        if (success && arenaId is int aid && aid > 0)
        {
            await realtimeNotifier.NotifyGameChangeAsync(aid, request.GameId, 0, string.Empty, string.Empty, 0, "Finished", cancellationToken);
        }

        return success;
    }
}
