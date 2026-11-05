namespace Hollowmere.Api.Models;

public class Subject : IEntity
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;

    public ICollection<Drill> Drills { get; set; } = new List<Drill>();
}
