using BattleArena.Db;

namespace BattleArena.Api;

public static class UserApi
{
    public static RouteGroupBuilder MapUserApi(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/v1/users");

        group.WithTags("User");

        group.MapGet("items/type/all", (BattleArenaDbContext dbContext)
                => GetUser(null, dbContext))
            .Produces(StatusCodes.Status400BadRequest)
            .Produces<User>();

        static async Task<IResult> GetUser(int? id, BattleArenaDbContext dbContext)
        {
            var user = await dbContext.Users.FindAsync(id);

            if (user is null) return Results.NotFound();

            return Results.Ok(new User(user.Id, user.Username, user.FirstName, user.LastName, user.Email, user.PhoneNumber));
        }

        return group;
    }

    public record User(int Id, string Username, string FirstName, string LastName, string? Email, string? PhoneNumber);
}
