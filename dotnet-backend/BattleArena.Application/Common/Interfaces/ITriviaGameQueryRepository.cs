using BattleArena.Db;
using static BattleArena.Application.Common.Dto;

namespace BattleArena.Application.Common.Interfaces;

public interface ITriviaGameQueryRepository
{
    Task<IReadOnlyList<ActiveTriviaGameData>> GetActiveGamesAsync(int gameTypeId, CancellationToken cancellationToken = default);

    Task<TriviaGameWinnerData?> GetTriviaGameWinnerAsync(long gameId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Question>> GetTriviaGameQuestionsByGameIdAsync(long gameId, CancellationToken cancellationToken = default);
}
