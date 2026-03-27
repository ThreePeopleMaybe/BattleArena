using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;
using MediatR;

namespace BattleArena.Application.Arenas.Commands;

public sealed record JoinArenaCommand(string ArenaCode, long UserId) : IRequest<int>;

public sealed class InsertArenaPlayerCommandHandler(IArenaCommandRepository arenaCommandRepository, BattleArenaDbContext dbContext)
    : IRequestHandler<JoinArenaCommand, int>
{
    public Task<int> Handle(JoinArenaCommand request, CancellationToken cancellationToken)
    {
        var arena = dbContext.Arenas.FirstOrDefault(a => a.ArenaCode.Trim().ToLower() == request.ArenaCode.Trim().ToLower());
        if (arena == null)
        {
            throw new InvalidOperationException($"Arena '{request.ArenaCode}' does not exist.");
        }

        return arenaCommandRepository.InsertArenaPlayerAsync(arena.Id, request.UserId, cancellationToken);
    }
}
