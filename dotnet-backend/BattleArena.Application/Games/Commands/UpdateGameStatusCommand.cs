using BattleArena.Application.Common.Interfaces;
using BattleArena.Shared;
using MediatR;

namespace BattleArena.Application.Games.Commands;

public sealed record UpdateGameStatusCommand(long GameId, GameStatus Status) : IRequest<bool>;

public sealed class FinishGameCommandHandler(
    IGameCommandRepository gameCommandRepository,
    IRealtimeNotifier realtimeNotifier)
    : IRequestHandler<UpdateGameStatusCommand, bool>
{
    public async Task<bool> Handle(UpdateGameStatusCommand request, CancellationToken cancellationToken)
    {
        var (success, arenaId) = await gameCommandRepository.UpdateGameStatusAsync(request.GameId, request.Status, cancellationToken);
        if (success && arenaId is int aid && aid > 0)
        {
            await realtimeNotifier.NotifyGameChangeAsync(aid, request.GameId, 0, string.Empty, string.Empty, 0, "Finished", cancellationToken);
        }

        return success;
    }
}
