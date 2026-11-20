using Hollowmere.Api.DTOs;
using Hollowmere.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Hollowmere.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CreaturesController : ControllerBase
{
    private readonly ILookupService _lookups;

    public CreaturesController(ILookupService lookups)
    {
        _lookups = lookups;
    }

    [HttpGet]
    public async Task<ActionResult<List<CreatureResponse>>> GetAll()
        => Ok(await _lookups.GetCreaturesAsync());
}