using BattleArena.Application.Arenas.Commands;
using BattleArena.Application.Common.Interfaces;
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

        group.MapPost("players", InsertArenaPlayer)
            .Produces<int>(StatusCodes.Status201Created);

        group.MapDelete("{arenaId:int}", DeleteArena)
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        group.MapDelete("players/{arenaPlayerId:int}", DeleteArenaPlayer)
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        return group;
    }

    static async Task<IResult> CreateArena(CreateArenaRequest request, ISender sender, CancellationToken cancellationToken)
    {
        var arena = await sender.Send(new CreateArenaCommand(request.ArenaName, request.ArenaOwner), cancellationToken);
        return Results.Created($"/api/v1/arenas/{arena.Id}", arena);
    }

    static async Task<IResult> InsertArenaPlayer(InsertArenaPlayerRequest request, ISender sender, CancellationToken cancellationToken)
    {
        var arenaPlayerId = await sender.Send(new InsertArenaPlayerCommand(request.ArenaId, request.UserId), cancellationToken);
        return Results.Created($"/api/v1/arenas/players/{arenaPlayerId}", arenaPlayerId);
    }

    static async Task<IResult> DeleteArena(int arenaId, ISender sender, CancellationToken cancellationToken)
    {
        var updated = await sender.Send(new DeleteArenaCommand(arenaId), cancellationToken);
        return updated ? Results.NoContent() : Results.NotFound();
    }

    static async Task<IResult> DeleteArenaPlayer(int arenaPlayerId, ISender sender, CancellationToken cancellationToken)
    {
        var updated = await sender.Send(new DeleteArenaPlayerCommand(arenaPlayerId), cancellationToken);
        return updated ? Results.NoContent() : Results.NotFound();
    }
}

public sealed record CreateArenaRequest(string ArenaName, int ArenaOwner);
public sealed record InsertArenaPlayerRequest(int ArenaId, int UserId);
