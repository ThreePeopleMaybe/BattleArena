using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

public class ActivePlayer : AuditBase
{
    [Column("user_id")]
    public long UserId { get; set; }

    [Column("game_type_id")]
    public int GameTypeId { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; }

    [Column("is_playing")]
    public bool IsPlaying { get; set; }
}
