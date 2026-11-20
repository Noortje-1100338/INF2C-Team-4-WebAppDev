namespace Hollowmere.Api.DTOs;

public class LoanResponse
{
    public int Id { get; set; }
    public int GearId { get; set; }
    public string GearName { get; set; } = string.Empty;
    public int MemberId { get; set; }
    public string MemberName { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime DueDate { get; set; }
    public DateTime? ReturnedAt { get; set; }
}