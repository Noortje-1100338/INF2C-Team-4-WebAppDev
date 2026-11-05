namespace Hollowmere.Api.Models;

public class Product : IEntity
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public decimal Price { get; set; }

}