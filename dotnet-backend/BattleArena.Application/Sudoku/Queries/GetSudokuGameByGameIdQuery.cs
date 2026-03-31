using System.Text.Json;
using BattleArena.Application.Common.Interfaces;
using MediatR;
using static BattleArena.Application.Common.Dto;

namespace BattleArena.Application.SudokuGames.Queries;

public sealed record GetSudokuGameByGameIdQuery(long GameId) : IRequest<SudokuGameDto?>;
public sealed class GetSudokuGameByGameIdQueryHandler(ISudokuGameQueryRepository sudokuGameQueryRepository)
    : IRequestHandler<GetSudokuGameByGameIdQuery, SudokuGameDto?>
{
    public async Task<SudokuGameDto?> Handle(GetSudokuGameByGameIdQuery request, CancellationToken cancellationToken)
    {
        var row = await sudokuGameQueryRepository.GetSudokuGameByGameIdAsync(request.GameId, cancellationToken);
        if (row is null)
        {
            return null;
        }

        var initial = JsonSerializer.Deserialize<int[][]>(row.InitialGridJson) ?? [];
        return new SudokuGameDto(row.GameId, row.PuzzleIndex, initial);
    }
}
