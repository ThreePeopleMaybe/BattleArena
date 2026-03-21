using BattleArena.Application.Users.Commands;
using BattleArena.Db;
using MediatR;

namespace BattleArena.Api;

public static class UserApi
{
    public static RouteGroupBuilder MapUserApi(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/v1/users");

        group.WithTags("User");

        group.MapGet("user/{id:long}", (long id, BattleArenaDbContext dbContext)
            => GetUser(id, dbContext))
            .Produces<UserDto>();

        group.MapPost("signup", SignUpUser)
            .Produces<UserDto>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status409Conflict);

        return group;
    }

    static async Task<IResult> GetUser(long? id, BattleArenaDbContext dbContext)
    {
        var user = await dbContext.Users.FindAsync(id);

        if (user is null) return Results.NotFound();

        return Results.Ok(new UserDto(user.Id, user.Username, user.FirstName, user.LastName, user.Email, user.PhoneNumber, user.Amount));
    }

    static async Task<IResult> SignUpUser(SignUpUserRequest request, ISender sender, CancellationToken cancellationToken)
    {
        var result = await sender.Send(new SignUpUserCommand(
            request.Username,
            request.FirstName,
            request.LastName,
            request.Email,
            request.PhoneNumber,
            request.Amount),
            cancellationToken);

        if (result is null)
        {
            return Results.Conflict("Username or email already exists.");
        }

        var dto = new UserDto(result.Id, result.Username, result.FirstName, result.LastName, result.Email, result.PhoneNumber, result.Amount);
        return Results.Created($"/api/v1/users/user/{result.Id}", dto);
    }
}

public record UserDto(long Id, string Username, string FirstName, string LastName, string? Email, string? PhoneNumber, int? Amount);
public sealed record SignUpUserRequest(string Username, string FirstName, string LastName, string? Email, string? PhoneNumber, int? Amount);
