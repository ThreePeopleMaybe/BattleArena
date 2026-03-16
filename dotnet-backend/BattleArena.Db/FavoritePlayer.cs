using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("favorite_players")]
public class FavoritePlayer : AuditBase
{
    [Column("id", Order = 1)]
    public int Id { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }

    [Column("game_type_id")]
    public int GameTypeId { get; set; }

    [Column("favorite_user_id")]
    public int FavoritePlayerId { get; set; }
}
