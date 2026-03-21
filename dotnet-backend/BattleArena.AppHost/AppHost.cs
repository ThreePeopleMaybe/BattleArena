Environment.SetEnvironmentVariable("ASPIRE_CONTAINER_RUNTIME", "podman");

Environment.SetEnvironmentVariable("NO_PROXY", "localhost,127.0.0.1,::1");
Environment.SetEnvironmentVariable("HTTP_PROXY", "http://gmdvproxy.acml.com:8080");
Environment.SetEnvironmentVariable("HTTPS_PROXY", "http://gmdvproxy.acml.com:8080");

var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
    .WithPgAdmin()
    .WithLifetime(ContainerLifetime.Session);

if (builder.ExecutionContext.IsRunMode)
{
    // Data volumes don't work on ACA for Postgres so only add when running
    postgres.WithDataVolume();
};

var db = postgres.AddDatabase("battlearena");

var dbManager = builder.AddProject<Projects.BattleArena_DbManager>("battlearenamanager")
    .WithReference(db)
    .WaitFor(db)
    .WithHttpHealthCheck("/health");

builder.AddProject<Projects.BattleArena_Api>("battlearena-api")
    .WithReference(db)
    .WithReference(dbManager)
    .WaitFor(dbManager)
    .WithExternalHttpEndpoints()
    //.WithUrlForEndpoint("https", url => url.DisplayText = "Battle Arena API (HTTPS)")
    //.WithUrlForEndpoint("http", url => url.DisplayText = "Battle Arena API (HTTP)")
    .WithHttpHealthCheck("/health");

builder.Build().Run();
