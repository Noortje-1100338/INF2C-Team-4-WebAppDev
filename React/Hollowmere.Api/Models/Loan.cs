namespace Hollowmere.Api.Models;

public class Loan : IEntity
{
    public string Id { get; set; } = string.Empty;
    public string GearId { get; set; } = string.Empty;
    public string MemberId { get; set; } = string.Empty;
    public string StartDate { get; set; } = string.Empty;
    public string ReturnDate { get; set; } = string.Empty;
    public string ConditionNote { get; set; } = string.Empty;

    public GearItem Gear { get; set; } = null!;
    public Member Member { get; set; } = null!;
}
