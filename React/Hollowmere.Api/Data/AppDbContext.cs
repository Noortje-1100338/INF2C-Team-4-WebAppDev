using Hollowmere.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Hollowmere.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Member> Members => Set<Member>();
    public DbSet<Region> Regions => Set<Region>();
    public DbSet<Creature> Creatures => Set<Creature>();
    public DbSet<GearItem> GearItems => Set<GearItem>();
    public DbSet<Loan> Loans => Set<Loan>();
    public DbSet<Quest> Quests => Set<Quest>();
    public DbSet<QuestRequest> QuestRequests => Set<QuestRequest>();
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<Drill> Drills => Set<Drill>();
    public DbSet<DrillAttendance> DrillAttendances => Set<DrillAttendance>();
    public DbSet<YardClosure> YardClosures => Set<YardClosure>();
    public DbSet<Report> Reports => Set<Report>();
    public DbSet<Encounter> Encounters => Set<Encounter>();
}