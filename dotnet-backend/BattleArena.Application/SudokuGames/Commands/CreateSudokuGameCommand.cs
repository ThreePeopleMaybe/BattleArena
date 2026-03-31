using System.Text.Json;
using BattleArena.Application.Common.Interfaces;
using BattleArena.Application.Games.Commands;
using BattleArena.Db;
using MediatR;

namespace BattleArena.Application.SudokuGames.Commands;

public sealed record CreateSudokuGameCommand(
    int GameTypeId,
    int WagerAmount,
    long StartedBy,
    int? ArenaId,
    int PuzzleIndex,
    int[][] InitialGrid)
    : IRequest<long>;

public sealed class CreateSudokuGameCommandHandler(
    BattleArenaDbContext dbContext,
    ISender sender,
    ISudokuGameCommandRepository sudokuGameCommandRepository)
    : IRequestHandler<CreateSudokuGameCommand, long>
{
    public async Task<long> Handle(CreateSudokuGameCommand request, CancellationToken cancellationToken)
    {
        if (!IsValidSudokuInitialGrid(request.InitialGrid))
        {
            throw new ArgumentException("Initial grid must be 9x9 with values 0-9.", nameof(request));
        }

        var strategy = dbContext.Database.CreateExecutionStrategy();
        return await strategy.ExecuteAsync(
            state: request,
            operation: async (_, _, ct) =>
            {
                await using var transaction = await dbContext.Database.BeginTransactionAsync(ct);
                var gameId = await sender.Send(
                    new InsertGameCommand(
                        request.GameTypeId,
                        Math.Max(0, request.WagerAmount),
                        request.StartedBy,
                        request.ArenaId,
                        null),
                    ct);

                var json = JsonSerializer.Serialize(request.InitialGrid);
                var now = DateTimeOffset.UtcNow;
                var row = new SudokuGame
                {
                    GameId = gameId,
                    PuzzleIndex = request.PuzzleIndex,
                    InitialGridJson = json,
                    CreatedAt = now,
                    CreatedBy = "system",
                    UpdatedAt = now,
                    UpdatedBy = "system",
                };

                await sudokuGameCommandRepository.InsertSudokuGameAsync(row, ct);
                await transaction.CommitAsync(ct);
                return gameId;
            },
            verifySucceeded: null,
            cancellationToken: cancellationToken);
    }

    private static bool IsValidSudokuInitialGrid(int[][]? grid)
    {
        if (grid is null || grid.Length != 9)
        {
            return false;
        }

        for (var r = 0; r < 9; r++)
        {
            var row = grid[r];
            if (row is null || row.Length != 9)
            {
                return false;
            }

            for (var c = 0; c < 9; c++)
            {
                var v = row[c];
                if (v is < 0 or > 9)
                {
                    return false;
                }
            }
        }

        return true;
    }
}
