using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;
using BattleArena.Shared;

namespace BattleArena.Infrastructure.Repositories.Commands;

public class GameCommandRepository(BattleArenaDbContext dbContext) : IGameCommandRepository
{
    public async Task<long> InsertGameAsync(int gameTypeId, int wager, long startedBy, int? arenaId, int? topicId, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var entity = new Game
        {
            GameTypeId = gameTypeId,
            ArenaId = arenaId ?? null,
            Wager = wager,
            StartedBy = startedBy,
            QuestionTopicId = topicId,
            Status = GameStatus.New,
            StartedAt = now,
            EndedAt = null,
            CreatedBy = "system",
            CreatedAt = now,
            UpdatedBy = "system",
            UpdatedAt = now
        };

        dbContext.Games.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }

    public async Task<bool> FinishGameAsync(long gameId, CancellationToken cancellationToken = default)
    {
        var entity = await dbContext.Games.FindAsync([gameId], cancellationToken);
        if (entity is null)
        {
            return false;
        }

        entity.Status = GameStatus.Finished;
        entity.EndedAt = DateTimeOffset.UtcNow;
        entity.UpdatedBy = "system";
        entity.UpdatedAt = DateTimeOffset.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
