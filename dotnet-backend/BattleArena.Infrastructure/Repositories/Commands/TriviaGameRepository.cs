using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;

namespace BattleArena.Infrastructure.Repositories.Commands;

public class TriviaGameCommandRepository(BattleArenaDbContext dbContext) : ITriviaGameCommandRepository
{
    public async Task<Dictionary<long, long>> InsertTriviaGameQuestionAsync(long gameId, List<long> questionIds, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var entities = new List<TriviaGameQuestion>();
        foreach (var questionId in questionIds)
        {
            var entity = new TriviaGameQuestion
            {
                GameId = gameId,
                QuestionId = questionId,
                CreatedBy = "system",
                CreatedAt = now,
                UpdatedBy = "system",
                UpdatedAt = now
            };
            dbContext.TriviaGameQuestions.Add(entity);
            entities.Add(entity);
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        return entities.ToDictionary(e => e.QuestionId, e => e.Id);
    }

    public async Task InsertTriviaGameChoiceAsync(Dictionary<long, long> triviaGameQuestions, IReadOnlyList<QuestionDto> questions, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var questionsById = questions.ToDictionary(q => q.Id);

        foreach (var question in questions)
        {
            if (!triviaGameQuestions.ContainsKey(question.Id))
            {
                continue;
            }

            foreach (var answer in question.Choices ?? [])
            {
                var choiceEntity = new TriviaGameChoice
                {
                    TriviaGameQuestionId = triviaGameQuestions[question.Id],
                    AnswerId = answer.Id,
                    CreatedBy = "system",
                    CreatedAt = now,
                    UpdatedBy = "system",
                    UpdatedAt = now
                };
                dbContext.TriviaGameChoices.Add(choiceEntity);
            }
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<long> InsertTriviaGameResultAsync(long gameId, long userId, int numberOfCorrectAnswers, int timeTakenInSeconds, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var entity = new TriviaGameResult
        {
            GameId = gameId,
            UserId = userId,
            NumerOfCorrectAnswers = numberOfCorrectAnswers,
            TimeTakenInSeconds = timeTakenInSeconds,
            CreatedBy = "system",
            CreatedAt = now,
            UpdatedBy = "system",
            UpdatedAt = now
        };

        dbContext.TriviaGameResults.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }

    public async Task InsertTriviaGameResultDetailAsync(IReadOnlyList<TriviaGameResultDetail> details, CancellationToken cancellationToken = default)
    {
        dbContext.TriviaGameResultDetails.AddRange(details);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
