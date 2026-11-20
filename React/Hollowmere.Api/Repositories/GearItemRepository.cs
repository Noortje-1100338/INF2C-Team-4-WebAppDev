using Hollowmere.Api.Data;
using Hollowmere.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Hollowmere.Api.Repositories;

public class GearItemRepository : IGearItemRepository
{
    private readonly AppDbContext _context;

    public GearItemRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<GearItem>> GetAllAsync() => await _context.GearItems.OrderByDescending(g => g.Id).ToListAsync();

    public async Task<GearItem?> GetByIdAsync(int id) => await _context.GearItems.FirstOrDefaultAsync(g => g.Id == id);

    public void Add(GearItem item) => _context.GearItems.Add(item);

    public Task<int> SaveChangesAsync() => _context.SaveChangesAsync();

}