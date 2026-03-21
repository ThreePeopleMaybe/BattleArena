using System.ComponentModel.DataAnnotations.Schema;
using BattleArena.Shared;

namespace BattleArena.Db;

[Table("organization_hosts")]
public class OrganizationHost : AuditBase
{
    [Column("id", Order = 1)]
    public int Id { get; set; }

    [Column("organization_id")]
    public int OrganizationId { get; set; }
    public required Organization Organization { get; set; }

    [Column("host_id")]
    public int HostId { get; set; }
    public required User Host { get; set; }

    [Column("role", TypeName = "varchar(32)")]
    public required OrganizationRole Role { get; set; }
}
