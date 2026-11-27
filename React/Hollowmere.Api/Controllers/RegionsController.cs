using Hollowmere.Api.DTOs;
using Hollowmere.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Hollowmere.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RegionsController : ControllerBase
{
    private readonly ILookupService _lookups;
    
    public RegionsController(ILookupService lookups)
    {
        _lookups = lookups;
    }

    [HttpGet]
    public async Task<ActionResult<List<RegionResponse>>> GetAll()
        => Ok(await _lookups.GetRegionsAsync());
}