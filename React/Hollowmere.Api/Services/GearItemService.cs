using Hollowmere.Api.Models;
using Hollowmere.Api.DTOs;
using Hollowmere.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Hollowmere.Api.Services;

public class GearItemService : IGearItemService
{
    private readonly AppDbContext _db;

    public GearItemService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<GearItemResponse>> GetAllAsync()
    {
        var items = await _db.GearItems.OrderByDescending(g => g.Id).ToListAsync();
        return items.Select(ToResponse);
    }

    public async Task<GearItemResponse> CreateAsync(CreateGearItemRequest request)
    {
        var item = new GearItem
        {
            Name = request.Name,
            Kind = request.Kind,
            Condition = request.Condition,
            Description = request.Description,
            Dangerous = request.Dangerous,
            Retired = false,
            ImageUrl = request.ImageUrl ?? string.Empty
        };

        _db.GearItems.Add(item);
        await _db.SaveChangesAsync();

        return ToResponse(item);
    }
    private static GearItemResponse ToResponse(GearItem item) => new()
        {
            Id = item.Id,
            Name = item.Name,
            Kind = item.Kind,
            Condition = item.Condition,
            Description = item.Description,
            Dangerous = item.Dangerous,
            Retired = item.Retired,
            ImageUrl = string.IsNullOrEmpty(item.ImageUrl) ? null : item.ImageUrl,
            LoanedTo = null
        };
}