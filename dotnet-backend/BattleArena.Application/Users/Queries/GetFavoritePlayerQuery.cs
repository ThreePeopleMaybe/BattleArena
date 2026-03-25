using AutoMapper;
using BattleArena.Application.Common.Interfaces;
using MediatR;
using static BattleArena.Application.Common.Dto;
namespace BattleArena.Application.Users.Queries;

public sealed record GetFavoritePlayersQuery(int UserId, int GameTypeId) : IRequest<IReadOnlyList<PlayerDto>>;

public sealed class GetFavoritePlayersQueryHandler(IUserQueryRepository userRepository, IMapper mapper)
    : IRequestHandler<GetFavoritePlayersQuery, IReadOnlyList<PlayerDto>>
{
    public async Task<IReadOnlyList<PlayerDto>> Handle(GetFavoritePlayersQuery request, CancellationToken cancellationToken)
    {
        var players = await userRepository.GetFavoritePlayersAsync(request.UserId, request.GameTypeId, cancellationToken);
        return mapper.Map<IReadOnlyList<PlayerDto>>(players);
    }
}
