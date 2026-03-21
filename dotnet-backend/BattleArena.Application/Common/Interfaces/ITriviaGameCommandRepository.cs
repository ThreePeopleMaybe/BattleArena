using BattleArena.Db;

namespace BattleArena.Application.Common.Interfaces;

public interface ITriviaGameCommandRepository
{
    Task<Dictionary<long, long>> InsertTriviaGameQuestionAsync(long gameId, List<long> questionIds, CancellationToken cancellationToken = default);
    Task InsertTriviaGameChoiceAsync(Dictionary<long, long> triviaGameQuestions, IReadOnlyList<QuestionDto> questions, CancellationToken cancellationToken = default);
    Task<long> InsertTriviaGameResultAsync(long gameId, long userId, int numberOfCorrectAnswers, int timeTakenInSeconds, CancellationToken cancellationToken = default);
    Task InsertTriviaGameResultDetailAsync(IReadOnlyList<TriviaGameResultDetail> details, CancellationToken cancellationToken = default);
}
