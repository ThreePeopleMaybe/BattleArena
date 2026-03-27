using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;
using BattleArena.Shared;
using Microsoft.EntityFrameworkCore;
using static BattleArena.Application.Common.Dto;

namespace BattleArena.Infrastructure.Repositories.Queries;

public class ArenaQueryRepository(BattleArenaDbContext dbContext) : IArenaQueryRepository
{
    public async Task<IReadOnlyList<Arena>> GetArenasByUserIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        return await dbContext.Arenas.AsNoTracking()
            .Where(a => a.Status != ArenaStatus.Deleted &&
                (a.ArenaOwner == userId ||
                 dbContext.ArenaPlayers.Any(ap => ap.ArenaId == a.Id &&
                    ap.UserId == userId &&
                    ap.Status != ArenaPlayerStatus.Deleted)))
            .ToListAsync(cancellationToken);
    }

    public async Task<Arena?> GetArenaByIdAsync(int arenaId, CancellationToken cancellationToken = default)
    {
        return await dbContext.Arenas.AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == arenaId && a.Status != ArenaStatus.Deleted, cancellationToken);
    }

    public async Task<IReadOnlyList<ArenaPlayerDto>> GetArenaPlayersAsync(int arenaId, CancellationToken cancellationToken = default)
    {
        return await (
            from ap in dbContext.ArenaPlayers.AsNoTracking()
            from u in dbContext.Users.AsNoTracking()
            where ap.ArenaId == arenaId
               && ap.Status != ArenaPlayerStatus.Deleted
               && ap.UserId == u.Id
            select new ArenaPlayerDto(ap.UserId, u.Username))
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<ArenaLeaderboardEntryDto>> GetArenaLeaderboardAsync(int arenaId, CancellationToken cancellationToken = default)
    {
        var rows = await (
            from g in dbContext.Games.AsNoTracking()
            where g.ArenaId == arenaId && g.Status == GameStatus.Finished
            join r in dbContext.TriviaGameResults.AsNoTracking() on g.Id equals r.GameId
            join u in dbContext.Users.AsNoTracking() on r.UserId equals u.Id
            select new
            {
                u.Username,
                r.NumberOfCorrectAnswers,
                r.TimeTakenInSeconds,
                r.IsWinner,
            }).ToListAsync(cancellationToken);

        if (rows.Count == 0)
            return [];

        var leaderboard = rows
            .GroupBy(x => x.Username)
            .Select(g =>
            {
                var wins = g.Count(x => x.IsWinner.GetValueOrDefault());
                var losses = g.Count(x => x.IsWinner == false);

                return new
                {
                    g.Key,
                    Wins = wins,
                    Losses = losses,
                    TotalCorrectAnswers = g.Sum(x => x.NumberOfCorrectAnswers),
                    TotalTimeTakenInSeconds = g.Sum(x => x.TimeTakenInSeconds)
                };
            });

        return leaderboard
            .OrderByDescending(x => x.Wins)
            .ThenBy(x => x.Losses)
            .ThenByDescending(x => x.TotalCorrectAnswers)
            .ThenBy(x => x.Key, StringComparer.OrdinalIgnoreCase)
            .Select(x => new ArenaLeaderboardEntryDto(
                x.Key,
                x.Wins,
                x.Losses,
                x.Wins + x.Losses, // GamesPlayed
                x.TotalCorrectAnswers,
                x.TotalTimeTakenInSeconds))
            .ToList();
    }
}
