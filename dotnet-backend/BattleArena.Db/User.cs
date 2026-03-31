using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BattleArena.Db;

[Index(nameof(UserName), IsUnique = true)]
[Index(nameof(Email), IsUnique = true)]
[Table("users")]
public class User : AuditBase
{
    [Column("id", Order = 1)]
    public long Id { get; set; }

    [Column("username", TypeName = "varchar(255)")]
    public required string UserName { get; set; }

    [Column("first_name", TypeName = "varchar(255)")]
    public required string FirstName { get; set; }

    [Column("last_name", TypeName = "varchar(255)")]
    public required string LastName { get; set; }

    [Column("email", TypeName = "varchar(512)")]
    public string? Email { get; set; }

    [Column("phone_number", TypeName = "varchar(32)")]
    public string? PhoneNumber { get; set; }

    [Column("amount")]
    public int? Amount { get; set; }

    public ICollection<TeamPlayer> TeamPlayers { get; } = new List<TeamPlayer>();

    public ICollection<OrganizationHost> OrganizationHosts { get; } = new List<OrganizationHost>();
}
