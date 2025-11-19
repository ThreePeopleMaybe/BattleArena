using BattleArena.Db;
using BattleArena.DbManager;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.AddNpgsqlDbContext<BattleArenaDbContext>("battleground-arena", null,
    optionsBuilder => optionsBuilder.UseNpgsql(npgsqlBuilder =>
        npgsqlBuilder.MigrationsAssembly(typeof(Program).Assembly.GetName().Name)));

builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing.AddSource(DbInitializer.ActivitySourceName));

builder.Services.AddSingleton<DbInitializer>();
builder.Services.AddHostedService(sp => sp.GetRequiredService<DbInitializer>());
builder.Services.AddHealthChecks().AddCheck<DbInitializerHealthCheck>("DbInitializer", null);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapPost("/reset-db", async (BattleArenaDbContext battlegroundArenaDbContext, DbInitializer dbInitializer, CancellationToken cancellationToken) =>
    {
        await battlegroundArenaDbContext.Database.EnsureDeletedAsync(cancellationToken);
        await dbInitializer.InitializeDatabaseAsync(battlegroundArenaDbContext, cancellationToken);
    });
}

app.MapDefaultEndpoints();

await app.RunAsync();