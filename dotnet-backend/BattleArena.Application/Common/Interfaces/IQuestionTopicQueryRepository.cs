using BattleArena.Db;

namespace BattleArena.Application.Common.Interfaces;

public interface IQuestionTopicQueryRepository
{
    Task<IReadOnlyList<QuestionTopicCategory>> GetQuestionTopicCategoriesAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<QuestionTopic>> GetQuestionTopicsAsync(CancellationToken cancellationToken = default);
}
