using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("question_topic_categories")]
public class QuestionTopicCategory
{
    [Column("id", Order = 1)]
    public int Id { get; set; }

    [Column("name", TypeName = "varchar(128)")]
    public required string Name { get; set; }

    [Column("description", TypeName = "varchar(512)")]
    public string? Description { get; set; }

    public  ICollection<QuestionTopic>? Topics { get; set; }
}
