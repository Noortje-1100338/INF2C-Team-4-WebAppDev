using Hollowmere.Api.Models;

namespace Hollowmere.Api.Repositories;

public interface ILoanRepository
{
    Task<List<Loan>> GetAllAsync();
    Task<Loan?> GetByIdAsync(int id);
    Task<List<Loan>> GetActiveAsync();
    Task<Loan?> GetActiveForGearAsync(int gearId);
    void Add(Loan loan);
    Task<int> SaveChangesAsync();
}