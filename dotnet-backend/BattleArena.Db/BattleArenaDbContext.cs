using Microsoft.EntityFrameworkCore;

namespace BattleArena.Db;

public class BattleArenaDbContext(DbContextOptions<BattleArenaDbContext> options): DbContext(options)
{
    public DbSet<User> Users { get; set; }

    public DbSet<Question> Questions { get; set; }

    public DbSet<Game> Games { get; set; }

    public DbSet<Organization> Organizations { get; set; }

    public DbSet<Team> Teams { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Game>().Property(e => e.Type).HasConversion(x => x.ToString(), x => Enum.Parse<GameType>(x));
        modelBuilder.Entity<Game>().Property(e => e.Status).HasConversion(x => x.ToString(), v => Enum.Parse<GameStatus>(v));

        modelBuilder.Entity<GameRound>().Property(e => e.Status).HasConversion(x => x.ToString(), v => Enum.Parse<GameRoundStatus>(v));

        modelBuilder.Entity<TeamPlayer>().Property(e => e.Role).HasConversion(x => x.ToString(), v => Enum.Parse<TeamRole>(v));

        modelBuilder.Entity<OrganizationHost>().Property(e => e.Role).HasConversion(x => x.ToString(), v => Enum.Parse<OrganizationRole>(v));

        modelBuilder.Entity<Question>().Property(e => e.Type).HasConversion(x => x.ToString(), v => Enum.Parse<QuestionType>(v));
        modelBuilder.Entity<Question>().Property(e => e.AnswerType).HasConversion(x => x.ToString(), v => Enum.Parse<QuestionAnswerType>(v));
    }
}
