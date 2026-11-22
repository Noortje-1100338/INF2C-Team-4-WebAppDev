using Hollowmere.Api.Models;

namespace Hollowmere.Api.Repositories;

public interface ILoanRepository
{
    Task<List<Loan>> GetAllAsync();
    Task<Loan?> GetByIdAsync(int id);
    Task<List<Loan>> GetActiveAsync();
    Task<Loan?> GetActiveForGearAsync(int gearId);
    Task<bool> HasOverdueLoanAsync(int memberId, DateTime now);
    Task<int> CountLateReturnsSinceAsync(int memberId, DateTime since);
    void Add(Loan loan);
    Task<int> SaveChangesAsync();
}