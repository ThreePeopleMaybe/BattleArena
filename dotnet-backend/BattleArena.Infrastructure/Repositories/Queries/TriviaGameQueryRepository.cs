using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;
using BattleArena.Shared;
using Microsoft.EntityFrameworkCore;

namespace BattleArena.Infrastructure.Repositories.Queries;

public class TriviaGameQueryRepository(BattleArenaDbContext dbContext) : ITriviaGameQueryRepository
{
    public async Task<IReadOnlyList<ActiveTriviaGameData>> GetActiveGamesAsync(int gameTypeId, CancellationToken cancellationToken = default)
    {
        var games = await dbContext.Games.AsNoTracking()
            .Where(game => game.GameTypeId == gameTypeId
                           && game.Status != GameStatus.Finished)
            .ToListAsync(cancellationToken);

        if (games.Count == 0)
        {
            return [];
        }

        var gameIds = games.Select(game => game.Id).ToList();

        return await (from result in dbContext.TriviaGameResults.AsNoTracking()
                join user in dbContext.Users.AsNoTracking()
                    on result.UserId equals user.Id
                where gameIds.Contains(result.GameId)
                select new ActiveTriviaGameData(result.GameId, result.UserId, user.Username))
            .ToListAsync(cancellationToken);
    }

    public Task<TriviaGameWinnerData?> GetTriviaGameWinnerAsync(long gameId, CancellationToken cancellationToken = default)
    {
        return (from result in dbContext.TriviaGameResults.AsNoTracking()
                join user in dbContext.Users.AsNoTracking()
                    on result.UserId equals user.Id
                where result.GameId == gameId
                orderby result.NumerOfCorrectAnswers descending, result.TimeTakenInSeconds ascending
                select new TriviaGameWinnerData(
                    result.GameId,
                    result.UserId,
                    user.Username,
                    result.NumerOfCorrectAnswers,
                    result.TimeTakenInSeconds))
            .FirstOrDefaultAsync(cancellationToken);
    }
}
