using BattleArena.Db;

namespace BattleArena.Application.Common.Interfaces;

public interface IQuestionTopicQueryRepository
{
    Task<IReadOnlyList<QuestionTopicCategory>> GetQuestionTopicCategoriesAsync(CancellationToken cancellationToken = default);
}

public record QuestionTopicCategoryDto(int Id, string Name, string? Description);

