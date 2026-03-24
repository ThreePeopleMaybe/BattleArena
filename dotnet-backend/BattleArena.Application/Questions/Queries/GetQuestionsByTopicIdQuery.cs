using AutoMapper;
using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.Questions.Queries;

public sealed record GetQuestionsByTopicIdQuery(IReadOnlyList<int> TopicIds)
    : IRequest<IReadOnlyList<QuestionDto>>;

public sealed class GetQuestionsByTopicIdQueryHandler(IQuestionQueryRepository questionRepository, IMapper mapper)
    : IRequestHandler<GetQuestionsByTopicIdQuery, IReadOnlyList<QuestionDto>>
{
    public async Task<IReadOnlyList<QuestionDto>> Handle(GetQuestionsByTopicIdQuery request, CancellationToken cancellationToken)
    {
        if (request.TopicIds.Count == 0)
        {
            return [];
        }

        var questions = await questionRepository.GetQuestionsByTopicIdsAsync(request.TopicIds, cancellationToken);
        var questionChoices = await questionRepository.GetQuestionChoicesByTopicIdsAsync(request.TopicIds, cancellationToken);

        var selectedQuestions = questions
            .GroupBy(q => q.QuestionTopicId)
            .SelectMany(g => g.OrderBy(_ => Random.Shared.Next()).Take(10))
            .ToList();

        var choicesByQuestionId = questionChoices
            .GroupBy(qc => qc.QuestionId)
            .ToDictionary(g => g.Key, g => g.ToList());

        foreach (var question in selectedQuestions)
        {
            cancellationToken.ThrowIfCancellationRequested();

            if (!choicesByQuestionId.TryGetValue(question.Id, out var availableChoices))
            {
                question.Choices = [];
                continue;
            }

            var correctChoice = availableChoices.FirstOrDefault(qc => qc.IsCorrectChoice);
            var correctId = correctChoice?.Id ?? 0;

            var choices = availableChoices
                .Where(qc => qc.Id != correctId)
                .ToList();

            for (var i = choices.Count - 1; i > 0; i--)
            {
                var j = Random.Shared.Next(i + 1);
                (choices[i], choices[j]) = (choices[j], choices[i]);
            }

            if (choices.Count > 3)
            {
                choices.RemoveRange(3, choices.Count - 3);
            }

            if (correctChoice is not null)
            {
                choices.Add(correctChoice);
            }

            question.Choices = choices;
        }

        return mapper.Map<IReadOnlyList<QuestionDto>>(selectedQuestions);
    }
}
