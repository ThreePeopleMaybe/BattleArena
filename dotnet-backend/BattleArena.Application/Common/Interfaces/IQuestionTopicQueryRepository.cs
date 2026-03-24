using BattleArena.Db;

namespace BattleArena.Application.Common.Interfaces;

public interface IQuestionTopicQueryRepository
{
    Task<IReadOnlyList<QuestionTopicCategory>> GetQuestionTopicCategoriesAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<QuestionTopic>> GetQuestionTopicsAsync(CancellationToken cancellationToken = default);
}

public record QuestionTopicCategoryDto(int Id, string Name, string? Description);

public record QuestionTopicDto(int Id, string Name, int QuestionTopicCategoryId, string? Description);
