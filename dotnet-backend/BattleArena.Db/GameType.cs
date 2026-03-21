using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("game_types")]
public class GameType
{
    [Column("id", Order = 0)]
    public int Id { get; set; }

    [Column("game_name", TypeName = "varchar(100)")]
    public string game_name { get; set; } = string.Empty;
}
