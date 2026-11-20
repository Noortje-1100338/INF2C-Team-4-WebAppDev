using Hollowmere.Api.DTOs;

namespace Hollowmere.Api.Services;

public interface ILoanService
{
    Task<IEnumerable<LoanResponse>> GetAllAsync();
    Task<LoanResponse> CreateAsync(CreateLoanRequest request, int memberId);
}