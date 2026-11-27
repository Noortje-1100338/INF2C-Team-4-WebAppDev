namespace Hollowmere.Api.DTOs;

public class ReportResponse
{
    public int Id { get; set; }
    public int WriterId { get; set; }
    public string WriterName { get; set; } = string.Empty;
    public int RegionId { get; set; }
    public string RegionName { get; set; } = string.Empty;
    public string DepartureDate { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public List<EncounterResponse> Encounters { get; set; } = new();    
}

public class EncounterResponse
{
    public int Id { get; set; }
    public int CreatureId { get; set; }
    public string CreatureName { get; set; } = string.Empty;
    public string Outcome { get; set; } = string.Empty;
}

public class CreateReportRequest
{
    public int WriterId { get; set; }
    public int RegionId { get; set; }
    public string DepartureDate { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public List<CreateEncounterRequest> Encounters { get; set; } = new();
}


public class CreateEncounterRequest
{
    public int CreatureId { get; set; }
    public string Outcome { get; set; } = string.Empty;
}


public class UpdateReportStatusRequest
{
    public string Status { get; set; } = string.Empty;
}
