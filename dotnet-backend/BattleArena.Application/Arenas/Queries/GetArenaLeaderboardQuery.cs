using BattleArena.Application.Common;
using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.Arenas.Queries;

public sealed record GetArenaLeaderboardQuery(int ArenaId)
    : IRequest<IReadOnlyList<Dto.ArenaLeaderboardEntryDto>>;

public sealed class GetArenaLeaderboardQueryHandler(IArenaQueryRepository arenaQueryRepository)
    : IRequestHandler<GetArenaLeaderboardQuery, IReadOnlyList<Dto.ArenaLeaderboardEntryDto>>
{
    public Task<IReadOnlyList<Dto.ArenaLeaderboardEntryDto>> Handle(
        GetArenaLeaderboardQuery request,
        CancellationToken cancellationToken) =>
        arenaQueryRepository.GetArenaLeaderboardAsync(
            request.ArenaId,
            cancellationToken);
}

