using BattleArena.Db;

namespace BattleArena.Application.Common.Interfaces;

public interface ITriviaGameCommandRepository
{
    Task<Dictionary<int, int>> InsertTriviaGameQuestionAsync(long gameId, List<int> questionIds, CancellationToken cancellationToken = default);
    Task InsertTriviaGameChoiceAsync(Dictionary<int, int> triviaGameQuestions, IReadOnlyList<QuestionDto> questions, CancellationToken cancellationToken = default);
    Task<long> InsertTriviaGameResultAsync(long gameId, long userId, int numberOfCorrectAnswers, int timeTakenInSeconds, CancellationToken cancellationToken = default);
    Task InsertTriviaGameResultDetailAsync(IReadOnlyList<TriviaGameResultDetail> details, CancellationToken cancellationToken = default);
}
