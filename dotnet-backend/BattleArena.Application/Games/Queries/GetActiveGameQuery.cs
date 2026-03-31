using AutoMapper;
using BattleArena.Application.Common.Interfaces;
using MediatR;
using static BattleArena.Application.Common.Dto;

namespace BattleArena.Application.Games.Queries;

public sealed record GetActiveGameQuery(int GameTypeId, int ArenaId) : IRequest<IReadOnlyList<ActiveGameData>>;

public sealed class GetActiveTriviaGameQueryHandler(IGameQueryRepository gameQueryRepository, IMapper mapper)
    : IRequestHandler<GetActiveGameQuery, IReadOnlyList<ActiveGameData>>
{
    public async Task<IReadOnlyList<ActiveGameData>> Handle(GetActiveGameQuery request, CancellationToken cancellationToken)
    {
        return await gameQueryRepository.GetActiveGamesAsync(request.GameTypeId, request.ArenaId, cancellationToken);
    }
}

