using BattleArena.Application.Common.Interfaces;
using BattleArena.Application.Games.Commands;
using BattleArena.Application.Questions.Queries;
using MediatR;
using System.Transactions;

namespace BattleArena.Application.TriviaGames.Commands;

public sealed record CreateTriviaGameCommand(int GameTypeId, int Wager, int TopicCategoryId) : IRequest<CreateTriviaGameResult>;

public sealed class CreateTriviaGameCommandHandler(ITriviaGameCommandRepository triviaGameCommandRepository, ISender sender)
    : IRequestHandler<CreateTriviaGameCommand, CreateTriviaGameResult>
{
    public async Task<CreateTriviaGameResult> Handle(CreateTriviaGameCommand request, CancellationToken cancellationToken)
    {
        var questions = await sender.Send(new GetQuestionsByTopicIdQuery(new List<int>() { request.TopicCategoryId }), cancellationToken);

        using var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);

        var gameId = await sender.Send(new InsertGameCommand(request.GameTypeId, request.Wager), cancellationToken);

        var triviaGameQuestions = await triviaGameCommandRepository.InsertTriviaGameQuestionAsync(
            gameId,
            questions.Select(q => q.Id).ToList(),
            cancellationToken);

        await triviaGameCommandRepository.InsertTriviaGameChoiceAsync(
            triviaGameQuestions,
            questions,
            cancellationToken);

        transactionScope.Complete();

        return new CreateTriviaGameResult(gameId, questions);
    }
}

public sealed record CreateTriviaGameResult(long GameId, IReadOnlyList<QuestionDto> Questions);
