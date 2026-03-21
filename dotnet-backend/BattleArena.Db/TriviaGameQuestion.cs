using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("trivia_game_questions")]
public class TriviaGameQuestion : AuditBase
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id", Order = 0)]
    public long Id { get; set; }

    [Column("game_id")]
    public long GameId { get; set; }

    [Column("question_id")]
    public long QuestionId { get; set; }
}
