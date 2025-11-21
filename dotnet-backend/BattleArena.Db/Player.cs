namespace BattleArena.Db;

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

    public required Organization Organization { get; set; }

    public ICollection<Event>? Events { get; set; }
}

public class Organization : AuditBase
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public ICollection<Venue>? Venues { get; set; }

    public required ICollection<User> Hosts { get; set; } = [];
}
