using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;
using BattleArena.Shared;
using Microsoft.EntityFrameworkCore;
using static BattleArena.Application.Common.Dto;

namespace BattleArena.Infrastructure.Repositories.Queries;

public class TriviaGameQueryRepository(BattleArenaDbContext dbContext) : ITriviaGameQueryRepository
{
    public async Task<IReadOnlyList<ActiveTriviaGameData>> GetActiveGamesAsync(int gameTypeId, int arenaId, CancellationToken cancellationToken = default)
    {
        return await (
            from game in dbContext.Games.AsNoTracking()
            where game.GameTypeId == gameTypeId
                  && ((game.Status != GameStatus.Finished && arenaId == 0 && game.ArenaId == 0)
                        || game.ArenaId == arenaId)
            join topic in dbContext.QuestionTopics.AsNoTracking() on game.QuestionTopicId equals topic.Id
            join user in dbContext.Users.AsNoTracking() on game.StartedBy equals user.Id
            select new ActiveTriviaGameData(game.Id, game.StartedBy, user.Username, game.Wager, topic.Id, topic.Name, game.ArenaId.GetValueOrDefault(), game.Status.ToString())
        ).ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<GameResult>> GetTriviaGameResultAsync(long gameId, CancellationToken cancellationToken = default)
    {
        return await dbContext.TriviaGameResults
            .AsNoTracking()
            .Where(t => t.GameId == gameId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Question>> GetTriviaGameQuestionsByGameIdAsync(long gameId, CancellationToken cancellationToken = default)
    {
        var questions = await (
            from triviaQuestion in dbContext.TriviaGameQuestions.AsNoTracking()
            join question in dbContext.Questions.AsNoTracking()
                on triviaQuestion.QuestionId equals question.Id
            where triviaQuestion.GameId == gameId
            select question
        ).ToListAsync(cancellationToken);

        if (questions.Count == 0)
        {
            return [];
        }

        var triviaGameQuestionIds = questions.Select(q => q.Id).ToList();

        var choiceRows = await (
            from triviaChoice in dbContext.TriviaGameChoices.AsNoTracking()
            join questionChoice in dbContext.QuestionChoices.AsNoTracking()
                on triviaChoice.ChoiceId equals questionChoice.Id
            where triviaChoice.GameId == gameId
            select new
            {
                triviaChoice.QuestionId,
                Choice = questionChoice
            }
        ).ToListAsync(cancellationToken);

        var choicesByQuestionId = choiceRows
            .GroupBy(c => c.QuestionId)
            .ToDictionary(
                c => c.Key,
                c => (ICollection<QuestionChoice>)c.Select(x => x.Choice).ToList()
            );

        questions.ForEach(q =>
        {
            q.Choices = choicesByQuestionId.GetValueOrDefault(q.Id, []);
        });

        return questions;
    }
}
