using Hollowmere.Api.DTOs;

namespace Hollowmere.Api.Services;

public interface IReportService
{
    Task<List<ReportResponse>> GetAllAsync();
    Task<ReportResponse?> GetIdByAsync(int id);
    Task<ReportResponse> CreateAsync(CreateReportRequest request);
    Task<ReportResponse?> FileAsync(int id);
}



