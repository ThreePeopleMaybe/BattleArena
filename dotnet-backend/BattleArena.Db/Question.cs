using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("questions")]
public class Question
{
    [Column("id", Order = 1)]
    public int Id { get; set; }

    [Column("question_type", TypeName =  "varchar(32)")]
    public required QuestionType Type { get; set; } =  QuestionType.Text;

    [Column("question_answer_type", TypeName =  "varchar(32)")]
    public required QuestionAnswerType AnswerType { get; set; } =  QuestionAnswerType.Text;

    [Column("question_topic_id")]
    public int TopicId { get; set; }
    public required QuestionTopic Topic { get; set; }

    [Column("text", TypeName = "varchar(1032)")]
    public required string Text { get; set; }

    [Column("image_url", TypeName = "varchar(1032)")]
    public required string ImageUrl { get; set; }

    [Column("audio_url", TypeName = "varchar(1032)")]
    public required string AudioUrl { get; set; }

    [Column("video_url", TypeName = "varchar(1032)")]
    public required string VideoUrl { get; set; }

    [Column("correct_answer_text", TypeName = "varchar(1032)")]
    public string? CorrectAnswerText { get; set; }

    [Column("points")]
    public int Points { get; set; } = 1;

    [Column("topic_category_id")]
    public int TopicCategoryId { get; set; }

    [Column("correct_choice_id")]
    public int CorrectChoiceId { get; set; }
    public ICollection<QuestionChoice>? Choices { get; set; }
}
