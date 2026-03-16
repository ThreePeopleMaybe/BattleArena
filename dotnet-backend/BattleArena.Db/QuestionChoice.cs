using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("question_choices")]
public class QuestionChoice
{
    [Column("id", Order = 1)]
    public int Id { get; set; }

    [Column("question_id")]
    public int QuestionId { get; set; }
    public required Question Question { get; set; }

    [Column("position")]
    public int Position { get; set; }

    [Column("choice", TypeName = "varchar(1032)")]
    public required string Choice { get; set; }

    [Column("is_correct_choice")]
    public bool IsCorrectChoice { get; set; }

    [Column("topic_category_id")]
    public int TopicCategoryId { get; set; } = 1;
}
