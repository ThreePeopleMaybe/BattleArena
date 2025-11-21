using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("games")]
public class Game : AuditBase
{
    [Column("id", Order = 1)]
    public int Id { get; set; }

    [Column("game_type")]
    public required GameType Type { get; set; } = GameType.Quiz;

    [Column("game_status")]
    public required GameStatus Status { get; set; } =  GameStatus.New;

    [Column("started_at",  TypeName = "time with time zone")]
    public DateTimeOffset StartedAt { get; set; }

    [Column("ended_at",  TypeName = "time with time zone")]
    public DateTimeOffset? EndedAt { get; set; }

    public ICollection<User> Players { get; } = new List<User>();

    public ICollection<GameRound> Rounds { get; } = new List<GameRound>();
}
