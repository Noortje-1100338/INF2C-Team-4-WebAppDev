namespace Hollowmere.Api.Models;

public class Drill : IEntity
{
    public string Id { get; set; } = string.Empty;
    public string SubjectId { get; set; } = string.Empty;
    public string InstructorId { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public bool Cancelled { get; set; }

    public Subject Subject { get; set; } = null!;
    public Member Instructor { get; set; } = null!;
    public ICollection<DrillAttendance> Attendances { get; set; } = new List<DrillAttendance>();
}
