using BattleArena.Shared;

namespace BattleArena.Application.Common;

public class Dto
{
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
        public int QuestionId { get; set; }
        public string Text { get; set; } = string.Empty;
        public bool IsCorrectChoice { get; set; }
    }

    public sealed record ArenaDto(int Id, string ArenaName, string ArenaCode, int ArenaOwner, ArenaStatus Status);

    public record QuestionTopicCategoryDto(int Id, string Name, string? Description);

    public record QuestionTopicDto(int Id, string Name, int QuestionTopicCategoryId, string? Description);

    public sealed record ActiveTriviaGameData(long GameId, long UserId, string UserName, int WagerAmount, int TopicId, string TopicName);

    public sealed record TriviaGameWinnerData(long GameId, long UserId, string UserName, int NumberOfCorrectAnswers, int TimeTakenInSeconds);

    public record UserDto(long Id, string Username, string FirstName, string LastName, string? Email, string? PhoneNumber, int wins, int losses, int amount);

    public record PlayerDto(long Id, string Username, int Wins, int Losses, int WagerAmount);
}
