using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("trivia_game_result_details")]
public class TriviaGameResultDetail : AuditBase
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id", Order = 0)]
    public long Id { get; set; }

    [Column("game_id")]
    public long GameId { get; set; }

    [Column("user_id")]
    public long UserId { get; set; }

    [Column("question_id")]
    public int QuestionId { get; set; }

    [Column("choice_id")]
    public int ChoiceId { get; set; }
}
