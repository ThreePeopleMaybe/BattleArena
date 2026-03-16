using BattleArena.Api;
using BattleArena.Application.Common.Mapping;
using BattleArena.Application.Users.Queries;
using MediatR;
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

app.MapUserApi();
app.MapPlayerApi();
app.MapDefaultEndpoints();

app.Run();
