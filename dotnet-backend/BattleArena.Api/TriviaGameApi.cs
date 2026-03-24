using BattleArena.Application.TriviaGames.Commands;
using BattleArena.Application.TriviaGames.Queries;
using MediatR;

namespace BattleArena.Api;

public static class TriviaGameApi
{
    public static RouteGroupBuilder MapTriviaGameApi(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/v1/trivia-games").WithTags("TriviaGame");

        group.MapPost("create", CreateTriviaGame)
            .Produces<CreateTriviaGameResult>(StatusCodes.Status201Created);

        group.MapPost("results", InsertTriviaGameResult)
            .Produces<long>(StatusCodes.Status201Created);

        group.MapGet("active/{gameTypeId:int}", GetActiveTriviaGame)
            .Produces<List<ActiveTriviaGameDto>>();

        group.MapGet("winner/{gameId:long}", GetTriviaGameWinner)
            .Produces<TriviaGameWinnerDto>()
            .Produces(StatusCodes.Status404NotFound);

        return group;
    }

    static async Task<IResult> InsertTriviaGameResult(CreateTriviaGameResultRequest request, ISender sender, CancellationToken cancellationToken)
    {
        var id = await sender.Send(
            new InsertTriviaGameResultCommand(
                request.GameId,
                request.UserId,
                request.NumberOfCorrectAnswers,
                request.TimeTakenInSeconds,
                request.Details),
            cancellationToken);

        return Results.Created($"/api/v1/trivia-games/results/{id}", id);
    }

    static async Task<IResult> CreateTriviaGame(CreateTriviaGameRequest request, ISender sender, CancellationToken cancellationToken)
    {
        var result = await sender.Send(
            new CreateTriviaGameCommand(request.GameTypeId, request.Wager, request.TopicId),
            cancellationToken);

        return Results.Created($"/api/v1/trivia-games/{result.GameId}", result);
    }

    static async Task<IResult> GetActiveTriviaGame(int gameTypeId, ISender sender, CancellationToken cancellationToken)
    {
        var games = await sender.Send(new GetActiveTriviaGameQuery(gameTypeId), cancellationToken);
        return Results.Ok(games);
    }

    static async Task<IResult> GetTriviaGameWinner(long gameId, ISender sender, CancellationToken cancellationToken)
    {
        var winner = await sender.Send(new GetTriviaGameWinnerQuery(gameId), cancellationToken);
        return winner is null ? Results.NotFound() : Results.Ok(winner);
    }
}

public sealed record CreateTriviaGameResultRequest(
    long GameId,
    long UserId,
    int NumberOfCorrectAnswers,
    int TimeTakenInSeconds,
    IReadOnlyList<TriviaGameResultDetailDto> Details);

public sealed record CreateTriviaGameRequest(int GameTypeId, int Wager, int TopicId);
