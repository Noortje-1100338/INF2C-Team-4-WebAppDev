using Hollowmere.Api.DTOs;

namespace Hollowmere.Api.Services;

public interface IAuthService
{
    Task<AuthResult> Register(RegisterRequest request);
    Task<AuthResult> Login(LoginRequest request);
    Task<AuthResponse?> GetByIdAsync(int memberId);

}

