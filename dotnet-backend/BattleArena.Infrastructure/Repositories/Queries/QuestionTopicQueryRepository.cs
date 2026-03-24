using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;
using Microsoft.EntityFrameworkCore;

namespace BattleArena.Infrastructure.Repositories.Queries;

public sealed class QuestionTopicQueryRepository(BattleArenaDbContext dbContext) : IQuestionTopicQueryRepository
{
    public async Task<IReadOnlyList<QuestionTopicCategory>> GetQuestionTopicCategoriesAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.QuestionTopicCategories
            .AsNoTracking()
            .OrderBy(c => c.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<QuestionTopic>> GetQuestionTopicsAsync(CancellationToken cancellationToken = default)
    {
        return await dbContext.QuestionTopics
            .AsNoTracking()
            .OrderBy(t => t.Name)
            .ToListAsync(cancellationToken);
    }
}
