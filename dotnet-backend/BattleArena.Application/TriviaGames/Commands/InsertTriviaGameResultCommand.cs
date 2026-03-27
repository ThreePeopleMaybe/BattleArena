using BattleArena.Application.Common;
using BattleArena.Application.Common.Interfaces;
using BattleArena.Db;
using MediatR;

namespace BattleArena.Application.TriviaGames.Commands;

public sealed record InsertTriviaGameResultCommand(
    long GameId,
    long UserId,
    int TopicId,
    int NumberOfCorrectAnswers,
    int TimeTakenInSeconds,
    IReadOnlyList<Dto.TriviaGameResultDetailDto> Details) : IRequest<long>;

public sealed class InsertTriviaGameResultCommandHandler(
    ITriviaGameCommandRepository triviaGameCommandRepository,
    ITriviaGameQueryRepository triviaGameQueryRepository,
    BattleArenaDbContext dbContext)
    : IRequestHandler<InsertTriviaGameResultCommand, long>
{
    public async Task<long> Handle(InsertTriviaGameResultCommand request, CancellationToken cancellationToken)
    {
        var triviaGameResults = await triviaGameQueryRepository.GetTriviaGameResultAsync(request.GameId, cancellationToken);
        var hasExistingResults = triviaGameResults.Count > 0;

        bool? isWinner = null;
        if (triviaGameResults.Count > 0)
        {
            var hasBetterExistingResult = triviaGameResults.Any(r =>
                r.NumberOfCorrectAnswers > request.NumberOfCorrectAnswers ||
                (r.NumberOfCorrectAnswers == request.NumberOfCorrectAnswers &&
                 r.TimeTakenInSeconds < request.TimeTakenInSeconds));

            if (!hasBetterExistingResult)
            {
                isWinner = true;
                foreach (var triviaGameResult in triviaGameResults)
                {
                    triviaGameResult.IsWinner = false;
                }
                var shareWinner = triviaGameResults.FirstOrDefault(r => r.NumberOfCorrectAnswers == request.NumberOfCorrectAnswers && r.TimeTakenInSeconds == request.TimeTakenInSeconds);
                shareWinner?.IsWinner = true;
            }
        }

        var strategy = dbContext.Database.CreateExecutionStrategy();

        return await strategy.ExecuteAsync(
            state: request,
            operation: async (_, _, ct) =>
            {
                await using var transaction = await dbContext.Database.BeginTransactionAsync(ct);

                if (hasExistingResults)
                {
                    await triviaGameCommandRepository.UpdateTriviaGameResultWinnerAsync(triviaGameResults, ct);
                }

                var id = await triviaGameCommandRepository.InsertTriviaGameResultAsync(
                    request.GameId,
                    request.UserId,
                    request.TopicId,
                    request.NumberOfCorrectAnswers,
                    request.TimeTakenInSeconds,
                    isWinner,
                    ct);

                if (request.Details.Count > 0)
                {
                    var now = DateTimeOffset.UtcNow;
                    var details = request.Details.Select(d => new TriviaGameResultDetail
                    {
                        QuestionId = d.QuestionId,
                        ChoiceId = d.ChoiceId,
                        GameId = request.GameId,
                        UserId = request.UserId,
                        UpdatedBy = "system",
                        UpdatedAt = now,
                        CreatedBy = "system",
                        CreatedAt = now,
                    }).ToList();

                    await triviaGameCommandRepository.InsertTriviaGameResultDetailAsync(details, ct);
                }

                await transaction.CommitAsync(ct);

                return id;
            },
            verifySucceeded: null,
            cancellationToken: cancellationToken);
    }
}
