using System.ComponentModel.DataAnnotations.Schema;
using BattleArena.Shared;

namespace BattleArena.Db;

[Table("arena_players")]
public class ArenaPlayer : AuditBase
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id", Order = 0)]
    public int Id { get; set; }

    [Column("arena_id")]
    public int ArenaId { get; set; }

    [Column("user_id")]
    public long UserId { get; set; }

    [Column("status")]
    public ArenaPlayerStatus Status { get; set; } = ArenaPlayerStatus.New;
}
