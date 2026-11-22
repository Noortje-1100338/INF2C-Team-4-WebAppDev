using Hollowmere.Api.Data;
using Hollowmere.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Hollowmere.Api.Repositories;

public class LoanRepository : ILoanRepository
{
    private readonly AppDbContext _context;

    public LoanRepository(AppDbContext context)
    {
        _context = context;
    }

    private IQueryable<Loan> LoansWithDetails() =>
        _context.Loans
            .Include(l => l.Gear)
            .Include(l => l.Member);

    public async Task<List<Loan>> GetAllAsync() => await LoansWithDetails().OrderByDescending(l => l.StartDate).ToListAsync();

    public async Task<Loan?> GetByIdAsync(int id) => await LoansWithDetails().FirstOrDefaultAsync(l => l.Id == id);

    public async Task<List<Loan>> GetActiveAsync() => await LoansWithDetails().Where(l => l.ReturnedAt == null).ToListAsync();

    public async Task<Loan?> GetActiveForGearAsync(int gearId) => await LoansWithDetails().FirstOrDefaultAsync(l => l.GearId == gearId && l.ReturnedAt == null);

    public async Task<bool> HasOverdueLoanAsync(int memberId, DateTime now) => await _context.Loans.AnyAsync(l => l.MemberId == memberId && l.ReturnedAt == null && l.DueDate < now);

    public async Task<int> CountLateReturnsSinceAsync(int memberId, DateTime since) => await _context.Loans.CountAsync(l => l.MemberId == memberId && l.ReturnedAt != null
    && l.ReturnedAt > l.DueDate && l.ReturnedAt >= since);

    public void Add(Loan loan) => _context.Loans.Add(loan);

    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();
}
