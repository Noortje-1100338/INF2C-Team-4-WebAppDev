namespace Hollowmere.Api.Models;

public class Loan : IEntity
{
    public int Id { get; set; }
    public int GearId { get; set; }
    public int MemberId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? ReturnedAt { get; set; }

    public GearItem Gear { get; set; } = null!;
    public Member Member { get; set; } = null!;
}
