using Hollowmere.Api.Models;
using Hollowmere.Api.DTOs;
using Hollowmere.Api.Repositories;
using System.Text.RegularExpressions;

namespace Hollowmere.Api.Services;

public class GearItemService : IGearItemService
{
    private readonly IGearItemRepository _gear;
    private readonly IRepository<Member> _members;
    private readonly IWebHostEnvironment _env;
    private readonly ILoanRepository _loans;

    public GearItemService(IGearItemRepository gear, IRepository<Member> members, IWebHostEnvironment env, ILoanRepository loans)
    {
        _gear = gear;
        _members = members;
        _env = env;
        _loans = loans;
    }

    private async Task<bool> IsQuartermasterAsync(int memberId)
    {
        var member = await _members.GetIdByAsync(memberId);
        return member?.Quartermaster ?? false;
    }
    public async Task<IEnumerable<GearItemResponse>> GetAllAsync(int memberId)
    {
        var items = await _gear.GetAllAsync();

        if (!await IsQuartermasterAsync(memberId))
            items = items.Where(i => !i.Retired).ToList();

        var activeLoans = (await _loans.GetActiveAsync()).ToDictionary(l => l.GearId);
        return items.Select(item => ToResponse(item, activeLoans.GetValueOrDefault(item.Id)));
    }

    public async Task<GearItemResponse?> GetByIdAsync(int id, int memberId)
    {
        var item = await _gear.GetByIdAsync(id);
        if (item == null) return null;

        if (item.Retired && !await IsQuartermasterAsync(memberId)) return null;

        var loan = await _loans.GetActiveForGearAsync(id);
        return ToResponse(item, loan);
    }

    public async Task<GearItemResponse> CreateAsync(CreateGearItemRequest request, int memberId)
    {
        var member = await _members.GetIdByAsync(memberId);
        if (member is null or { Quartermaster: false })
            throw new InvalidOperationException("Alleen kwartiermeesters kunnen uitrusting toevoegen.");

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

        _gear.Add(item);
        await _gear.SaveChangesAsync();

        return ToResponse(item);
    }

    public async Task<GearItemResponse> RetireAsync(int id, int memberId)
    {
        if (!await IsQuartermasterAsync(memberId))
            throw new InvalidOperationException("Alleen quartermasters kunnen uitrusting buiten dienst stellen.");

        var item = await _gear.GetByIdAsync(id);
        if (item is null)
            throw new InvalidOperationException("Uitrusting niet gevonden");
        if (item.Retired)
            throw new InvalidOperationException("Deze uitrusting is al buiten dienst");

        var loan = await _loans.GetActiveForGearAsync(id);
        if (loan != null)
            throw new InvalidOperationException($"Deze uitrusting is nog uitgeleend aan {loan.Member.Name}. Laat die het eerst inleveren");

        item.Retired = true;
        await _gear.SaveChangesAsync();

        return ToResponse(item);
    }
    private static GearItemResponse ToResponse(GearItem item, Loan? loan = null) => new()
        {
            Id = item.Id,
            Name = item.Name,
            Kind = item.Kind,
            Condition = item.Condition,
            Description = item.Description,
            Dangerous = item.Dangerous,
            Retired = item.Retired,
            ImageUrl = string.IsNullOrEmpty(item.ImageUrl) ? null : item.ImageUrl,
            LoanedTo = loan?.Member.Name,
            LoanedToMemberId = loan?.MemberId,
            ActiveLoanId = loan?.Id
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