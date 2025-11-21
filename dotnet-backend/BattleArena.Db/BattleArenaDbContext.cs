using Microsoft.EntityFrameworkCore;

namespace BattleArena.Db;

public class BattleArenaDbContext(DbContextOptions<BattleArenaDbContext> options): DbContext(options)
{
    public DbSet<User> Users { get; set; }

    public DbSet<User> Questions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

    }
}
