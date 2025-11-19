using Microsoft.EntityFrameworkCore;

namespace BattleArena.Db;

public class BattleArenaDbContext(DbContextOptions<BattleArenaDbContext> options): DbContext(options)
{
    public DbSet<User> Users { get; set; }
}
