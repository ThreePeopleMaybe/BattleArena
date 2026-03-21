using AutoMapper;
using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.TriviaGames.Queries;

public sealed record GetTriviaGameWinnerQuery(long GameId) : IRequest<TriviaGameWinnerDto?>;
public sealed class GetTriviaGameWinnerQueryHandler(ITriviaGameQueryRepository triviaGameQueryRepository, IMapper mapper)
    : IRequestHandler<GetTriviaGameWinnerQuery, TriviaGameWinnerDto?>
{
    public async Task<TriviaGameWinnerDto?> Handle(GetTriviaGameWinnerQuery request, CancellationToken cancellationToken)
    {
        var data = await triviaGameQueryRepository.GetTriviaGameWinnerAsync(request.GameId, cancellationToken);
        return mapper.Map<TriviaGameWinnerDto?>(data);
    }
}

public sealed record TriviaGameWinnerDto(long GameId, long UserId, string UserName, int NumberOfCorrectAnswers, int TimeTakenInSeconds);
