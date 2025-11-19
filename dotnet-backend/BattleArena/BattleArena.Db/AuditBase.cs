using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

public abstract class AuditBase
{
    [Column("created_at", TypeName = "time with time zone")]
    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public DateTimeOffset CreatedAt { get; set; }
    
    [Column("created_by", TypeName = "varchar(255)")]
    public required string CreatedBy { get; set; }
    
    [Column("updated_at", TypeName = "time with time zone")]
    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public DateTimeOffset UpdatedAt { get; set; }
    
    [Column("updated_by", TypeName = "varchar(255)")]
    public required string UpdatedBy { get; set; }
}