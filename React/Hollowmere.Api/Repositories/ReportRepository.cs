using Hollowmere.Api.Data;
using Hollowmere.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Hollowmere.Api.Repositories;

public class ReportRepository : IReportRepository
{
    private readonly AppDbContext _context;

    public ReportRepository(AppDbContext context)
    {
        _context = context;
    }

    private IQueryable<Report> ReportWithDetails() =>
        _context.Reports
            .Include(r => r.Writer)
            .Include(r => r.Region)
            .Include(r => r.Encounters)
                .ThenInclude(e => e.Creature);

    
    public async Task<List<Report>> GetAllAsync()
        => await ReportWithDetails().OrderByDescending(r => r.Id).ToListAsync();

    
    public async Task<Report?> GetIdByAsync(int id)
        => await ReportWithDetails().FirstOrDefaultAsync(r => r.Id == id);

    public void Add(Report report) => _context.Reports.Add(report);

    public Task<int> SaveChangesAsync() => _context.SaveChangesAsync();
    

}