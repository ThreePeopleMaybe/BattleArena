using AutoMapper;
using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.TriviaGames.Queries;

public sealed record GetActiveTriviaGameQuery(int GameTypeId) : IRequest<IReadOnlyList<ActiveTriviaGameDto>>;

public sealed class GetActiveTriviaGameQueryHandler(ITriviaGameQueryRepository triviaGameQueryRepository, IMapper mapper)
    : IRequestHandler<GetActiveTriviaGameQuery, IReadOnlyList<ActiveTriviaGameDto>>
{
    public async Task<IReadOnlyList<ActiveTriviaGameDto>> Handle(GetActiveTriviaGameQuery request, CancellationToken cancellationToken)
    {
        var list = await triviaGameQueryRepository.GetActiveGamesAsync(request.GameTypeId, cancellationToken);
        return mapper.Map<IReadOnlyList<ActiveTriviaGameDto>>(list);
    }
}

public sealed record ActiveTriviaGameDto(long GameId, long UserId, string UserName, int Wager, int TopicId, string TopicName);
