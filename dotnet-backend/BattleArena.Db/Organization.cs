using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("organizations")]
public class Organization : AuditBase
{
    [Column("id", Order = 1)]
    public int Id { get; set; }

    [Column("name", TypeName = "varchar(512)")]
    public required string Name { get; set; }

    public required ICollection<OrganizationVenue> Venues { get; set; } = new List<OrganizationVenue>();

    public required ICollection<User> Hosts { get; set; } = new List<User>();
}
