using BattleArena.Db;

namespace BattleArena.Application.Common.Interfaces;

public interface IQuestionQueryRepository
{
    Task<IReadOnlyList<Question>> GetQuestionsByTopicIdsAsync(IReadOnlyList<int> topicIds, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<QuestionChoice>> GetQuestionChoicesByTopicIdsAsync(IReadOnlyList<int> topicIds, CancellationToken cancellationToken = default);
}

public sealed class QuestionDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public long CorrectChoiceId { get; set; }
    public IReadOnlyList<QuestionChoiceDto> Choices { get; set; } = [];
}

public sealed class QuestionChoiceDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool IsCorrectChoice { get; set; }
}
