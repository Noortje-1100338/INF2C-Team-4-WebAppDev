namespace Hollowmere.Api.DTOs;

public class CreateLoanRequest
{
    public int GearId { get; set; }
    public DateTime DueDate { get; set; }
}