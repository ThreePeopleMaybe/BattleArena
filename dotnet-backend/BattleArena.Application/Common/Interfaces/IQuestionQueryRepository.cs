using BattleArena.Db;

namespace BattleArena.Application.Common.Interfaces;

public interface IQuestionQueryRepository
{
    Task<IReadOnlyList<Question>> GetQuestionsByTopicIdsAsync(IReadOnlyList<int> topicIds, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<QuestionChoice>> GetQuestionChoicesByTopicIdsAsync(IReadOnlyList<int> topicIds, CancellationToken cancellationToken = default);
}
