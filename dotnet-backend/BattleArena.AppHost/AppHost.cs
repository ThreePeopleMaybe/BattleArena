using Projects;

var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
    .WithPgAdmin()
    .WithLifetime(ContainerLifetime.Persistent);

if (builder.ExecutionContext.IsRunMode)
{
    // Data volumes don't work on ACA for Postgres so only add when running
    postgres.WithDataVolume();
}

var db = postgres.AddDatabase("battlearena-db");

var dbManager = builder.AddProject<BattleArena_DbManager>("battlearena-dbmanager")
    .WithReference(db)
    .WaitFor(db)
    .WithHttpHealthCheck("/health")
    .WithHttpCommand("/reset-db", "Reset Database", commandOptions: new HttpCommandOptions { IconName = "DatabaseLightning" });

builder.AddProject<BattleArena_Api>("api")
    .WithUrlForEndpoint("https", url => url.DisplayText = "Battle Arena API (HTTPS)")
    .WithUrlForEndpoint("http", url => url.DisplayText = "Battle Arena API (HTTP)")
    .WaitFor(dbManager);

builder.Build().Run();
