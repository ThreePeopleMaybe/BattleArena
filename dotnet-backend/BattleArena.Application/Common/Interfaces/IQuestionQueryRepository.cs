using BattleArena.Db;

namespace BattleArena.Application.Common.Interfaces;

public interface IQuestionQueryRepository
{
    Task<IReadOnlyList<Question>> GetQuestionsByTopicCategoryIdsAsync(IReadOnlyList<int> topicCategoryIds, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<QuestionChoice>> GetQuestionChoicesByTopicCategoryIdsAsync(IReadOnlyList<int> topicCategoryIds, CancellationToken cancellationToken = default);
}

public sealed record QuestionDto(long Id, string Text, long CorrectChoiceId, IReadOnlyList<QuestionChoiceDto> Choices);
public sealed record QuestionChoiceDto(long Id, string Choice, bool IsCorrectChoice);
