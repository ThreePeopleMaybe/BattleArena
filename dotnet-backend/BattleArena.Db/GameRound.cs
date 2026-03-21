using System.ComponentModel.DataAnnotations.Schema;
using BattleArena.Shared;

namespace BattleArena.Db;

[Table("game_rounds")]
public class GameRound
{
    [Column("id", Order = 1)]
    public int Id { get; set; }

    [Column("number")]
    public int Number { get; set; }

    [Column("game_id")]
    public int GameId { get; set; }
    public required Game Game { get; set; }

    [Column("question_topic_id")]
    public int QuestionTopicId { get; set; }
    public required QuestionTopic Topic { get; set; }

    [Column("game_round_status", TypeName =  "varchar(32)")]
    public required GameRoundStatus Status { get; set; } =  GameRoundStatus.New;

    [Column("point_multiplier")]
    public int PointMultiplier { get; set; } = 1;

    [Column("started_at",  TypeName = "time with time zone")]
    public DateTimeOffset StartedAt { get; set; }

    [Column("ended_at",  TypeName = "time with time zone")]
    public DateTimeOffset? EndedAt { get; set; }
}
