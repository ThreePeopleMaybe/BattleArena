using AutoMapper;
using BattleArena.Application.Common.Interfaces;
using MediatR;
using static BattleArena.Application.Common.Dto;

namespace BattleArena.Application.Arenas.Queries;

public sealed record GetArenaByIdQuery(int ArenaId) : IRequest<ArenaDto?>;

public sealed class GetArenaByIdQueryHandler(IArenaQueryRepository arenaQueryRepository, IMapper mapper)
    : IRequestHandler<GetArenaByIdQuery, ArenaDto?>
{
    public async Task<ArenaDto?> Handle(GetArenaByIdQuery request, CancellationToken cancellationToken)
    {
        var arena = await arenaQueryRepository.GetArenaByIdAsync(request.ArenaId, cancellationToken);
        if (arena is null)
            return null;

        var dto = mapper.Map<ArenaDto>(arena);
        var members = await arenaQueryRepository.GetArenaPlayersAsync(request.ArenaId, cancellationToken);
        return dto with { Members = members };
    }
}
