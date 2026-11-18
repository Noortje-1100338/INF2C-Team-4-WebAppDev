namespace Hollowmere.Api.Models;

public class Subject : IEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public ICollection<Drill> Drills { get; set; } = new List<Drill>();
}
