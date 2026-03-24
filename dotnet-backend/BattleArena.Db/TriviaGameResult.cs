using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("trivia_game_result")]
public class TriviaGameResult : AuditBase
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id", Order = 0)]
    public long Id { get; set; }

    [Column("game_id")]
    public long GameId { get; set; }

    [Column("user_id")]
    public long UserId { get; set; }
    [Column("question_topic_id")]
    public int QuestionTopicId { get; set; }
    [Column("number_of_correct_answers")]
    public int NumerOfCorrectAnswers { get; set; }

    [Column("time_taken_in_seconds")]
    public int TimeTakenInSeconds { get; set; }
}
