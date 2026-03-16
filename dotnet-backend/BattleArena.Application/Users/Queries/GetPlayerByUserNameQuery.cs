using AutoMapper;
using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.Users.Queries;

public sealed record GetPlayerByUserNameQuery(string UserName, int GameTypeId) : IRequest<PlayerDto?>;

public sealed class GetPlayerByUserNameQueryHandler(IUserQueryRepository userRepository, IMapper mapper)
    : IRequestHandler<GetPlayerByUserNameQuery, PlayerDto?>
{
    public async Task<PlayerDto?> Handle(GetPlayerByUserNameQuery request, CancellationToken cancellationToken)
    {
        var player = await userRepository.GetPlayerByUserNameAsync(request.UserName, request.GameTypeId, cancellationToken);
        return player is null ? null : mapper.Map<PlayerDto>(player);
    }
}
