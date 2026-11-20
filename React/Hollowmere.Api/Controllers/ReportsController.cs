using Hollowmere.Api.DTOs;
using Hollowmere.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Hollowmere.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reports;

    public ReportsController(IReportService reports)
    {
        _reports = reports;
    }

    [HttpGet]
    public async Task<ActionResult<List<ReportResponse>>> GetAll()
        => Ok(await _reports.GetAllAsync());

    
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ReportResponse>> GetById(int id)
    {
        var report = await _reports.GetIdByAsync(id);
        return report is null? NotFound() : Ok(report);
    }

    [HttpPost]
    public async Task<ActionResult<ReportResponse>> Create(CreateReportRequest request)
    {
        var created = await _reports.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id}, created);
    }

    [HttpPatch("{id:int}")]
    public async Task<ActionResult<ReportResponse>> UpdateStatus(int id, UpdateReportStatusRequest request)
    {
        if (request.Status != "filed")
        {
            return BadRequest();
        }

        var filed = await _reports.FileAsync(id);
        return filed is null ? NotFound() : Ok(filed);
    }
}

