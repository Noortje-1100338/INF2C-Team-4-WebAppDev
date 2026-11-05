namespace Hollowmere.Api.Models;

public class Creature : IEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int RegionId { get; set; }
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public bool Dangerous { get; set; }

    public Region Region { get; set; } = null!;
    public ICollection<Quest> Quests { get; set; } = new List<Quest>();
    public ICollection<Encounter> Encounters { get; set; } = new List<Encounter>();
}
