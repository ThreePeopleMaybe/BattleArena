using BattleArena.Application.Common.Interfaces;
using BattleArena.Application.Questions.Queries;
using MediatR;

namespace BattleArena.Api;

public static class QuestionApi
{
    public static RouteGroupBuilder MapQuestionApi(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/v1/questions").WithTags("Questions");

        group.MapGet("topic-categories", GetQuestionsByTopicCategoryIds)
            .Produces<List<QuestionDto>>();

        return group;
    }

    static async Task<IResult> GetQuestionsByTopicCategoryIds(int[] topicCategoryIds, ISender sender, CancellationToken cancellationToken)
    {
        var questions = await sender.Send(new GetQuestionsByTopicCategoryIdQuery(topicCategoryIds), cancellationToken);
        return Results.Ok(questions);
    }
}
