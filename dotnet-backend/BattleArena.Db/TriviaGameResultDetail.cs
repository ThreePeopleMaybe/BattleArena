using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("trivia_game_result_detail")]
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
    public long QuestionId { get; set; }

    [Column("answer_id")]
    public long AnswerId { get; set; }
}
