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
    public sealed record ArenaDto(
        int Id,
        string ArenaName,
        string ArenaCode,
        int ArenaOwner,
        ArenaStatus Status,
        int WagerAmount,
        IReadOnlyList<ArenaPlayerDto>? Members = null);

    public sealed record ArenaPlayerDto(long UserId, string UserName);

    public sealed record QuestionTopicCategoryDto(int Id, string Name, string? Description);

    public sealed record QuestionTopicDto(int Id, string Name, int QuestionTopicCategoryId, string? Description);

    public sealed record ActiveGameData(long GameId, long UserId, string UserName, int WagerAmount, int TopicId, string TopicName, int ArenaId, string Status);

    public sealed record ArenaLeaderboardEntryDto(string UserName, int Wins, int Losses, int GamesPlayed, int TotalCorrectAnswers, int TotalTimeTakenInSeconds);

    public sealed record UserDto(long Id, string Username, string FirstName, string LastName, string? Email, string? PhoneNumber, int wins, int losses, int amount);

    public sealed record PlayerDto(long Id, string Username, int Wins, int Losses, int WagerAmount);
    public sealed record TriviaGameResultDetailDto(int QuestionId, int ChoiceId);
    public sealed record SudokuGameDto(long GameId, int PuzzleIndex, int[][] InitialGrid);
    public class UserGameResultDto(
        long id,
        long gameId,
        long startedBy,
        long userId,
        int numberOfCorrectAnswers,
        int timeTakenInSeconds,
        int opponentNumberOfCorrectAnswers,
        int opponentTimeTakenInSeconds,
        string status,
        bool? isWinner,
        string? topicName,
        DateTimeOffset? createdAt,
        string? opponentUserName)
    {
        public long Id { get; set; } = id;
        public long GameId { get; set; } = gameId;
        public long StartedBy { get; set; } = startedBy;
        public long UserId { get; set; } = userId;
        public int NumberOfCorrectAnswers { get; set; } = numberOfCorrectAnswers;
        public int TimeTakenInSeconds { get; set; } = timeTakenInSeconds;
        public int OpponentNumberOfCorrectAnswers { get; set; } = opponentNumberOfCorrectAnswers;
        public int OpponentTimeTakenInSeconds { get; set; } = opponentTimeTakenInSeconds;
        public bool? IsWinner { get; set; } = isWinner;
        public string Status { get; set; } = status;
        public string? TopicName { get; set; } = topicName;
        public DateTimeOffset? CreatedAt { get; set; } = createdAt;
        public string? OpponentUserName { get; set; } = opponentUserName;
    }
}
