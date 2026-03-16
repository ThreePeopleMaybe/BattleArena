using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.Users.Commands;

public sealed record UpsertActivePlayerCommand(long UserId, int GameTypeId, bool IsActive, bool IsPlaying) : IRequest<Unit>;

public sealed class UpsertActivePlayerCommandHandler(IUserCommandRepository userRepository)
    : IRequestHandler<UpsertActivePlayerCommand, Unit>
{
    public async Task<Unit> Handle(UpsertActivePlayerCommand request, CancellationToken cancellationToken)
    {
        await userRepository.UpsertActivePlayerAsync(
            request.UserId,
            request.GameTypeId,
            request.IsActive,
            request.IsPlaying,
            cancellationToken);

        return Unit.Value;
    }
}
