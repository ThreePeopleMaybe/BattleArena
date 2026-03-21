using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;
using BattleArena.Shared;
using Microsoft.EntityFrameworkCore;

namespace BattleArena.Infrastructure.Repositories.Commands;

public class ArenaCommandRepository(BattleArenaDbContext dbContext) : IArenaCommandRepository
{
    public async Task<Arena> CreateArenaAsync(string arenaName, string arenaCode, int arenaOwner, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;

        var arena = new Arena
        {
            ArenaName = arenaName,
            ArenaCode = arenaCode,
            ArenaOwner = arenaOwner,
            Status = ArenaStatus.New,
            CreatedBy = "system",
            CreatedAt = now,
            UpdatedBy = "system",
            UpdatedAt = now
        };

        dbContext.Arenas.Add(arena);
        await dbContext.SaveChangesAsync(cancellationToken);

        return arena;
    }

    public Task<bool> ArenaCodeExistsAsync(string arenaCode, CancellationToken cancellationToken = default)
    {
        return dbContext.Arenas.AnyAsync(a => a.ArenaCode == arenaCode, cancellationToken);
    }

    public async Task<int> InsertArenaPlayerAsync(int arenaId, int userId, CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var arenaPlayer = new ArenaPlayer
        {
            ArenaId = arenaId,
            UserId = userId,
            Status = ArenaPlayerStatus.New,
            CreatedBy = "system",
            CreatedAt = now,
            UpdatedBy = "system",
            UpdatedAt = now
        };

        dbContext.ArenaPlayers.Add(arenaPlayer);
        await dbContext.SaveChangesAsync(cancellationToken);

        return arenaPlayer.Id;
    }

    public async Task<bool> DeleteArenaAsync(int arenaId, CancellationToken cancellationToken = default)
    {
        var arena = await dbContext.Arenas.FindAsync([arenaId], cancellationToken);
        if (arena is null)
        {
            return false;
        }

        arena.Status = ArenaStatus.Deleted;
        arena.UpdatedBy = "system";
        arena.UpdatedAt = DateTimeOffset.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> DeleteArenaPlayerAsync(int arenaPlayerId, CancellationToken cancellationToken = default)
    {
        var arenaPlayer = await dbContext.ArenaPlayers.FindAsync([arenaPlayerId], cancellationToken);
        if (arenaPlayer is null)
        {
            return false;
        }

        arenaPlayer.Status = ArenaPlayerStatus.Deleted;
        arenaPlayer.UpdatedBy = "system";
        arenaPlayer.UpdatedAt = DateTimeOffset.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
