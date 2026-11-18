using Hollowmere.Api.Services;
using Hollowmere.Api.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Hollowmere.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GearItemController : ControllerBase
{
    private readonly IGearItemService _service;
    public GearItemController(IGearItemService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult> GetAll()
    {
        var items = await _service.GetAllAsync();
        return Ok(items);
    }
    [HttpPost]
    public async Task<IActionResult> Create(CreateGearItemRequest request)
    {
        var created = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(GetAll), created);
    }
}