using BattleArena.Db;

namespace BattleArena.Application.Common.Interfaces;

public interface ISudokuGameCommandRepository
{
    Task InsertSudokuGameAsync(SudokuGame sudokuGame, CancellationToken cancellationToken = default);
}
