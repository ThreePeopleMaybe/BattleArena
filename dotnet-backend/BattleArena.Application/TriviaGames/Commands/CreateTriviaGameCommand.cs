using BattleArena.Application.Common.Interfaces;
using BattleArena.Application.Games.Commands;
using BattleArena.Application.Questions.Queries;
using BattleArena.Db;
using MediatR;
using static BattleArena.Application.Common.Dto;

namespace BattleArena.Application.TriviaGames.Commands;

public sealed record CreateTriviaGameCommand(int GameTypeId, int WagerAmount, int TopicId)
    : IRequest<CreateTriviaGameResult>;

public sealed class CreateTriviaGameCommandHandler(
    ITriviaGameCommandRepository triviaGameCommandRepository,
    ISender sender,
    BattleArenaDbContext dbContext)
    : IRequestHandler<CreateTriviaGameCommand, CreateTriviaGameResult>
{
    public async Task<CreateTriviaGameResult> Handle(CreateTriviaGameCommand request, CancellationToken cancellationToken)
    {
        var questions = await sender.Send(new GetQuestionsByTopicIdQuery(new List<int>() { request.TopicId }), cancellationToken);

        var strategy = dbContext.Database.CreateExecutionStrategy();

        return await strategy.ExecuteAsync(
            state: request,
            operation: async (_, _, ct) =>
            {
                await using var transaction = await dbContext.Database.BeginTransactionAsync(ct);

                var gameId = await sender.Send(new InsertGameCommand(request.GameTypeId, request.WagerAmount), ct);

                await triviaGameCommandRepository.InsertTriviaGameQuestionAsync(
                    gameId,
                    questions,
                    ct);

                await triviaGameCommandRepository.InsertTriviaGameChoiceAsync(
                    gameId,
                    questions,
                    ct);

                await transaction.CommitAsync(ct);

                return new CreateTriviaGameResult(gameId, questions);
            },
            verifySucceeded: null,
            cancellationToken: cancellationToken);
    }
}

public sealed record CreateTriviaGameResult(long GameId, IReadOnlyList<QuestionDto> Questions);
