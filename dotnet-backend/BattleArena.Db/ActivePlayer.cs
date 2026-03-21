using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("active_players")]
public class ActivePlayer : AuditBase
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id", Order = 0)]
    public int Id { get; set; }

    [Column("user_id")]
    public long UserId { get; set; }

    [Column("game_type_id")]
    public int GameTypeId { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; }

    [Column("is_playing")]
    public bool IsPlaying { get; set; }

    [Column("matched_user_id")]
    public long? MatchedUserId { get; set; }
}
