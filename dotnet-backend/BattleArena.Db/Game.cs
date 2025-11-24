using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("games")]
public class Game : AuditBase
{
    [Column("id", Order = 0)]
    public int Id { get; set; }

    [Column("game_type", TypeName =  "varchar(32)")]
    public required GameType Type { get; set; } = GameType.TeamQuiz;

    [Column("game_status", TypeName =  "varchar(32)")]
    public required GameStatus Status { get; set; } =  GameStatus.New;

    [Column("started_at",  TypeName = "time with time zone")]
    public DateTimeOffset StartedAt { get; set; }

    [Column("ended_at",  TypeName = "time with time zone")]
    public DateTimeOffset? EndedAt { get; set; }

    public ICollection<GameRound> Rounds { get; } = new List<GameRound>();
}
