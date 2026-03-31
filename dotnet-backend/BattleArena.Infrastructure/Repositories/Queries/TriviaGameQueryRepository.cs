using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;
using BattleArena.Shared;
using Microsoft.EntityFrameworkCore;
using static BattleArena.Application.Common.Dto;

namespace BattleArena.Infrastructure.Repositories.Queries;

public class TriviaGameQueryRepository(BattleArenaDbContext dbContext) : ITriviaGameQueryRepository
{
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
