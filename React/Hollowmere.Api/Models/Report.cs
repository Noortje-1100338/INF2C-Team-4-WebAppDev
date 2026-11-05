namespace Hollowmere.Api.Models;

public class Report : IEntity
{
    public string Id { get; set; } = string.Empty;
    public string WriterId { get; set; } = string.Empty;
    public string RegionId { get; set; } = string.Empty;
    public string DepartureDate { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;

    public Member Writer { get; set; } = null!;
    public Region Region { get; set; } = null!;
    public ICollection<Encounter> Encounters { get; set; } = new List<Encounter>();
}
