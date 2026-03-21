using System.ComponentModel.DataAnnotations.Schema;
using BattleArena.Shared;

namespace BattleArena.Db;

[Table("games")]
public class Game : AuditBase
{
    [Column("id", Order = 0)]
    public long Id { get; set; }

    [Column("game_type_id", TypeName = "int")]
    public int GameTypeId { get; set; }

    [Column("wager")]
    public int Wager { get; set; }

    [Column("game_status", TypeName = "varchar(32)")]
    public required GameStatus Status { get; set; } = GameStatus.New;

    [Column("started_at", TypeName = "time with time zone")]
    public DateTimeOffset StartedAt { get; set; }

    [Column("ended_at", TypeName = "time with time zone")]
    public DateTimeOffset? EndedAt { get; set; }

    public ICollection<GameRound> Rounds { get; set; } = new List<GameRound>();
}
