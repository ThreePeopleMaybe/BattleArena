using BattleArena.Application.TriviaGames.Commands;
using BattleArena.Application.TriviaGames.Queries;
using MediatR;
using static BattleArena.Application.Common.Dto;

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

        group.MapGet("active/{gameTypeId:int}/{arenaId:int}", GetActiveTriviaGame)
            .Produces<List<ActiveTriviaGameData>>();

        group.MapGet("{gameId:long}", GetTriviaGameById)
            .Produces<IReadOnlyList<QuestionDto>>()
            .Produces(StatusCodes.Status404NotFound);

        return group;
    }
    static async Task<IResult> InsertTriviaGameResult(CreateTriviaGameResultRequest request, ISender sender, CancellationToken cancellationToken)
    {
        var id = await sender.Send(
            new InsertTriviaGameResultCommand(
                request.GameId,
                request.UserId,
                request.TopicId,
                request.NumberOfCorrectAnswers,
                request.TimeTakenInSeconds,
                request.Details),
            cancellationToken);

        return Results.Created($"/api/v1/trivia-games/results/{id}", id);
    }

    static async Task<IResult> CreateTriviaGame(CreateTriviaGameRequest request, ISender sender, CancellationToken cancellationToken)
    {
        var result = await sender.Send(
            new CreateTriviaGameCommand(request.GameTypeId, request.WagerAmount, request.TopicId, request.ArenaId),
            cancellationToken);

        return Results.Created($"/api/v1/trivia-games/{result.GameId}", result);
    }

    static async Task<IResult> GetActiveTriviaGame(int gameTypeId, int arenaId, ISender sender, CancellationToken cancellationToken)
    {
        var games = await sender.Send(new GetActiveTriviaGameQuery(gameTypeId, arenaId), cancellationToken);
        return Results.Ok(games);
    }
    static async Task<IResult> GetTriviaGameById(long gameId, ISender sender, CancellationToken cancellationToken)
    {
        var triviaGame = await sender.Send(new GetTriviaGameQuestionsByGameIdQuery(gameId), cancellationToken);
        return triviaGame is null ? Results.NotFound() : Results.Ok(triviaGame);
    }
}

public sealed record CreateTriviaGameResultRequest(
    long GameId,
    long UserId,
    int TopicId,
    int NumberOfCorrectAnswers,
    int TimeTakenInSeconds,
    IReadOnlyList<TriviaGameResultDetailDto> Details);

public sealed record CreateTriviaGameRequest(int GameTypeId, int WagerAmount, int TopicId, int ArenaId);
