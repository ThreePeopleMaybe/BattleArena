using BattleArena.Application.Common.Interfaces;
using BattleArena.Application.Users.Commands;
using BattleArena.Application.Users.Queries;
using MediatR;

namespace BattleArena.Api;

public static class PlayerApi
{
    public static RouteGroupBuilder MapPlayerApi(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/v1/players").WithTags("Player");

        group.MapPost("active", UpsertActivePlayer).Produces(StatusCodes.Status204NoContent);
        group.MapGet("active/{gameTypeId:int}/{userId:long}", MatchActivePlayersByGameTypeId).Produces<PlayerDto?>();
        group.MapGet("favorites/{userId:int}", GetFavoritePlayers).Produces<List<PlayerDto>>();
        group.MapGet("player/{userName}", GetPlayer).Produces<PlayerDto>().Produces(StatusCodes.Status404NotFound);

        return group;
    }

    static async Task<IResult> MatchActivePlayersByGameTypeId(int gameTypeId, long userId, ISender sender, CancellationToken cancellationToken)
    {
        var matchedPlayer = await sender.Send(new MatchActivePlayersQuery(gameTypeId, userId), cancellationToken);
        return Results.Ok(matchedPlayer);
    }

    static async Task<IResult> UpsertActivePlayer(UpsertActivePlayerCommand request, ISender sender, CancellationToken cancellationToken)
    {
        await sender.Send(new UpsertActivePlayerCommand(request.UserId, request.GameTypeId, request.IsActive, request.IsPlaying), cancellationToken);
        return Results.NoContent();
    }

    static async Task<IResult> GetFavoritePlayers(int userId, int gameTypeId, ISender sender, CancellationToken cancellationToken)
    {
        var list = await sender.Send(new GetFavoritePlayersQuery(userId, gameTypeId), cancellationToken);
        return Results.Ok(list);
    }

    static async Task<IResult> GetPlayer(string userName, int gameTypeId, ISender sender, CancellationToken cancellationToken)
    {
        var player = await sender.Send(new GetPlayerByUserNameQuery(userName, gameTypeId), cancellationToken);
        return player is null ? Results.NotFound() : Results.Ok(player);
    }
}
