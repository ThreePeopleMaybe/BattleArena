using System.ComponentModel.DataAnnotations.Schema;
using BattleArena.Shared;

namespace BattleArena.Db;

[Table("arenas")]
public class Arena : AuditBase
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("id", Order = 0)]
    public int Id { get; set; }

    [Column("arena_name")]
    public string ArenaName { get; set; } = string.Empty;

    [Column("arena_code")]
    public string ArenaCode { get; set; } = string.Empty;

    [Column("arena_owner")]
    public int ArenaOwner { get; set; }

    [Column("status")]
    public ArenaStatus Status { get; set; } = ArenaStatus.New;
}
