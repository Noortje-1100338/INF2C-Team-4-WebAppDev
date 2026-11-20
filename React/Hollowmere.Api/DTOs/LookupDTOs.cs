namespace Hollowmere.Api.DTO's;

public class RegionResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

}

public class CreatureResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty
    public string RegionName { get; set; } = string.Empty 
}
