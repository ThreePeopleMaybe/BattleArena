namespace BattleArena.Application.Common.Interfaces;

public interface ITriviaGameQueryRepository
{
    Task<IReadOnlyList<ActiveTriviaGameData>> GetActiveGamesAsync(int gameTypeId, CancellationToken cancellationToken = default);
    Task<TriviaGameWinnerData?> GetTriviaGameWinnerAsync(long gameId, CancellationToken cancellationToken = default);
}

public sealed record ActiveTriviaGameData(long GameId, long UserId, string UserName);

public sealed record TriviaGameWinnerData(long GameId, long UserId, string UserName, int NumberOfCorrectAnswers, int TimeTakenInSeconds);
