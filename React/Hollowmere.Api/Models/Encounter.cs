namespace Hollowmere.Api.Models;

public class Encounter : IEntity
{
    public string Id { get; set; } = string.Empty;
    public string ReportId { get; set; } = string.Empty;
    public string CreatureId { get; set; } = string.Empty;
    public string Outcome { get; set; } = string.Empty;

    public Report Report { get; set; } = null!;
    public Creature Creature { get; set; } = null!;
}
