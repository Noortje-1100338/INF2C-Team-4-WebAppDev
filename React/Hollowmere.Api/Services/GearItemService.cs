using Hollowmere.Api.Models;
using Hollowmere.Api.DTOs;
using Hollowmere.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace Hollowmere.Api.Services;

public class GearItemService : IGearItemService
{
    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;

    public GearItemService(AppDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    public GearItemService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<GearItemResponse>> GetAllAsync()
    {
        var items = await _db.GearItems.OrderByDescending(g => g.Id).ToListAsync();
        return items.Select(ToResponse);
    }

    public async Task<GearItemResponse?> GetByIdAsync(int id)
    {
        var item = await _db.GearItems.FirstOrDefaultAsync(g => g.Id == id);
        return item == null ? null : ToResponse(item);
    }

    public async Task<GearItemResponse> CreateAsync(CreateGearItemRequest request)
    {
        var imageUrl = string.IsNullOrEmpty(request.ImageUrl)
            ? string.Empty
            : await SaveImageAsync(request.ImageUrl);
        var item = new GearItem
        {
            Name = request.Name,
            Kind = request.Kind,
            Condition = request.Condition,
            Description = request.Description,
            Dangerous = request.Dangerous,
            Retired = false,
            ImageUrl = imageUrl
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

        private async Task<string> SaveImageAsync(string dataUrl)
    {
        var match = Regex.Match(dataUrl, @"^data:image/(?<ext>[a-zA-Z0-9]+);base64,(?<data>.+)$");
        if (!match.Success) return dataUrl;

        var ext = match.Groups["ext"].Value.ToLowerInvariant();
        if (ext == "jpeg") ext = "jpg";
        if (ext is not ("jpg" or "png" or "gif" or "webp"))
            throw new InvalidOperationException("Ongeldig afbeeldingstype.");

        var bytes = Convert.FromBase64String(match.Groups["data"].Value);

        var folder = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads");
        Directory.CreateDirectory(folder);

        var fileName = $"{Guid.NewGuid()}.{ext}";
        await File.WriteAllBytesAsync(Path.Combine(folder, fileName), bytes);

        return $"/uploads/{fileName}";
    }
}