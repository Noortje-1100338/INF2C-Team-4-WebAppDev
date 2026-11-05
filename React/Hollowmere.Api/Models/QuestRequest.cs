namespace Hollowmere.Api.Models;

public class QuestRequest : IEntity
{
    public string Id { get; set; } = string.Empty;
    public string QuestId { get; set; } = string.Empty;
    public string MemberId { get; set; } = string.Empty;
    public bool Confirmed { get; set; }

    public Quest Quest { get; set; } = null!;
    public Member Member { get; set; } = null!;
}
