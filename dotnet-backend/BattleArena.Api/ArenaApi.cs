using BattleArena.Application.Arenas.Commands;
using BattleArena.Application.Arenas.Queries;
using MediatR;
using static BattleArena.Application.Common.Dto;
namespace BattleArena.Api;

public static class ArenaApi
{
    public static RouteGroupBuilder MapArenaApi(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/v1/arenas").WithTags("Arena");

        group.MapPost(string.Empty, CreateArena)
            .Produces<ArenaDto>(StatusCodes.Status201Created);

        group.MapPost("join", JoinArena)
            .Produces<int>(StatusCodes.Status201Created);

        group.MapGet("leaderboard/{arenaId:int}", GetArenaLeaderboard)
            .Produces<List<ArenaLeaderboardEntryDto>>();

        group.MapPatch("{arenaId:int}/wager", UpdateArenaWager)
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        group.MapGet("{arenaId:int}", GetArenaById)
            .Produces<ArenaDto>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        group.MapDelete("{arenaId:int}/player/user/{userId:int}", LeaveArena)
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        group.MapDelete("{arenaId:int}", DeleteArena)
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        group.MapGet("user/{userId:long}/gametype/{gameTypeId:int}", GetArenasByUserId)
            .Produces<IReadOnlyList<ArenaDto>>();

        return group;
    }

    static async Task<IResult> CreateArena(CreateArenaRequest request, ISender sender, CancellationToken cancellationToken)
    {
        var arena = await sender.Send(new CreateArenaCommand(request.ArenaName, request.ArenaOwner, request.Wager, request.GameTypeId), cancellationToken);
        return Results.Ok(arena);
    }

    static async Task JoinArena(JoinArenaRequest request, ISender sender, CancellationToken cancellationToken)
    {
        await sender.Send(new JoinArenaCommand(request.ArenaCode, request.UserId), cancellationToken);
    }

    static async Task DeleteArena(int arenaId, ISender sender, CancellationToken cancellationToken)
    {
        await sender.Send(new DeleteArenaCommand(arenaId), cancellationToken);
    }

    static async Task<IResult> GetArenasByUserId(long userId, int gameTypeId, ISender sender, CancellationToken cancellationToken)
    {
        var arenas = await sender.Send(new GetArenasByUserIdQuery(userId, gameTypeId), cancellationToken);
        return Results.Ok(arenas);
    }

    static async Task<IResult> GetArenaById(int arenaId, ISender sender, CancellationToken cancellationToken)
    {
        var arena = await sender.Send(new GetArenaByIdQuery(arenaId), cancellationToken);
        return arena is null ? Results.NotFound() : Results.Ok(arena);
    }

    static async Task UpdateArenaWager(int arenaId, UpdateArenaWagerRequest request, ISender sender, CancellationToken cancellationToken)
    {
        await sender.Send(new UpdateArenaWagerCommand(arenaId, request.WagerAmount), cancellationToken);
    }

    static async Task LeaveArena(int arenaId, long userId, ISender sender, CancellationToken cancellationToken)
    {
        await sender.Send(new LeaveArenaPlayerCommand(arenaId, userId), cancellationToken);
    }

    static async Task<IResult> GetArenaLeaderboard(int arenaId, ISender sender, CancellationToken cancellationToken)
    {
        var rows = await sender.Send(new GetArenaLeaderboardQuery(arenaId), cancellationToken);
        return Results.Ok(rows);
    }
}

public sealed record CreateArenaRequest(string ArenaName, long ArenaOwner, int Wager, int GameTypeId);
public sealed record JoinArenaRequest(string ArenaCode, int UserId);
public sealed record UpdateArenaWagerRequest(int WagerAmount);
