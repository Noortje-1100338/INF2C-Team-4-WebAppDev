namespace Hollowmere.Api.Models;

public class QuestRequest : IEntity
{
    public int Id { get; set; }
    public int QuestId { get; set; }
    public int MemberId { get; set; }
    public bool Confirmed { get; set; }

    public Quest Quest { get; set; } = null!;
    public Member Member { get; set; } = null!;
}
