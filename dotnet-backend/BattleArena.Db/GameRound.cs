using System.ComponentModel.DataAnnotations.Schema;

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

    [Column("game_round_status")]
    public required GameRoundStatus Status { get; set; } =  GameRoundStatus.New;

    [Column("point_multiplier")]
    public int PointMultiplier { get; set; } = 1;
}

[Table("game_round_answers")]
public class GameRoundAnswer
{
    [Column("id", Order = 1)]
    public int Id { get; set; }

    [Column("game_round_id")]
    public int GameRoundId { get; set; }
    public required GameRound Round { get; set; }

    [Column("question_id")]
    public int QuestionId { get; set; }
    public required Question Question { get; set; }

    [Column("player_id")]
    public int PlayerId { get; set; }
    public required User User { get; set; }

    [Column("standard_answer", TypeName = "varchar(1032)")]
    public string? StandardAnswer { get; set; }

    [Column("question_choice_id")]
    public int? QuestionChoiceId { get; set; }
    public required QuestionChoice QuestionChoice { get; set; }
}
