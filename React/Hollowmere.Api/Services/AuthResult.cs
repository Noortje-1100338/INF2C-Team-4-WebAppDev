namespace Hollowmere.Api.Services;

public class AuthResult
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool Trained { get; set; }
    public bool Quartermaster { get; set; }
    public string Token { get; set; } = string.Empty;
}