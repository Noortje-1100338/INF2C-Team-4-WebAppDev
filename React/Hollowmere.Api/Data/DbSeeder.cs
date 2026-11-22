using System.Globalization;
using Hollowmere.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Hollowmere.Api.Data;

public static class DbSeeder
{
  public static async Task SeedAsync(AppDbContext db)
  {

    var members = new[]
    {
            new Member { Id = 7, Name = "7", Trained = true },
            new Member { Id = 12, Name = "12", Trained = true },
            new Member { Id = 3, Name = "3", Trained = false },
            new Member { Id = 1, Name = "1", Trained = false },
            new Member { Id = 9, Name = "9", Trained = true }
        };

    var existingMemberIds = await db.Members
        .Select(member => member.Id)
        .ToListAsync();
    db.Members.AddRange(
        members.Where(member => !existingMemberIds.Contains(member.Id)));

    if (!await db.Members.AnyAsync(m => m.Email == "quartermaster@hollowmere.test"))
        db.Members.Add(new Member
        {
            Name = "Quartermaster",
            Email = "quartermaster@hollowmere.test",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("quartermaster"),
            Trained = true,
            Quartermaster = true
        });

    var regions = new[]
    {
            new Region { Id = 1, Name = "Swamp" },
            new Region { Id = 2, Name = "Forest" },
            new Region { Id = 3, Name = "Plains" },
            new Region { Id = 4, Name = "Cave" },
            new Region { Id = 5, Name = "End" }
        };

    var existingRegionIds = await db.Regions
        .Select(region => region.Id)
        .ToListAsync();
    db.Regions.AddRange(
        regions.Where(region => !existingRegionIds.Contains(region.Id)));

    await db.SaveChangesAsync();

    var creatures = new[]
    {
            new Creature
            {
                Id = 1, Name = "Zombie", RegionId = 1,
                Dangerous = true, Description = "", ImageUrl = ""
            },
            new Creature
            {
                Id = 2, Name = "Creeper", RegionId = 2,
                Dangerous = true, Description = "", ImageUrl = ""
            },
            new Creature
            {
                Id = 3, Name = "Skeleton", RegionId = 3,
                Dangerous = true, Description = "", ImageUrl = ""
            },
            new Creature
            {
                Id = 4, Name = "Spider", RegionId = 4,
                Dangerous = true, Description = "", ImageUrl = ""
            },
            new Creature
            {
                Id = 5, Name = "Enderman", RegionId = 5,
                Dangerous = true, Description = "", ImageUrl = ""
            }
        };

    var existingCreatureIds = await db.Creatures
        .Select(creature => creature.Id)
        .ToListAsync();
    db.Creatures.AddRange(
        creatures.Where(creature => !existingCreatureIds.Contains(creature.Id)));

    await db.SaveChangesAsync();

    string DateFromNow(int days) =>
        DateOnly.FromDateTime(DateTime.Today.AddDays(days))
            .ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);

    var quests = new[]
{
    new Quest
    {
        Id = 1,
        LeaderId = 7,
        Village = "Oak",
        AreaDescription = "Zoek de zombie bij het moeras.",
        CreatureId = 1,
        DepartureDate = DateFromNow(5),
        DurationDays = 2,
        PartySize = 4,
        Cancelled = false
    },
    new Quest
    {
        Id = 2,
        LeaderId = 3,
        Village = "Spruce",
        AreaDescription = "Zoek de kist in de grot.",
        CreatureId = null,
        DepartureDate = DateFromNow(10),
        DurationDays = 3,
        PartySize = 5,
        Cancelled = false
    }
};

    var existingQuestIds = await db.Quests
        .Select(q => q.Id)
        .ToListAsync();

    db.Quests.AddRange(
        quests.Where(q => !existingQuestIds.Contains(q.Id))
    );

    await db.SaveChangesAsync();

    var requests = new[]
    {
        new QuestRequest
        {
            Id = 1,
            QuestId = 1,
            MemberId = 12,
            Confirmed = true
        },
        new QuestRequest
        {
            Id = 2,
            QuestId = 1,
            MemberId = 9,
            Confirmed = false
        },
        new QuestRequest
        {
            Id = 3,
            QuestId = 2,
            MemberId = 1,
            Confirmed = false
        }
    };

    var existingRequestIds = await db.QuestRequests
        .Select(q => q.Id)
        .ToListAsync();

    db.QuestRequests.AddRange(
        requests.Where(q => !existingRequestIds.Contains(q.Id))
    );

    await db.SaveChangesAsync();
  }
}