using Hollowmere.Api.Services;
using Hollowmere.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Hollowmere.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
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
        var items = await _service.GetAllAsync(GetMemberId());
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult> GetById(int id)
    {
        var item = await _service.GetByIdAsync(id, GetMemberId());
        if (item == null)
            return NotFound();
        return Ok(item);
    }
    [HttpPost]
    public async Task<IActionResult> Create(CreateGearItemRequest request)
    {
        try {
            var created = await _service.CreateAsync(request, GetMemberId());
            return CreatedAtAction(nameof(GetAll), created);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    private int GetMemberId()
    {
        return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}
