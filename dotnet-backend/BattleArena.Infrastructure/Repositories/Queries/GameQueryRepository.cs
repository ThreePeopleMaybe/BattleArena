using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;
using BattleArena.Shared;
using Microsoft.EntityFrameworkCore;
using static BattleArena.Application.Common.Dto;

namespace BattleArena.Infrastructure.Repositories.Queries;

public class GameQueryRepository(BattleArenaDbContext dbContext) : IGameQueryRepository
{
    public async Task<IReadOnlyList<ActiveGameData>> GetActiveGamesAsync(int gameTypeId, int arenaId, CancellationToken cancellationToken = default)
    {
        return await (
            from game in dbContext.Games.AsNoTracking()
            where game.GameTypeId == gameTypeId
                  && ((game.Status != GameStatus.Finished && arenaId == 0 && game.ArenaId == 0)
                      || game.ArenaId == arenaId)
            join topic in dbContext.QuestionTopics.AsNoTracking() on game.QuestionTopicId equals topic.Id
            join user in dbContext.Users.AsNoTracking() on game.StartedBy equals user.Id
            select new ActiveGameData(game.Id, game.StartedBy, user.UserName, game.Wager, topic.Id, topic.Name,
                game.ArenaId.GetValueOrDefault(), game.Status.ToString())
        ).ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<GameResult>?> GetGameResultAsync(long gameId, CancellationToken cancellationToken = default)
    {
        return await dbContext.GameResults
            .AsNoTracking()
            .Where(t => t.GameId == gameId)
            .ToListAsync(cancellationToken);
    }
}
