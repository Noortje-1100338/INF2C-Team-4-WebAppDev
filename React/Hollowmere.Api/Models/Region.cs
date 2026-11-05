namespace Hollowmere.Api.Models;

public class Region : IEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public ICollection<Creature> Creatures { get; set; } = new List<Creature>();
    public ICollection<Report> Reports { get; set; } = new List<Report>();
}
