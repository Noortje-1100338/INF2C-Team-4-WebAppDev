namespace Hollowmere.Api.Models;

public class Region : IEntity
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;

    public ICollection<Creature> Creatures { get; set; } = new List<Creature>();
    public ICollection<Report> Reports { get; set; } = new List<Report>();
}
