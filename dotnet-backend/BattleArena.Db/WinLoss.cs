using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("wins_losses")]
public class WinLoss
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id", Order = 0)]
    public long Id { get; set; }

    [Column("user_id")]
    public long UserId { get; set; }

    [Column("game_type_id")]
    public int GameTypeId { get; set; }

    [Column("wins")]
    public int Wins { get; set; }

    [Column("losses")]
    public int Losses { get; set; }
}
