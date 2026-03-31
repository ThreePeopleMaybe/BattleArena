using System.Text.Json;
using BattleArena.Api;
using BattleArena.Api.Realtime;
using BattleArena.Application.Common.Interfaces;
using BattleArena.Application.Users.Queries;
using BattleArena.Db;
using BattleArena.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();
builder.AddNpgsqlDbContext<BattleArenaDbContext>("battlearena");
builder.Services.AddInfrastructure();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<GetUserByIdQuery>());

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddProblemDetails();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .SetIsOriginAllowed(_ => true)
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddSignalR().AddJsonProtocol(options =>
{
    options.PayloadSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});
builder.Services.AddSingleton<IRealtimeNotifier, RealtimeNotifier>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler();
}

app.UseCors();
app.MapHub<Hub>(Hub.HubPath);
app.MapUserApi();
app.MapPlayerApi();
app.MapTriviaGameApi();
app.MapArenaApi();
app.MapSudokuGameApi();
app.MapGameApi();
app.MapQuestionApi();
app.MapQuestionTopicApi();
app.MapDefaultEndpoints();

app.Run();
