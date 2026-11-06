namespace Hollowmere.Api.DTOs;

public class CreateGearItemRequest
{
    public string Name { get; set; } = string.Empty;
    public string Kind { get; set; } = string.Empty;
    public string Condition { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool Dangerous { get; set; }
    public string? ImageUrl { get; set; }
}
