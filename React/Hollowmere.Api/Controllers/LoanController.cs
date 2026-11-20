using Hollowmere.Api.DTOs;
using Hollowmere.Api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Hollowmere.Api.Controllers;

[ApiController]
[Route("api/loan")]
[Authorize]
public class LoanController : ControllerBase
{
    private readonly ILoanService _service;

    public LoanController(ILoanService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var loans = await _service.GetAllAsync();
        return Ok(loans);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateLoanRequest request)
    {
        try
        {
            var loan = await _service.CreateAsync(request, GetMemberId());
            return Ok(loan);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
            
        }
    }

    private int GetMemberId()
    {
        return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
    }
}