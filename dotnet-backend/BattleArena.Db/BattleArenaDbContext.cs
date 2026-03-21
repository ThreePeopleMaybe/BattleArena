using Microsoft.EntityFrameworkCore;
using BattleArena.Shared;

namespace BattleArena.Db;

public class BattleArenaDbContext(DbContextOptions<BattleArenaDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<Arena> Arenas { get; set; }
    public DbSet<ArenaPlayer> ArenaPlayers { get; set; }
    public DbSet<Organization> Organizations { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<ActivePlayer> ActivePlayers { get; set; }
    public DbSet<QuestionChoice> QuestionChoices { get; set; }
    public DbSet<FavoritePlayer> FavoritePlayers { get; set; }
    public DbSet<QuestionTopicCategory> QuestionTopicCategories { get; set; }
    public DbSet<WinLoss> WinsLosses { get; set; }
    public DbSet<Wager> Wagers { get; set; }
    public DbSet<TriviaGameQuestion> TriviaGameQuestions { get; set; }
    public DbSet<TriviaGameChoice> TriviaGameChoices { get; set; }
    public DbSet<TriviaGameResult> TriviaGameResults { get; set; }
    public DbSet<TriviaGameResultDetail> TriviaGameResultDetails { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ActivePlayer>()
            .HasIndex(ap => new { ap.UserId, ap.GameTypeId })
            .IsUnique();

        modelBuilder.Entity<Arena>()
            .HasIndex(a => a.ArenaCode)
            .IsUnique();

        // Enum Conversions
        modelBuilder.Entity<Arena>().Property(e => e.Status)
            .HasConversion(x => x.ToString(), v => Enum.Parse<ArenaStatus>(v));

        modelBuilder.Entity<ArenaPlayer>().Property(e => e.Status)
            .HasConversion(x => x.ToString(), v => Enum.Parse<ArenaPlayerStatus>(v));

        modelBuilder.Entity<Game>().Property(e => e.Status)
            .HasConversion(x => x.ToString(), v => Enum.Parse<GameStatus>(v));

        modelBuilder.Entity<GameRound>().Property(e => e.Status)
            .HasConversion(x => x.ToString(), v => Enum.Parse<GameRoundStatus>(v));

        modelBuilder.Entity<TeamPlayer>().Property(e => e.Role)
            .HasConversion(x => x.ToString(), v => Enum.Parse<TeamRole>(v));

        modelBuilder.Entity<OrganizationHost>().Property(e => e.Role)
            .HasConversion(x => x.ToString(), v => Enum.Parse<OrganizationRole>(v));

        modelBuilder.Entity<Question>().Property(e => e.Type)
            .HasConversion(x => x.ToString(), v => Enum.Parse<QuestionType>(v));

        modelBuilder.Entity<Question>().Property(e => e.AnswerType)
            .HasConversion(x => x.ToString(), v => Enum.Parse<QuestionAnswerType>(v));
    }
}
