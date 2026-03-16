using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

public abstract class AuditBase
{
    [Column("created_at", TypeName = "time with time zone", Order = 10000)]
    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public DateTimeOffset CreatedAt { get; set; }

    [Column("created_by", TypeName = "varchar(255)", Order = 10001)]
    public required string CreatedBy { get; set; }

    [Column("updated_at", TypeName = "time with time zone", Order = 10002)]
    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public DateTimeOffset UpdatedAt { get; set; }

    [Column("updated_by", TypeName = "varchar(255)", Order = 10003)]
    public string UpdatedBy { get; set; }
}
