using Hollowmere.Api.Models;

namespace Hollowmere.Api.Repositories;

public interface IReportRepository
{
    Task<List<Report>> GetAllAsync();
    Task<Report?> GetIdByAsync(int id);
    void Add(Report report);
    Task<int> SaveChangesAsync();
}