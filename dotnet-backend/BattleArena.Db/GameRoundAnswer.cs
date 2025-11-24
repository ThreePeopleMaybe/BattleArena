using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

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

    [Column("team_id")]
    public int? TeamId { get; set; }
    public Team? Team { get; set; }

    [Column("standard_answer", TypeName = "varchar(1032)")]
    public string? StandardAnswer { get; set; }

    [Column("question_choice_id")]
    public int? QuestionChoiceId { get; set; }
    public required QuestionChoice QuestionChoice { get; set; }
}
