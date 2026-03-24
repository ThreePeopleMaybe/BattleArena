using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;
using BattleArena.Shared;
using Microsoft.EntityFrameworkCore;

namespace BattleArena.Infrastructure.Repositories.Queries;

public class TriviaGameQueryRepository(BattleArenaDbContext dbContext) : ITriviaGameQueryRepository
{
    public async Task<IReadOnlyList<ActiveTriviaGameData>> GetActiveGamesAsync(int gameTypeId, CancellationToken cancellationToken = default)
    {
        return await (
            from game in dbContext.Games.AsNoTracking()
            where game.GameTypeId == gameTypeId
                  && game.Status != GameStatus.Finished
            join result in dbContext.TriviaGameResults.AsNoTracking() on game.Id equals result.GameId
            join topic in dbContext.QuestionTopics.AsNoTracking() on result.QuestionTopicId equals topic.Id
            join user in dbContext.Users.AsNoTracking() on result.UserId equals user.Id
            select new ActiveTriviaGameData(result.GameId, result.UserId, user.Username, game.Wager, topic.Name)
        ).ToListAsync(cancellationToken);
    }

    public async Task<TriviaGameWinnerData?> GetTriviaGameWinnerAsync(long gameId, CancellationToken cancellationToken = default)
    {
        return await (
            from result in dbContext.TriviaGameResults.AsNoTracking()
            join user in dbContext.Users.AsNoTracking()
                on result.UserId equals user.Id
            where result.GameId == gameId
            orderby result.NumerOfCorrectAnswers descending, result.TimeTakenInSeconds ascending
            select new TriviaGameWinnerData(
                result.GameId,
                result.UserId,
                user.Username,
                result.NumerOfCorrectAnswers,
                result.TimeTakenInSeconds)
        ).FirstOrDefaultAsync(cancellationToken);
    }
}
