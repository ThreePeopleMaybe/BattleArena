using System.Diagnostics;
using BattleArena.Db;
using Microsoft.EntityFrameworkCore;

namespace BattleArena.DbManager;

internal class DbInitializer(IServiceProvider serviceProvider, ILogger<DbInitializer> logger)
    : BackgroundService
{
    public const string ActivitySourceName = "Migrations";

    private readonly ActivitySource _activitySource = new(ActivitySourceName);

    protected override async Task ExecuteAsync(CancellationToken cancellationToken)
    {
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<BattleArenaDbContext>();

        using var activity = _activitySource.StartActivity("Initializing database", ActivityKind.Client);
        await InitializeDatabaseAsync(dbContext, cancellationToken);
    }

    public async Task InitializeDatabaseAsync(BattleArenaDbContext battleArenaDbContext,
        CancellationToken cancellationToken = default)
    {
        var sw = Stopwatch.StartNew();

        var strategy = battleArenaDbContext.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(battleArenaDbContext.Database.MigrateAsync, cancellationToken);

        await SeedGameTypesAsync(battleArenaDbContext, cancellationToken);

        logger.LogInformation("Database initialization completed after {ElapsedMilliseconds}ms",
            sw.ElapsedMilliseconds);
    }

    private async Task SeedGameTypesAsync(BattleArenaDbContext battleArenaDbContext, CancellationToken cancellationToken)
    {
        var gameTypeNames = new[] { "Trivia", "Bowling", "Archery", "BalloonPopping" };

        var existingNames = await battleArenaDbContext.Set<GameType>()
            .Select(gt => gt.game_name)
            .ToListAsync(cancellationToken);

        var existingNameSet = existingNames.ToHashSet(StringComparer.OrdinalIgnoreCase);

        var gameTypesToAdd = gameTypeNames
            .Where(name => !existingNameSet.Contains(name))
            .Select(name => new GameType { game_name = name })
            .ToList();

        if (gameTypesToAdd.Count == 0)
        {
            return;
        }

        await battleArenaDbContext.Set<GameType>().AddRangeAsync(gameTypesToAdd, cancellationToken);
        await battleArenaDbContext.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Seeded {GameTypeCount} game types", gameTypesToAdd.Count);
    }
}
