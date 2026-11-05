namespace Hollowmere.Api.Models;

public class DrillAttendance : IEntity
{
    public string Id { get; set; } = string.Empty;
    public string DrillId { get; set; } = string.Empty;
    public string MemberId { get; set; } = string.Empty;
    public bool Confirmed { get; set; }

    public Drill Drill { get; set; } = null!;
    public Member Member { get; set; } = null!;
}
