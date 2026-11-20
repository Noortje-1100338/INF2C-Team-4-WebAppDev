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
    public async Task<IEnumerable<GearItemResponse>> GetAllAsync()
    {
        var items = await _db.GearItems.OrderByDescending(g => g.Id).ToListAsync();

        var activeLoans = await _db.Loans
            .Where(l => l.ReturnedAt == null)
            .Include(l => l.Member)
            .ToDictionaryAsync(l => l.GearId, l => l.Member.Name);
        return items.Select(item => ToResponse(item, activeLoans.GetValueOrDefault(item.Id)));
    }

    public async Task<GearItemResponse?> GetByIdAsync(int id)
    {
        var item = await _db.GearItems.FirstOrDefaultAsync(g => g.Id == id);
        if (item == null) return null;

        var loan = await _db.Loans
            .Include(l => l.Member)
            .FirstOrDefaultAsync(l => l.GearId == id && l.ReturnedAt == null);
        
        return ToResponse(item, loan?.Member.Name);
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
    private static GearItemResponse ToResponse(GearItem item, string? loanedTo = null) => new()
        {
            Id = item.Id,
            Name = item.Name,
            Kind = item.Kind,
            Condition = item.Condition,
            Description = item.Description,
            Dangerous = item.Dangerous,
            Retired = item.Retired,
            ImageUrl = string.IsNullOrEmpty(item.ImageUrl) ? null : item.ImageUrl,
            LoanedTo = loanedTo
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