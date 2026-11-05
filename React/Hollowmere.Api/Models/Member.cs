namespace Hollowmere.Api.Models;

public class Member : IEntity
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public bool Trained { get; set; }
    public bool Quartermaster { get; set; }

    public ICollection<Loan> Loans { get; set; } = new List<Loan>();
    public ICollection<Quest> LedQuests { get; set; } = new List<Quest>();
    public ICollection<QuestRequest> QuestRequests { get; set; } = new List<QuestRequest>();
    public ICollection<Drill> InstructedDrills { get; set; } = new List<Drill>();
    public ICollection<DrillAttendance> DrillAttendances { get; set; } = new List<DrillAttendance>();
    public ICollection<Report> Reports { get; set; } = new List<Report>();
}
