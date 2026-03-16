using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;
using Microsoft.EntityFrameworkCore;

namespace BattleArena.Infrastructure.Repositories.Commands;

public class UserCommandRepository(BattleArenaDbContext dbContext) : IUserCommandRepository
{
    public async Task UpsertActivePlayerAsync(long userId, int gameTypeId, bool isActive, bool isPlaying, CancellationToken cancellationToken = default)
    {
        var activePlayer = await dbContext.ActivePlayers
            .FirstOrDefaultAsync(ap => ap.UserId == userId && ap.GameTypeId == gameTypeId, cancellationToken);

        if (activePlayer is null)
        {
            dbContext.ActivePlayers.Add(new ActivePlayer
            {
                UserId = userId,
                GameTypeId = gameTypeId,
                CreatedBy = "system",
                CreatedAt = DateTime.UtcNow,
            });
        }
        else
        {
            activePlayer.IsActive = isActive;
            activePlayer.IsPlaying = isPlaying;
            activePlayer.UpdatedBy = "system";
            activePlayer.UpdatedAt = DateTime.UtcNow;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
