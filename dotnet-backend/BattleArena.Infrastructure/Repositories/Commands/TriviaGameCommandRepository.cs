using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;
using static BattleArena.Application.Common.Dto;

namespace BattleArena.Infrastructure.Repositories.Commands;

public class TriviaGameCommandRepository(BattleArenaDbContext dbContext) : ITriviaGameCommandRepository
{
    public async Task InsertTriviaGameQuestionAsync(long gameId, IReadOnlyList<QuestionDto> questions, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var entities = new List<TriviaGameQuestion>();
        foreach (var question in questions)
        {
            var entity = new TriviaGameQuestion
            {
                GameId = gameId,
                QuestionId = question.Id,
                CreatedBy = "system",
                CreatedAt = now,
                UpdatedBy = "system",
                UpdatedAt = now
            };
            dbContext.TriviaGameQuestions.Add(entity);
            entities.Add(entity);
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task InsertTriviaGameChoiceAsync(long gameId, IReadOnlyList<QuestionDto> questions, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;

        foreach (var question in questions)
        {
            foreach (var answer in question.Choices ?? [])
            {
                var choiceEntity = new TriviaGameChoice
                {
                    GameId = gameId,
                    QuestionId = question.Id,
                    ChoiceId = answer.Id,
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

    public async Task<long> InsertTriviaGameResultAsync(long gameId, long userId, int topicId, int numberOfCorrectAnswers, int timeTakenInSeconds, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var entity = new TriviaGameResult
        {
            GameId = gameId,
            UserId = userId,
            QuestionTopicId = topicId,
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
