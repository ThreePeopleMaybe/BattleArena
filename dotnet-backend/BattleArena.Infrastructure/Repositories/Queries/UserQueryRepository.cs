using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;
using BattleArena.Domain.Models;
using BattleArena.Extensions;
using Microsoft.EntityFrameworkCore;

namespace BattleArena.Infrastructure.Repositories.Queries;

public class UserQueryRepository(BattleArenaDbContext dbContext) : IUserQueryRepository
{
    public async Task<IReadOnlyList<Player>> GetActivePlayersByGameTypeIdAsync(int gameTypeId, CancellationToken cancellationToken = default)
    {
        var players = await (from ap in dbContext.ActivePlayers.AsNoTracking()
                             join u in dbContext.Users.AsNoTracking() on ap.UserId equals u.Id
                             where ap.GameTypeId == gameTypeId && ap.IsActive && !ap.IsPlaying
                             select new Player(
                                 u.Id,
                                 u.Username,
                                 dbContext.WinsLosses
                                    .Where(w => w.UserId == u.Id && w.GameTypeId == gameTypeId)
                                    .Select(w => (int?)w.Wins)
                                    .FirstOrDefault() ?? 0,
                                 dbContext.WinsLosses
                                    .Where(w => w.UserId == u.Id && w.GameTypeId == gameTypeId)
                                    .Select(w => (int?)w.Losses)
                                    .FirstOrDefault() ?? 0,
                                 dbContext.WinsLosses
                                    .Where(w => w.UserId == u.Id && w.GameTypeId == gameTypeId)
                                    .Select(w => (int?)w.Wins - (int?)w.Losses)
                                    .FirstOrDefault() ?? 0,
                                 dbContext.Wagers
                                    .Where(w => w.UserId == u.Id && w.GameTypeId == gameTypeId)
                                    .Select(w => (int?)w.WagerAmount)
                                    .FirstOrDefault() ?? 0))
                             .ToListAsync(cancellationToken);

        return players;
    }

    public async Task<IReadOnlyList<Player>> GetFavoritePlayersAsync(long userId, int gameTypeId, CancellationToken cancellationToken = default)
    {
        var players = await (from fp in dbContext.FavoritePlayers.AsNoTracking()
                             join u in dbContext.Users.AsNoTracking() on fp.FavoritePlayerId equals u.Id
                             where fp.UserId == userId && fp.GameTypeId == gameTypeId
                             select new Player(
                                 u.Id,
                                 u.Username,
                                 dbContext.WinsLosses
                                    .Where(w => w.UserId == u.Id && w.GameTypeId == gameTypeId)
                                    .Select(w => (int?)w.Wins)
                                    .FirstOrDefault() ?? 0,
                                 dbContext.WinsLosses
                                    .Where(w => w.UserId == u.Id && w.GameTypeId == gameTypeId)
                                    .Select(w => (int?)w.Losses)
                                    .FirstOrDefault() ?? 0,
                                 0,
                                 dbContext.Wagers
                                    .Where(w => w.UserId == u.Id && w.GameTypeId == gameTypeId)
                                    .Select(w => (int?)w.WagerAmount)
                                    .FirstOrDefault() ?? 0))
                             .ToListAsync(cancellationToken);

        return players;
    }

    public async Task<Player?> GetPlayerByUserNameAsync(string userName, int gameTypeId, CancellationToken cancellationToken = default)
    {
        var player = await dbContext.Users.AsNoTracking()
            .Where(u => u.Username.EqualsIgnoreCase(userName))
            .Select(u => new
            {
                u.Id,
                u.Username,
                Wins = dbContext.WinsLosses
                    .Where(w => w.UserId == u.Id && w.GameTypeId == gameTypeId)
                    .Select(w => (int?)w.Wins)
                    .FirstOrDefault() ?? 0,
                Losses = dbContext.WinsLosses
                    .Where(w => w.UserId == u.Id && w.GameTypeId == gameTypeId)
                    .Select(w => (int?)w.Losses)
                    .FirstOrDefault() ?? 0,
                Wager = dbContext.Wagers
                    .Where(w => w.UserId == u.Id && w.GameTypeId == gameTypeId)
                    .Select(w => (int?)w.WagerAmount)
                    .FirstOrDefault() ?? 0
            })
            .FirstOrDefaultAsync(cancellationToken);

        return player is null ? null : new Player(player.Id, player.Username, player.Wins, player.Losses, player.Wins - player.Losses, player.Wager);
    }

    public async Task<User?> GetUserByIdAsync(long id, CancellationToken cancellationToken = default)
    {
        //var winLosses = dbContext.WinsLosses.Where(w => w.UserId == id);
        return await dbContext.Users.AsNoTracking()
            .Where(u => u.Id == id)
            .Select(u => new User
            {
                Id = u.Id,
                Username = u.Username,
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                PhoneNumber = u.PhoneNumber,
                Amount = u.Amount,
                CreatedBy = u.CreatedBy,
                UpdatedAt = u.UpdatedAt,
                UpdatedBy = u.UpdatedBy,
                //Wins = winLosses.Sum(wl => wl.Wins),
                //Losses = winLosses.Sum(wl => wl.Losses)
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
