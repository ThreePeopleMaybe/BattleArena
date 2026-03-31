using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;
using MediatR;

namespace BattleArena.Application.Arenas.Commands;

public sealed record JoinArenaCommand(string ArenaCode, long UserId) : IRequest<int>;

public sealed class JoinArenaCommandHandler(
    IArenaCommandRepository arenaCommandRepository,
    BattleArenaDbContext dbContext,
    IRealtimeNotifier realtimeNotifier)
    : IRequestHandler<JoinArenaCommand, int>
{
    public async Task<int> Handle(JoinArenaCommand request, CancellationToken cancellationToken)
    {
        var arena = dbContext.Arenas.FirstOrDefault(a => a.ArenaCode.Trim().ToLower() == request.ArenaCode.Trim().ToLower());
        if (arena == null)
        {
            throw new InvalidOperationException($"Arena '{request.ArenaCode}' does not exist.");
        }

        var id = await arenaCommandRepository.InsertArenaPlayerAsync(arena.Id, request.UserId, cancellationToken);
        var user = dbContext.Users.FirstOrDefault(u => u.Id == request.UserId);

        await realtimeNotifier.NotifyJoinArenaAsync(arena.Id, request.UserId, user.UserName, cancellationToken);

        return id;
    }
}
