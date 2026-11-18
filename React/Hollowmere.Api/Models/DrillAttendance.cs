namespace Hollowmere.Api.Models;

public class DrillAttendance : IEntity
{
    public int Id { get; set; }
    public int DrillId { get; set; }
    public int MemberId { get; set; }
    public bool Confirmed { get; set; }

    public Drill Drill { get; set; } = null!;
    public Member Member { get; set; } = null!;
}
