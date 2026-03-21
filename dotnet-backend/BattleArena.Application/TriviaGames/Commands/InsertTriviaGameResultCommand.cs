using BattleArena.Application.Common.Interfaces;
using BattleArena.Application.Games.Commands;
using MediatR;
using System.Transactions;
using BattleArena.Db;

namespace BattleArena.Application.TriviaGames.Commands;

public sealed record InsertTriviaGameResultCommand(
    long GameId,
    long UserId,
    int NumberOfCorrectAnswers,
    int TimeTakenInSeconds,
    IReadOnlyList<TriviaGameResultDetailDto> Details) : IRequest<long>;

public sealed class InsertTriviaGameResultCommandHandler(ITriviaGameCommandRepository triviaGameCommandRepository, ISender sender)
    : IRequestHandler<InsertTriviaGameResultCommand, long>
{
    public async Task<long> Handle(InsertTriviaGameResultCommand request, CancellationToken cancellationToken)
    {
        using var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);

        // 1. Mark the base game record as finished
        await sender.Send(new FinishGameCommand(request.GameId), cancellationToken);

        // 2. Insert the high-level trivia result (score, time)
        var id = await triviaGameCommandRepository.InsertTriviaGameResultAsync(
            request.GameId,
            request.UserId,
            request.NumberOfCorrectAnswers,
            request.TimeTakenInSeconds,
            cancellationToken);

        // 3. Map and insert the granular details (individual answer choices)
        var details = request.Details.Select(d => new TriviaGameResultDetail
        {
            QuestionId = d.TriviaGameQuestionId,
            AnswerId = d.TriviaGameAnswerId,
            GameId = request.GameId,
            UserId = request.UserId,
            UpdatedBy = "system",
            UpdatedAt = DateTime.UtcNow,
            CreatedBy = "system",
            CreatedAt = DateTime.UtcNow,
        }).ToList();

        await triviaGameCommandRepository.InsertTriviaGameResultDetailAsync(details, cancellationToken);

        transactionScope.Complete();

        return id;
    }
}

public sealed record TriviaGameResultDetailDto(long TriviaGameQuestionId, long TriviaGameAnswerId);
