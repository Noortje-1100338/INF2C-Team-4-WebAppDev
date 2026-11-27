using Hollowmere.Api.DTOs;

namespace Hollowmere.Api.Services;

public interface IGearItemService
{
    Task<IEnumerable<GearItemResponse>> GetAllAsync(int memberId);
    Task<GearItemResponse?> GetByIdAsync(int id, int memberId);
    Task<GearItemResponse> CreateAsync(CreateGearItemRequest request, int memberId);
    Task<GearItemResponse> RetireAsync(int id, int memberId);
}