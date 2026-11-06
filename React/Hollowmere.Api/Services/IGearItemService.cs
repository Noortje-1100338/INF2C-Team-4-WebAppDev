using Hollowmere.Api.DTOs;

namespace Hollowmere.Api.Services;

public interface IGearItemService
{
    Task<IEnumerable<GearItemResponse>> GetAllAsync();
    Task<GearItemResponse> CreateAsync(CreateGearItemRequest request);
}