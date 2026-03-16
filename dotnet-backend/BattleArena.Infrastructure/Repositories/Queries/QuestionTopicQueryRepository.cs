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
            .ToListAsync(cancellationToken);
    }
}
