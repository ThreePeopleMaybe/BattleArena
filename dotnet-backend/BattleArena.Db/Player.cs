using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BattleArena.Db;

public class GameType
{
    public int Id { get; set; }
    public required string Type { get; set; }
}

[Index(nameof(Username), IsUnique = true)]
[Index(nameof(Email), IsUnique = true)]
[Table("users")]
public class User : AuditBase
{
    [Column("id")]
    public int Id { get; set; }
    
    [Column("username", TypeName = "varchar(255)")]
    public required string Username { get; set; }
    
    [Column("first_name", TypeName = "varchar(255)")]
    public required string FirstName { get; set; }
    
    [Column("last_name", TypeName = "varchar(255)")]
    public required string LastName { get; set; }
    
    [Column("email", TypeName = "varchar(512)")]
    public string? Email { get; set; }
    
    [Column("phone_number", TypeName = "varchar(32)")]
    public string? PhoneNumber { get; set; }
}

[Table("players")]
public class Player : User
{
    public required List<Game> Games { get; set; }

    public required List<Team> Teams { get; set; }
}

[Table("hosts")]
public class Host : User
{
    public List<Venue>? Venues { get; set; }
}

[Table("games")]
public class Game : AuditBase
{
    public int Id { get; set; }
    
    public required GameType GameType { get; set; }
    
    public DateTimeOffset StartedAt { get; set; }
    
    public DateTimeOffset EndedAt { get; set; }
    
    public required List<Player> Players { get; set; }
}

public class Team : AuditBase
{
    public int Id { get; set; }
    
    public required string Name { get; set; }
    
    public required List<Player> Players { get; set; }
}

public class Event : AuditBase
{
    public int Id { get; set; }
    
    public required string Name { get; set; }
    
    public required Venue Venue { get; set; }
    
    // todo: handle recurring events here for venues to have weekly quizzes
}

public class Venue : AuditBase
{
    public int Id { get; set; }
    
    public required string Name { get; set; }
    
    public ICollection<Event>? Events { get; set; }
    
    public ICollection<Game>? Games { get; set; }
}