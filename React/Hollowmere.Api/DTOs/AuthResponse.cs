namespace Hollowmere.Api.DTOs;

public class AuthResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool Trained { get; set; }
    public bool Quartermaster { get; set; }
}