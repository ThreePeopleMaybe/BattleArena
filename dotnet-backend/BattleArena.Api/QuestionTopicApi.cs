using static BattleArena.Application.Common.Dto;
using BattleArena.Application.QuestionTopics.Queries;
using MediatR;

namespace BattleArena.Api;

public static class QuestionTopicApi
{
    public static RouteGroupBuilder MapQuestionTopicApi(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/v1/topics").WithTags("Topics");

        group.MapGet("topics", GetTopics).Produces<List<QuestionTopicDto>>();

        return group;
    }

    static async Task<IResult> GetTopics(ISender sender, CancellationToken cancellationToken)
    {
        var topics = await sender.Send(new GetQuestionTopicsQuery(), cancellationToken);
        return Results.Ok(topics);
    }
}
