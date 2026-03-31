using BattleArena.Db;

namespace BattleArena.Application.Common.Interfaces;

public interface ISudokuGameQueryRepository
{
    Task<SudokuGame?> GetSudokuGameByGameIdAsync(long gameId, CancellationToken cancellationToken = default);
}
