using BattleArena.Application.Common.Interfaces;
using BattleArena.Application.QuestionTopics.Queries;
using MediatR;

namespace BattleArena.Api;

public static class QuestionTopicApi
{
    public static RouteGroupBuilder MapQuestionTopicApi(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/v1/question-topics").WithTags("Question Topics");

        group.MapGet("categories", GetCategories).Produces<List<QuestionTopicCategoryDto>>();

        return group;
    }

    static async Task<IResult> GetCategories(ISender sender, CancellationToken cancellationToken)
    {
        var categories = await sender.Send(new GetQuestionTopicCategoriesQuery(), cancellationToken);
        return Results.Ok(categories);
    }
}
