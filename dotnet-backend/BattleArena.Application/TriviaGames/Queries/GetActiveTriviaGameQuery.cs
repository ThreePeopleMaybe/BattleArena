using AutoMapper;
using BattleArena.Application.Common.Interfaces;
using MediatR;
using static BattleArena.Application.Common.Dto;

namespace BattleArena.Application.TriviaGames.Queries;

public sealed record GetActiveTriviaGameQuery(int GameTypeId, int ArenaId) : IRequest<IReadOnlyList<ActiveTriviaGameData>>;

public sealed class GetActiveTriviaGameQueryHandler(ITriviaGameQueryRepository triviaGameQueryRepository, IMapper mapper)
    : IRequestHandler<GetActiveTriviaGameQuery, IReadOnlyList<ActiveTriviaGameData>>
{
    public async Task<IReadOnlyList<ActiveTriviaGameData>> Handle(GetActiveTriviaGameQuery request, CancellationToken cancellationToken)
    {
        var list = await triviaGameQueryRepository.GetActiveGamesAsync(request.GameTypeId, request.ArenaId, cancellationToken);
        return mapper.Map<IReadOnlyList<ActiveTriviaGameData>>(list);
    }
}

