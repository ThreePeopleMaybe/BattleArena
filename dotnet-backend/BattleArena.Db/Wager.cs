using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("wagers")]
public class Wager
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id", Order = 0)]
    public long Id { get; set; }

    [Column("user_id")]
    public long UserId { get; set; }

    [Column("game_type_id")]
    public int GameTypeId { get; set; }

    [Column("wager_amount")]
    public int? WagerAmount { get; set; }
}
