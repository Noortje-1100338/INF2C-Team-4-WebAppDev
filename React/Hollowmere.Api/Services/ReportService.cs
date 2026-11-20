using Hollowmere.Api.DTOs;
using Hollowmere.Api.Models;
using Hollowmere.Api.Repositories;

namespace Hollowmere.Api.Services;

public class ReportService : IReportService
{
    private const string Draft = "draft";
    private const string Filed = "filed";

    
    private readonly IReportRepository _reports;

    
    public ReportService(IReportRepository reports)
    {
        _reports = reports;
    }

    
    public async Task<List<ReportResponse>> GetAllAsync()
    {
        var reports = await _reports.GetAllAsync();
        return reports.Select(ToResponse).ToList();
    }


    public async Task<ReportResponse?> GetIdByAsync(int id)
    {
        var report = await _reports.GetIdByAsync(id);
        return report is null ? null : ToResponse(report);
    }

    
    public async Task<ReportResponse> CreateAsync(CreateReportRequest request)
    {
        var report = new Report
        {
            WriterId = request.WriterId,
            RegionId = request.RegionId,
            DepartureDate = request.DepartureDate,
            Text = request.Text,
            Status = Draft,
            Encounters = request.Encounters
                .Select(e => new Encounter 
                {
                    CreatureId = e.CreatureId,
                    Outcome = e.Outcome
                })
                .ToList()
        };
        
        _reports.Add(report);
        await _reports.SaveChangesAsync();

        var saved = await _reports.GetIdByAsync(report.Id);
        return ToResponse(saved!);
    }

    
    public async Task<ReportResponse?> FileAsync(int id)
    {
        var report = await _reports.GetIdByAsync(id);
        if (report is null)
        {
            return null;
        }

        if (report.Status == Draft)
        {
            report.Status = Filed;
            await _reports.SaveChangesAsync();

        }

        return ToResponse(report);

    }

    
    private static ReportResponse ToResponse(Report report) => new()
    {
        Id = report.Id,
        WriterId = report.WriterId,
        WriterName = report.Writer.Name,
        RegionId = report.RegionId,
        RegionName = report.Region.Name,
        DepartureDate = report.DepartureDate,
        Text = report.Text,
        Status = report.Status,
        Encounters = report.Encounters
            .Select(e => new EncounterResponse
            {
                Id = e.Id,
                CreatureId = e.CreatureId,
                CreatureName = e.Creature.Name,
                Outcome = e.Outcome
            })
            .ToList()
    };
}
