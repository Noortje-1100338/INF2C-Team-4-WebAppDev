namespace Hollowmere.Api.Models;

public class GearItem : IEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Kind { get; set; } = string.Empty;
    public string Condition { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool Dangerous { get; set; }
    public bool Retired { get; set; }
    public string ImageUrl { get; set; } = string.Empty;

    public ICollection<Loan> Loans { get; set; } = new List<Loan>();
}
