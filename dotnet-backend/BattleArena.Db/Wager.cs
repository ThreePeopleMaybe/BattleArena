using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

public class Wager
{
    [Column("user_id")]
    public long UserId { get; set; }

    [Column("game_type_id")]
    public int GameTypeId { get; set; }

    [Column("wager_amount")]
    public int? WagerAmount { get; set; }
}
