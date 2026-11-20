using Hollowmere.Api.DTOs;

namespace Hollowmere.Api.Services;

public interface IGearItemService
{
    Task<IEnumerable<GearItemResponse>> GetAllAsync();
    Task<GearItemResponse?> GetByIdAsync(int id);
    Task<GearItemResponse> CreateAsync(CreateGearItemRequest request);
}