using AutoMapper;
using BattleArena.Application.Common.Interfaces;
using MediatR;
using static BattleArena.Application.Common.Dto;

namespace BattleArena.Application.TriviaGames.Queries;

public sealed record GetTriviaGameQuestionsByGameIdQuery(long GameId) : IRequest<IReadOnlyList<QuestionDto>?>;

public sealed class GetTriviaGameByIdQueryHandler(ITriviaGameQueryRepository triviaGameQueryRepository, IMapper mapper)
    : IRequestHandler<GetTriviaGameQuestionsByGameIdQuery, IReadOnlyList<QuestionDto>?>
{
    public async Task<IReadOnlyList<QuestionDto>?> Handle(GetTriviaGameQuestionsByGameIdQuery request, CancellationToken cancellationToken)
    {
        var data = await triviaGameQueryRepository.GetTriviaGameQuestionsByGameIdAsync(request.GameId, cancellationToken);

        return mapper.Map<IReadOnlyList<QuestionDto>>(data);
    }
}
