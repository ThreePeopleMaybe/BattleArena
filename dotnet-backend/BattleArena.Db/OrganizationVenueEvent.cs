using System.ComponentModel.DataAnnotations.Schema;

namespace BattleArena.Db;

[Table("organization_venue_events")]
public class OrganizationVenueEvent : AuditBase
{
    [Column("id", Order = 1)]
    public int Id { get; set; }

    [Column("name", TypeName =  "varchar(512)")]
    public required string Name { get; set; }

    [Column("organization_venue_id")]
    public int OrganizationVenueId { get; set; }
    public required OrganizationVenue Venue { get; set; }

    // todo: handle both one-off and recurring events here for venues to have quiz nights
}
