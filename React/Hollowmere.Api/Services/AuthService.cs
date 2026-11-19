using Hollowmere.Api.DTOs;
using Hollowmere.Api.Models;
using Hollowmere.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Hollowmere.Api.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthService(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<AuthResponse> Register(RegisterRequest request)
    {
        if (await _db.Members.AnyAsync(m => m.Email == request.Email))
            throw new InvalidOperationException("Email is al in gebruik.");
        var member = new Member
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };

        _db.Members.Add(member);
        await _db.SaveChangesAsync();

        return new AuthResponse
        {
            Token = GenerateToken(member),
            Name = member.Name
        };
    }

    public async Task<AuthResponse> Login(LoginRequest request)
    {
        var member = await _db.Members.FirstOrDefaultAsync(m => m.Email == request.Email);
        if (member == null || !BCrypt.Net.BCrypt.Verify(request.Password, member.PasswordHash))
            throw new UnauthorizedAccessException("Ongeldige email of wachtwoord.");
        return new AuthResponse
        {
            Token = GenerateToken(member),
            Name = member.Name
        };
    }

    private string GenerateToken(Member member)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, member.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, member.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}