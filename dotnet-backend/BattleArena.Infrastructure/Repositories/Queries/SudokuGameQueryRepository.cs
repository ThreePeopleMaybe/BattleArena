using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;
using Microsoft.EntityFrameworkCore;

namespace BattleArena.Infrastructure.Repositories.Queries;

public sealed class SudokuGameQueryRepository(BattleArenaDbContext dbContext) : ISudokuGameQueryRepository
{
    public Task<SudokuGame?> GetSudokuGameByGameIdAsync(long gameId, CancellationToken cancellationToken = default)
    {
        return dbContext.SudokuGames
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.GameId == gameId, cancellationToken);
    }
}
