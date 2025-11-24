using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("teams")]
public class Team : AuditBase
{
    [Column("id", Order = 1)]
    public int Id { get; set; }

    [Column("name", TypeName = "varchar(255)")]
    public required string Name { get; set; }

    public ICollection<TeamPlayer> TeamPlayers { get; } = new List<TeamPlayer>();
}
