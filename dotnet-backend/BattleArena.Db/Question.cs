using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("questions")]
public class Question
{
    [Column("id", Order = 1)]
    public int Id { get; set; }

    [Column("question_type")]
    public required QuestionType QuestionType { get; set; } =  QuestionType.Standard;

    [Column("topic_id")]
    public int TopicId { get; set; }
    public required QuestionTopic Topic { get; set; }

    [Column("topic_id", TypeName = "varchar(1032)")]
    public required string QuestionText { get; set; }

    [Column("standard_correct_answer", TypeName = "varchar(1032)")]
    public string? StandardCorrectAnswer { get; set; }

    [Column("points")]
    public int Points { get; set; } = 1;

    public ICollection<QuestionChoice>? MultipleChoices { get; set; }
}
