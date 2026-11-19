namespace Hollowmere.Api.Models;

public class Loan : IEntity
{
    public int Id { get; set; }
    public int GearId { get; set; }
    public int MemberId { get; set; }
    public string StartDate { get; set; } = string.Empty;
    public string ReturnDate { get; set; } = string.Empty;
    public string ConditionNote { get; set; } = string.Empty;

    public GearItem Gear { get; set; } = null!;
    public Member Member { get; set; } = null!;
}
