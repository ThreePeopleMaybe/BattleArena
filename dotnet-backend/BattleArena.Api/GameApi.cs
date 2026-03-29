using BattleArena.Application.Games.Commands;
using BattleArena.Application.TriviaGames.Commands;
using MediatR;
using static BattleArena.Application.Common.Dto;

namespace BattleArena.Api;

public static class GameApi
{
    public static RouteGroupBuilder MapGameApi(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/v1/games").WithTags("Game");

        group.MapPost("games", InsertGame)
            .Produces<long>(StatusCodes.Status201Created);

        group.MapPost("results", InsertGameResult)
            .Produces<long>(StatusCodes.Status201Created);

        group.MapPut("games/{gameId:long}/finish", FinishGame)
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        return group;
    }

    static async Task<IResult> InsertGame(CreateGameRequest request, ISender sender, CancellationToken cancellationToken)
    {
        var id = await sender.Send(new InsertGameCommand(request.GameTypeId, request.Wager, request.StartedBy, request.ArenaId, request.TopicId), cancellationToken);
        return Results.Created($"/api/v1/games/games/{id}", id);
    }

    static async Task<IResult> InsertGameResult(CreateGameResultRequest request, ISender sender, CancellationToken cancellationToken)
    {
        var id = await sender.Send(
            new InsertGameResultCommand(
                request.GameId,
                request.UserId,
                request.NumberOfCorrectAnswers,
                request.TimeTakenInSeconds,
                request.Details),
            cancellationToken);

        return Results.Created($"/api/v1/games/results/{id}", id);
    }

    static async Task<IResult> FinishGame(long gameId, ISender sender, CancellationToken cancellationToken)
    {
        var updated = await sender.Send(new FinishGameCommand(gameId), cancellationToken);

        return updated ? Results.NoContent() : Results.NotFound();
    }
}

public sealed record CreateGameRequest(int GameTypeId, int Wager, long StartedBy, int TopicId, int? ArenaId);
public sealed record CreateGameResultRequest(
    long GameId,
    long UserId,
    int NumberOfCorrectAnswers,
    int TimeTakenInSeconds,
    IReadOnlyList<TriviaGameResultDetailDto> Details);
