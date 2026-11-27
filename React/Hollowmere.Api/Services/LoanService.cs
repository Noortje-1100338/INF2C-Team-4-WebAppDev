using Hollowmere.Api.DTOs;
using Hollowmere.Api.Models;
using Hollowmere.Api.Repositories;
using Hollowmere.Api.Configuration;
using Microsoft.Extensions.Options;
namespace Hollowmere.Api.Services;


public class LoanService : ILoanService
{
    private readonly ILoanRepository _loans;
    private readonly IRepository<GearItem> _gear;
    private readonly IRepository<Member> _members;
    private readonly LoanPolicyOptions _policy;
    public LoanService(ILoanRepository loans, IRepository<GearItem> gear, IRepository<Member> members, IOptions<LoanPolicyOptions> policy)
    {
        _loans = loans;
        _gear = gear;
        _members = members;
        _policy = policy.Value;
    }

    public async Task<IEnumerable<LoanResponse>> GetAllAsync()
    {
        var loans = await _loans.GetAllAsync();
        return loans.Select(ToResponse);
    }

    public LoanPolicyResponse GetPolicy() => new() { MaxLoanDays = _policy.MaxLoanDays };
    public async Task<LoanResponse> CreateAsync(CreateLoanRequest request, int memberId)
    {
        var gear = await _gear.GetIdByAsync(request.GearId);
        if (gear == null)
            throw new InvalidOperationException("Uitrusting niet gevonden.");
        if (gear.Retired)
            throw new InvalidOperationException("Uitrusting is met pensioen.");

        var member = await _members.GetIdByAsync(memberId);
        if (member == null)
            throw new InvalidOperationException("Lid niet gevonden.");
        if (gear.Dangerous && !member.Trained)
            throw new InvalidOperationException("Je bent nog niet getraind voor gevaarlijke uitrusting.");

        var activeLoan = await _loans.GetActiveForGearAsync(request.GearId);
        if (activeLoan != null)
            throw new InvalidOperationException(activeLoan.MemberId == memberId
            ? "Uitrusting is al in uw bezit."
            : "Uitrusting is al uitgeleend aan een ander lid.");
        
        var now = DateTime.UtcNow;
        if (await _loans.HasOverdueLoanAsync(memberId, now))
            throw new InvalidOperationException("Je hebt een uitrusting openstaat die te laat is. Lever die eerst in voordat je een nieuwe uitrusting leent.");
        
        var lateReturns = await _loans.CountLateReturnsSinceAsync(memberId, now.AddYears(-1));
        if (lateReturns >= _policy.LateReturnLimit)
            throw new InvalidOperationException($"Je hebt het afgelopen jaar {lateReturns} keer te laat ingeleverd en kunt daarom niets lenen voorlopig");
        
        var loan = new Loan
        {
            GearId = request.GearId,
            MemberId = memberId,
            StartDate = now,
            DueDate = now.AddDays(_policy.MaxLoanDays)
        };
        _loans.Add(loan);
        await _loans.SaveChangesAsync();

        var saved = await _loans.GetByIdAsync(loan.Id);
        return ToResponse(saved!);
    }

    public async Task<LoanResponse> ReturnAsync(int loanId, ReturnLoanRequest request, int memberId)
    {
        var loan = await _loans.GetByIdAsync(loanId);
        if (loan == null)
            throw new InvalidOperationException("Lening niet gevonden.");
        if (loan.ReturnedAt != null)
            throw new InvalidOperationException("Uitrusting is al ingeleverd.");
        
        var member = await _members.GetIdByAsync(memberId);
        if (member == null)
            throw new InvalidOperationException("Lid niet gevonden.");
        if (loan.MemberId != memberId && !member.Quartermaster)
            throw new InvalidOperationException("Alleen quatermaster of de lener mag deze lening inleveren.");
        loan.ReturnedAt = DateTime.UtcNow;
        loan.ConditionNote = request.ConditionNote;
        await _loans.SaveChangesAsync();

        return ToResponse(loan);
    }

    private static LoanResponse ToResponse(Loan loan) => new()
    {
        Id = loan.Id,
        GearId = loan.GearId,
        GearName = loan.Gear.Name,
        MemberId = loan.MemberId,
        MemberName = loan.Member.Name,
        StartDate = loan.StartDate,
        DueDate = loan.DueDate,
        ReturnedAt = loan.ReturnedAt,
        ConditionNote = loan.ConditionNote
    };
}