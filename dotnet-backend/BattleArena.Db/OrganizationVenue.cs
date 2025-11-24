using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BattleArena.Db;

[Index(nameof(Code), IsUnique = true)]
[Table("organization_venues")]
public class OrganizationVenue : AuditBase
{
    [Column("id", Order = 1)]
    public int Id { get; set; }

    [Column("name", TypeName =  "varchar(512)")]
    public required string Name { get; set; }

    [Column("code", TypeName = "varchar(8)")]
    public required string Code { get; set; }

    [Column("organization_id")]
    public int OrganizationId { get; set; }
    public required Organization Organization { get; set; }

    public ICollection<OrganizationVenueEvent>? Events { get; set; }
}
