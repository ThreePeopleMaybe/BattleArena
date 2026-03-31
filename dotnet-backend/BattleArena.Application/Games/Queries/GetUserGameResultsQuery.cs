using BattleArena.Db;
using MediatR;
using Microsoft.EntityFrameworkCore;
using static BattleArena.Application.Common.Dto;

namespace BattleArena.Application.Games.Queries;

public sealed record GetUserGameResultsQuery(long GameTypeId, long UserId)
    : IRequest<IEnumerable<UserGameResultDto>>;

public sealed class GetUserGameResultsQueryHandler(BattleArenaDbContext dbContext)
    : IRequestHandler<GetUserGameResultsQuery, IEnumerable<UserGameResultDto>>
{
    public async Task<IEnumerable<UserGameResultDto>> Handle(
        GetUserGameResultsQuery request,
        CancellationToken cancellationToken)
    {
        return await (
            from userResult in dbContext.GameResults.AsNoTracking()
            join game in dbContext.Games.AsNoTracking() on userResult.GameId equals game.Id
            join topic in dbContext.QuestionTopics.AsNoTracking()
                on game.QuestionTopicId equals topic.Id into topicJoin
            from topic in topicJoin.DefaultIfEmpty()
            join opponentResult in dbContext.GameResults.AsNoTracking()
                on userResult.GameId equals opponentResult.GameId into opponentResults
            from opponent in opponentResults
                .Where(x => x.UserId != request.UserId)
                .Take(1)
                .DefaultIfEmpty()
            join oppUser in dbContext.Users.AsNoTracking()
                on opponent.UserId equals oppUser.Id into oppUserJoin
            from oppUser in oppUserJoin.DefaultIfEmpty()
            where game.GameTypeId == request.GameTypeId && userResult.UserId == request.UserId
            orderby userResult.Id descending
            select new UserGameResultDto(
                userResult.Id,
                userResult.GameId,
                game.StartedBy,
                userResult.UserId,
                userResult.NumberOfCorrectAnswers,
                userResult.TimeTakenInSeconds,
                opponent == null ? 0 : opponent.NumberOfCorrectAnswers,
                opponent == null ? 0 : opponent.TimeTakenInSeconds,
                game.Status.ToString(),
                userResult.IsWinner,
                topic != null ? topic.Name : null,
                userResult.CreatedAt,
                oppUser != null ? oppUser.UserName : null))
            .ToListAsync(cancellationToken);
    }
}
