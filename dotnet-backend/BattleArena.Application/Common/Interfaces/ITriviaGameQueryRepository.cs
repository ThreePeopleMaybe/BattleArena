using BattleArena.Db;
using static BattleArena.Application.Common.Dto;

namespace BattleArena.Application.Common.Interfaces;

public interface ITriviaGameQueryRepository
{
    Task<IReadOnlyList<ActiveTriviaGameData>> GetActiveGamesAsync(int gameTypeId, int arenaId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<TriviaGameResult>?> GetTriviaGameResultAsync(long gameId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Question>> GetTriviaGameQuestionsByGameIdAsync(long gameId, CancellationToken cancellationToken = default);
}
