using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("trivia_game_choices")]
public class TriviaGameChoice : AuditBase
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id", Order = 0)]
    public int Id { get; set; }

    [Column("trivia_game_question_id")]
    public long TriviaGameQuestionId { get; set; }

    [Column("answer_id")]
    public long AnswerId { get; set; }
}
