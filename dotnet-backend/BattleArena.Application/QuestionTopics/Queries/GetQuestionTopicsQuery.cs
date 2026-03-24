using AutoMapper;
using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.QuestionTopics.Queries;

public sealed record GetQuestionTopicsQuery() : IRequest<IReadOnlyList<QuestionTopicDto>>;

public sealed class GetQuestionTopicsQueryHandler(IQuestionTopicQueryRepository questionTopicRepository, IMapper mapper)
    : IRequestHandler<GetQuestionTopicsQuery, IReadOnlyList<QuestionTopicDto>>
{
    public async Task<IReadOnlyList<QuestionTopicDto>> Handle(GetQuestionTopicsQuery request, CancellationToken cancellationToken)
    {
        var topics = await questionTopicRepository.GetQuestionTopicsAsync(cancellationToken);

        return mapper.Map<IReadOnlyList<QuestionTopicDto>>(topics);
    }
}
