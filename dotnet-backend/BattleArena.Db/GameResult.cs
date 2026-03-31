using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("game_results")]
public class GameResult : AuditBase
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id", Order = 0)]
    public long Id { get; set; }

    [Column("game_id")]
    public long GameId { get; set; }

    [Column("user_id")]
    public long UserId { get; set; }
    [Column("number_of_correct_answers")]
    public int NumberOfCorrectAnswers { get; set; }

    [Column("time_taken_in_seconds")]
    public int TimeTakenInSeconds { get; set; }

    [Column("is_winner")]
    public bool? IsWinner { get; set; }
}
