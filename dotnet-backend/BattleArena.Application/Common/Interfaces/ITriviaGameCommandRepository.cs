using BattleArena.Db;
using static BattleArena.Application.Common.Dto;

namespace BattleArena.Application.Common.Interfaces;

public interface ITriviaGameCommandRepository
{
    Task InsertTriviaGameQuestionAsync(long gameId, IReadOnlyList<QuestionDto> questions, CancellationToken cancellationToken = default);
    Task InsertTriviaGameChoiceAsync(long gameId, IReadOnlyList<QuestionDto> questions, CancellationToken cancellationToken = default);
    Task InsertTriviaGameResultDetailAsync(IReadOnlyList<TriviaGameResultDetail> details, CancellationToken cancellationToken = default);
}
