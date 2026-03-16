using AutoMapper;
using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.Users.Queries;

public sealed record GetUserByIdQuery(int Id) : IRequest<UserDto?>;

public sealed class GetUserByIdQueryHandler(IUserQueryRepository userRepository, IMapper mapper)
    : IRequestHandler<GetUserByIdQuery, UserDto?>
{
    public async Task<UserDto?> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetUserByIdAsync(request.Id, cancellationToken);
        return user is null ? null : mapper.Map<UserDto>(user);
    }
}
