using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("sudoku_games")]
public class SudokuGame : AuditBase
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id", Order = 0)]
    public long Id { get; set; }

    [Column("game_id")]
    public long GameId { get; set; }

    [Column("puzzle_index")]
    public int PuzzleIndex { get; set; }

    [Column("initial_grid_json", TypeName = "jsonb")]
    public required string InitialGridJson { get; set; }
}
