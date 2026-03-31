using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;

namespace BattleArena.Infrastructure.Repositories.Commands;

public sealed class SudokuGameCommandRepository(BattleArenaDbContext dbContext) : ISudokuGameCommandRepository
{
    public async Task InsertSudokuGameAsync(SudokuGame sudokuGame, CancellationToken cancellationToken = default)
    {
        dbContext.SudokuGames.Add(sudokuGame);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
