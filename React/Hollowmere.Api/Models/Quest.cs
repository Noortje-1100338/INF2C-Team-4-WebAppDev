namespace Hollowmere.Api.Models;

public class Quest : IEntity
{
    public int Id { get; set; }
    public int LeaderId { get; set; }
    public string Village { get; set; } = string.Empty;
    public string AreaDescription { get; set; } = string.Empty;
    public int? CreatureId { get; set; }
    public string DepartureDate { get; set; } = string.Empty;
    public int DurationDays { get; set; }
    public int PartySize { get; set; }
    public bool Cancelled { get; set; }

    public Member Leader { get; set; } = null!;
    public Creature? Creature { get; set; }
    public ICollection<QuestRequest> Requests { get; set; } = new List<QuestRequest>();
}
