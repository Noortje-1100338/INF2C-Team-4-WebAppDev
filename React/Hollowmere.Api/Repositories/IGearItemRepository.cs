using Hollowmere.Api.Models;

namespace Hollowmere.Api.Repositories;

public interface IGearItemRepository
{
    Task<List<GearItem>> GetAllAsync();
    Task<GearItem?> GetByIdAsync(int id);
    void Add(GearItem gearItem);
    Task<int> SaveChangesAsync();
}