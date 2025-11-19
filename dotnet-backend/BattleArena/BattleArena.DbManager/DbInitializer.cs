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

        await SeedAsync(battleArenaDbContext, cancellationToken);

        logger.LogInformation("Database initialization completed after {ElapsedMilliseconds}ms",
            sw.ElapsedMilliseconds);
    }

    private async Task SeedAsync(BattleArenaDbContext battleArenaDbContext, CancellationToken cancellationToken)
    {
        logger.LogInformation("Seeding database");
    }
}
 