using AutoMapper;
using BattleArena.Application.Common.Interfaces;
using MediatR;

namespace BattleArena.Application.Questions.Queries;

public sealed record GetQuestionsByTopicCategoryIdQuery(IReadOnlyList<int> TopicCategoryIds)
    : IRequest<IReadOnlyList<QuestionDto>>;

public sealed class GetQuestionsByTopicCategoryIdQueryHandler(IQuestionQueryRepository questionRepository, IMapper mapper)
    : IRequestHandler<GetQuestionsByTopicCategoryIdQuery, IReadOnlyList<QuestionDto>>
{
    public async Task<IReadOnlyList<QuestionDto>> Handle(GetQuestionsByTopicCategoryIdQuery request, CancellationToken cancellationToken)
    {
        var tGetQuestions = questionRepository.GetQuestionsByTopicCategoryIdsAsync(request.TopicCategoryIds, cancellationToken);
        var tGetQuestionChoices = questionRepository.GetQuestionChoicesByTopicCategoryIdsAsync(request.TopicCategoryIds, cancellationToken);

        await Task.WhenAll(tGetQuestions, tGetQuestionChoices);

        var questions = tGetQuestions.Result;
        var selectedQuestions = questions
            .GroupBy(q => q.TopicCategoryId)
            .SelectMany(g => g.OrderBy(_ => Random.Shared.Next()).Take(10))
            .ToList();

        var questionChoices = tGetQuestionChoices.Result;
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

            var correctChoice = availableChoices.FirstOrDefault(qc => qc.Id == question.CorrectChoiceId);
            var choices = availableChoices
                .Where(qc => qc.Id != question.CorrectChoiceId)
                .ToList();

            // Shuffle incorrect choices using Fisher-Yates
            for (var i = choices.Count - 1; i > 0; i--)
            {
                var j = Random.Shared.Next(i + 1);
                (choices[i], choices[j]) = (choices[j], choices[i]);
            }

            // Limit to 3 incorrect choices
            if (choices.Count > 3)
            {
                choices.RemoveRange(3, choices.Count - 3);
            }

            // Add the correct choice back in
            if (correctChoice is not null)
            {
                choices.Add(correctChoice);
            }

            question.Choices = choices;
        }

        return mapper.Map<IReadOnlyList<QuestionDto>>(selectedQuestions);
    }
}
