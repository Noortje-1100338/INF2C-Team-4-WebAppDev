using Hollowmere.Api.Data;
using Hollowmere.Api.DTOs;
using Hollowmere.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Hollowmere.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        if (await _db.Members.AnyAsync(m => m.Email == request.Email))
            return BadRequest("Email is al in gebruik.");
        var member = new Member
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };

        _db.Members.Add(member);
        await _db.SaveChangesAsync();

        return Ok(new AuthResponse
        {
            Token = GenerateToken(member),
            Name = member.Name
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var member = await _db.Members.FirstOrDefaultAsync(m => m.Email == request.Email);
        if (member == null || !BCrypt.Net.BCrypt.Verify(request.Password, member.PasswordHash))
            return Unauthorized("Ongeldige email of wachtwoord.");
        return Ok(new AuthResponse
        {
            Token = GenerateToken(member),
            Name = member.Name
        });
    }
    
    private string GenerateToken(Member member)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, member.Id.ToString()),
            new Claim(ClaimTypes.Name, member.Name),
            new Claim(ClaimTypes.Email, member.Email)
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