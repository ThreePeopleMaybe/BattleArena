using BattleArena.Application.Common;
using BattleArena.Application.SudokuGames.Commands;
using BattleArena.Application.SudokuGames.Queries;
using MediatR;

namespace BattleArena.Api;

public static class SudokuGameApi
{
    public static RouteGroupBuilder MapSudokuGameApi(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/v1/sudoku-games").WithTags("SudokuGame");

        group.MapPost("create", CreateSudokuGame)
            .Produces<CreateSudokuGameResponse>(StatusCodes.Status201Created)
            .ProducesValidationProblem();

        group.MapGet("{gameId:long}", GetSudokuGame)
            .Produces<Dto.SudokuGameDto>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        return group;
    }

    static async Task<IResult> GetSudokuGame(long gameId, ISender sender, CancellationToken cancellationToken)
    {
        var dto = await sender.Send(new GetSudokuGameByGameIdQuery(gameId), cancellationToken);
        return dto is null ? Results.NotFound() : Results.Ok(dto);
    }

    static async Task<IResult> CreateSudokuGame(CreateSudokuGameRequest request, ISender sender, CancellationToken cancellationToken)
    {
        var gameId = await sender.Send(
            new CreateSudokuGameCommand(
                request.GameTypeId,
                request.WagerAmount,
                request.StartedBy,
                request.ArenaId,
                request.PuzzleIndex,
                request.InitialGrid),
            cancellationToken);

        return Results.Created($"/api/v1/sudoku-games/{gameId}", new CreateSudokuGameResponse(gameId));
    }
}

public sealed record CreateSudokuGameRequest(
    int GameTypeId,
    int WagerAmount,
    long StartedBy,
    int? ArenaId,
    int PuzzleIndex,
    int[][] InitialGrid);

public sealed record CreateSudokuGameResponse(long GameId);
