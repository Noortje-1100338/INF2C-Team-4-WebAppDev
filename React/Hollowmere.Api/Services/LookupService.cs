using Hollowmere.Api.DTOs;
using Hollowmere.Api.Models;
using Hollowmere.Api.Repositories;

namespace Hollowmere.Api.Services;

public class LookupService : ILookupService
{
    private readonly IRepository<Region> _regions;
    private readonly IRepository<Creature> _creatures;

    public LookupService(IRepository<Region> regions, IRepository<Creature> creatures)
    {
        _regions = regions;
        _creatures = creatures;
    }

    public async Task<List<RegionResponse>> GetRegionsAsync()
    {
        var regions = await _regions.GetAllAsync();
        return regions
            .OrderBy(r => r.Name)
            .Select(r => new RegionResponse { Id = r. Id, Name = r.Name })
            .ToList();
    }

    public async Task<List<CreatureResponse>> GetCreaturesAsync()
    {
        var creatures = await _creatures.GetAllAsync(c => c.Region);
        return creatures
            .OrderBy(c => c.Name)
            .Select(c => new CreatureResponse
            {
                Id = c.Id,
                Name = c.Name,
                RegionName = c.Region.Name
            })
            .ToList();          
    }
}
