namespace Hollowmere.Api.Configuration;
public class LoanPolicyOptions
{
    public const string SectionName = "LoanPolicy";

    public int MaxLoanDays { get; set; } = 14;
    public int LateReturnLimit { get; set; } = 3;
}