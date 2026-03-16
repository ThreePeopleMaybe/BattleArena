using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;
using Microsoft.EntityFrameworkCore;

namespace BattleArena.Infrastructure.Repositories.Queries;

public sealed class QuestionQueryRepository(BattleArenaDbContext dbContext) : IQuestionQueryRepository
{
    public async Task<IReadOnlyList<Question>> GetQuestionsByTopicCategoryIdsAsync(IReadOnlyList<int> topicCategoryIds, CancellationToken cancellationToken = default)
    {
        return await dbContext.Questions
            .AsNoTracking()
            .Where(q => topicCategoryIds.Contains(q.TopicCategoryId))
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<QuestionChoice>> GetQuestionChoicesByTopicCategoryIdsAsync(IReadOnlyList<int> topicCategoryIds, CancellationToken cancellationToken = default)
    {
        return await dbContext.QuestionChoices
            .AsNoTracking()
            .Where(q => topicCategoryIds.Contains(q.TopicCategoryId))
            .ToListAsync(cancellationToken);
    }
}
