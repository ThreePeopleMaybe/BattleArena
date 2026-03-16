using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

public class WinLoss
{
    [Column("user_id")]
    public long UserId { get; set; }

    [Column("game_type_id")]
    public int GameTypeId { get; set; }

    [Column("wins")]
    public int Wins { get; set; }

    [Column("losses")]
    public int Losses { get; set; }
}
