using AutoMapper;
using BattleArena.Application.Common.Interfaces;
using MediatR;
using static BattleArena.Application.Common.Dto;

namespace BattleArena.Application.Arenas.Queries;

public sealed record GetArenasByUserIdQuery(int UserId) : IRequest<IReadOnlyList<ArenaDto>>;

public sealed class GetArenasByUserIdQueryHandler(IArenaQueryRepository arenaQueryRepository, IMapper mapper)
    : IRequestHandler<GetArenasByUserIdQuery, IReadOnlyList<ArenaDto>>
{
    public async Task<IReadOnlyList<ArenaDto>> Handle(GetArenasByUserIdQuery request, CancellationToken cancellationToken)
    {
        var arenas = await arenaQueryRepository.GetArenasByUserIdAsync(request.UserId, cancellationToken);
        return mapper.Map<IReadOnlyList<ArenaDto>>(arenas);
    }
}
