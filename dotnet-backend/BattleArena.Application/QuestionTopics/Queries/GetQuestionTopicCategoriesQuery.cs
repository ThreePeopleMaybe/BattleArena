using AutoMapper;
using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.QuestionTopics.Queries;

public sealed record GetQuestionTopicCategoriesQuery : IRequest<IReadOnlyList<QuestionTopicCategoryDto>>;

public sealed class GetQuestionTopicCategoriesQueryHandler(IQuestionTopicQueryRepository questionTopicRepository, IMapper mapper)
    : IRequestHandler<GetQuestionTopicCategoriesQuery, IReadOnlyList<QuestionTopicCategoryDto>>
{
    public async Task<IReadOnlyList<QuestionTopicCategoryDto>> Handle(GetQuestionTopicCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await questionTopicRepository.GetQuestionTopicCategoriesAsync(cancellationToken);

        return mapper.Map<IReadOnlyList<QuestionTopicCategoryDto>>(categories);
    }
}
