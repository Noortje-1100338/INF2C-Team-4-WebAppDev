using Hollowmere.Api.DTOs;

namespace Hollowmere.Api.Services;

public interface IAuthService
{
    Task<AuthResponse> Register(RegisterRequest request);
    Task<AuthResponse> Login(LoginRequest request);

}

