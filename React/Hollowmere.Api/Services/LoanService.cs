using Hollowmere.Api.Data;
using Hollowmere.Api.DTOs;
using Hollowmere.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Hollowmere.Api.Services;

public class LoanService : ILoanService
{
    private readonly AppDbContext _db;

    public LoanService(AppDbContext db)
    {
        _db = db;
    }


    public async Task<IEnumerable<LoanResponse>> GetAllAsync()
    {
        var loans = await _db.Loans
            .Include(l => l.Gear)
            .Include(l => l.Member)
            .OrderByDescending(l => l.StartDate)
            .ToListAsync();

        return loans.Select(ToResponse);
    }

    public async Task<LoanResponse> CreateAsync(CreateLoanRequest request, int memberId)
    {
        var gear = await _db.GearItems.FirstOrDefaultAsync(g => g.Id == request.GearId);
        if (gear == null)
            throw new InvalidOperationException("Uitrusting niet gevonden.");
        if (gear.Retired)
            throw new InvalidOperationException("Deze uitrusting is uit gebruik genomen.");
        var member = await _db.Members.FirstOrDefaultAsync(m => m.Id == memberId);
        
        if (member == null)
            throw new InvalidOperationException("Lid niet gevonden.");
        if (gear.Dangerous && !member.Trained)
            throw new InvalidOperationException("Deze uitrusting is gevaarlijk en het lid is niet getraind om deze uitrusting te gebruiken.");

        var alreadyLoaned = await _db.Loans
            .AnyAsync(l => l.GearId == request.GearId && l.ReturnedAt == null);
        if (alreadyLoaned)
            throw new InvalidOperationException("Deze uitrusting is al uitgeleend.");
        
        if (request.DueDate <= DateTime.UtcNow)
            throw new InvalidOperationException("De inleverdatum moet in de toekomst liggen.");
        
        var loan = new Loan
        {
            GearId = request.GearId,
            MemberId = memberId,
            StartDate = DateTime.UtcNow,
            DueDate = request.DueDate
        };

        _db.Loans.Add(loan);
        await _db.SaveChangesAsync();

        await _db.Entry(loan).Reference(l => l.Gear).LoadAsync();
        await _db.Entry(loan).Reference(l => l.Member).LoadAsync();

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
    };
}