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

    public async Task<(bool Success, int? ArenaId)> UpdateGameStatusAsync(long gameId, GameStatus status, CancellationToken cancellationToken = default)
    {
        var entity = await dbContext.Games.FindAsync([gameId], cancellationToken);
        if (entity is null)
        {
            return (false, null);
        }

        entity.Status = status;
        entity.EndedAt = DateTimeOffset.UtcNow;
        entity.UpdatedBy = "system";
        entity.UpdatedAt = DateTimeOffset.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return (true, entity.ArenaId);
    }

    public async Task<long> InsertGameResultAsync(long gameId, long userId, int numberOfCorrectAnswers, int timeTakenInSeconds, bool? isWinner, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var entity = new GameResult
        {
            GameId = gameId,
            UserId = userId,
            NumberOfCorrectAnswers = numberOfCorrectAnswers,
            TimeTakenInSeconds = timeTakenInSeconds,
            IsWinner = isWinner,
            CreatedBy = "system",
            CreatedAt = now,
            UpdatedBy = "system",
            UpdatedAt = now
        };

        dbContext.GameResults.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }

    public async Task UpdateGameResultWinnerAsync(IReadOnlyList<GameResult> triviaGameResults, CancellationToken cancellationToken = default)
    {
        if (triviaGameResults.Count == 0)
        {
            return;
        }

        var now = DateTimeOffset.UtcNow;
        foreach (var triviaGameResult in triviaGameResults)
        {
            triviaGameResult.UpdatedBy = "system";
            triviaGameResult.UpdatedAt = now;
        }

        dbContext.GameResults.UpdateRange(triviaGameResults);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
