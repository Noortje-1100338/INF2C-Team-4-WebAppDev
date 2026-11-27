using Hollowmere.Api.DTOs;

namespace Hollowmere.Api.Services;

public interface ILookupService 
{
    Task<List<RegionResponse>> GetRegionsAsync();
    Task<List<CreatureResponse>> GetCreaturesAsync();
}