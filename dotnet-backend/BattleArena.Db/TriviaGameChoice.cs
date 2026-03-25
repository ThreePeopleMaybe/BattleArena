using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("trivia_game_choices")]
public class TriviaGameChoice : AuditBase
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id", Order = 0)]
    public int Id { get; set; }

    [Column("game_id")]
    public long GameId { get; set; }

    [Column("question_id")]
    public int QuestionId { get; set; }

    [Column("choice_id")]
    public int ChoiceId { get; set; }
}
