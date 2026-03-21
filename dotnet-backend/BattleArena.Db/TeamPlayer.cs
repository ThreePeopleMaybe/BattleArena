using System.ComponentModel.DataAnnotations.Schema;
using BattleArena.Shared;

namespace BattleArena.Db;

[Table("team_players")]
public class TeamPlayer : AuditBase
{
    [Column("id", Order = 1)]
    public int Id { get; set; }

    [Column("team_id")]
    public int TeamId { get; set; }
    public required Team Team { get; set; }

    [Column("player_id")]
    public int PlayerId { get; set; }
    public required User Player { get; set; }

    [Column("role", TypeName = "varchar(32)")]
    public required TeamRole Role { get; set; }
}
