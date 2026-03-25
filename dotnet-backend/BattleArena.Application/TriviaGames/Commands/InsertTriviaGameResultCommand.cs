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
    IReadOnlyList<TriviaGameResultDetailDto> Details) : IRequest<long>;

public sealed class InsertTriviaGameResultCommandHandler(
    ITriviaGameCommandRepository triviaGameCommandRepository,
    ISender sender,
    BattleArenaDbContext dbContext)
    : IRequestHandler<InsertTriviaGameResultCommand, long>
{
    public async Task<long> Handle(InsertTriviaGameResultCommand request, CancellationToken cancellationToken)
    {
        var strategy = dbContext.Database.CreateExecutionStrategy();

        return await strategy.ExecuteAsync(
            state: request,
            operation: async (_, _, ct) =>
            {
                await using var transaction = await dbContext.Database.BeginTransactionAsync(ct);

                var id = await triviaGameCommandRepository.InsertTriviaGameResultAsync(
                    request.GameId,
                    request.UserId,
                    request.TopicId,
                    request.NumberOfCorrectAnswers,
                    request.TimeTakenInSeconds,
                    cancellationToken);

                var details = request.Details.Select(d => new TriviaGameResultDetail
                {
                    QuestionId = d.QuestionId,
                    ChoiceId = d.ChoiceId,
                    GameId = request.GameId,
                    UserId = request.UserId,
                    UpdatedBy = "system",
                    UpdatedAt = DateTime.UtcNow,
                    CreatedBy = "system",
                    CreatedAt = DateTime.UtcNow,
                }).ToList();

                await triviaGameCommandRepository.InsertTriviaGameResultDetailAsync(details, cancellationToken);

                await transaction.CommitAsync(ct);

                return id;
            },
            verifySucceeded: null,
            cancellationToken: cancellationToken);
    }
}

public sealed record TriviaGameResultDetailDto(int QuestionId, int ChoiceId);
