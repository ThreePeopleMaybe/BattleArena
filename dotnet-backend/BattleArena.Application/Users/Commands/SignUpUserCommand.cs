using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.Users.Commands;

public sealed record SignUpUserCommand(
    string Username,
    string FirstName,
    string LastName,
    string? Email,
    string? PhoneNumber,
    int? Amount) : IRequest<SignUpUserResult?>;

public sealed record SignUpUserResult(
    long Id,
    string Username,
    string FirstName,
    string LastName,
    string? Email,
    string? PhoneNumber,
    int? Amount);

public sealed class SignUpUserCommandHandler(IUserCommandRepository userCommandRepository)
    : IRequestHandler<SignUpUserCommand, SignUpUserResult?>
{
    public async Task<SignUpUserResult?> Handle(SignUpUserCommand request, CancellationToken cancellationToken)
    {
        var user = await userCommandRepository.SignUpUserAsync(
            request.Username,
            request.FirstName,
            request.LastName,
            request.Email,
            request.PhoneNumber,
            request.Amount,
            cancellationToken);

        return user is null
            ? throw new InvalidOperationException("Failed to sign up user. Username or email may already exist.")
            : new SignUpUserResult(
                user.Id,
                user.UserName,
                user.FirstName,
                user.LastName,
                user.Email,
                user.PhoneNumber,
                user.Amount);
    }
}
