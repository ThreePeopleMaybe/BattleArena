using BattleArena.Db;
using static BattleArena.Application.Common.Dto;

namespace BattleArena.Application.Common.Interfaces;

public interface ITriviaGameQueryRepository
{
    Task<IReadOnlyList<Question>> GetTriviaGameQuestionsByGameIdAsync(long gameId, CancellationToken cancellationToken = default);
}
