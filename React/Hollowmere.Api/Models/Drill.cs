namespace Hollowmere.Api.Models;

public class Drill : IEntity
{
    public int Id { get; set; }
    public int SubjectId { get; set; }
    public int InstructorId { get; set; }
    public string Date { get; set; } = string.Empty;
    public bool Cancelled { get; set; }

    public Subject Subject { get; set; } = null!;
    public Member Instructor { get; set; } = null!;
    public ICollection<DrillAttendance> Attendances { get; set; } = new List<DrillAttendance>();
}
