using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;
using Microsoft.EntityFrameworkCore;

namespace BattleArena.Infrastructure.Repositories.Queries;

public sealed class QuestionQueryRepository(BattleArenaDbContext dbContext) : IQuestionQueryRepository
{
    public async Task<IReadOnlyList<Question>> GetQuestionsByTopicIdsAsync(IReadOnlyList<int> topicIds, CancellationToken cancellationToken = default)
    {
        return await dbContext.Questions
            .AsNoTracking()
            .Include(q => q.Topic)
            .Where(q => topicIds.Contains(q.QuestionTopicId))
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<QuestionChoice>> GetQuestionChoicesByTopicIdsAsync(IReadOnlyList<int> topicIds, CancellationToken cancellationToken = default)
    {
        return await dbContext.QuestionChoices
            .AsNoTracking()
            .Include(qc => qc.Question)
            .Where(qc => topicIds.Contains(qc.Question.QuestionTopicId))
            .ToListAsync(cancellationToken);
    }
}
