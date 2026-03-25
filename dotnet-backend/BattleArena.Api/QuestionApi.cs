using BattleArena.Application.Questions.Queries;
using MediatR;
using static BattleArena.Application.Common.Dto;
namespace BattleArena.Api;

public static class QuestionApi
{
    public static RouteGroupBuilder MapQuestionApi(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/v1/questions").WithTags("Questions");

        group.MapGet("topics", GetQuestionsByTopicIds)
            .Produces<List<QuestionDto>>();

        return group;
    }

    static async Task<IResult> GetQuestionsByTopicIds(int[] topicIds, ISender sender, CancellationToken cancellationToken)
    {
        var questions = await sender.Send(new GetQuestionsByTopicIdQuery(topicIds), cancellationToken);
        return Results.Ok(questions);
    }
}
