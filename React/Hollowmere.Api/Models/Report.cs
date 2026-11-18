namespace Hollowmere.Api.Models;

public class Report : IEntity
{
    public int Id { get; set; }
    public int WriterId { get; set; }
    public int RegionId { get; set; }
    public string DepartureDate { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;

    public Member Writer { get; set; } = null!;
    public Region Region { get; set; } = null!;
    public ICollection<Encounter> Encounters { get; set; } = new List<Encounter>();
}
