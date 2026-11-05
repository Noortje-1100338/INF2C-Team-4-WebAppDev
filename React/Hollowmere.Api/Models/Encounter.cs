namespace Hollowmere.Api.Models;

public class Encounter : IEntity
{
    public int Id { get; set; }
    public int ReportId { get; set; }
    public int CreatureId { get; set; }
    public string Outcome { get; set; } = string.Empty;

    public Report Report { get; set; } = null!;
    public Creature Creature { get; set; } = null!;
}
