using Hollowmere.Api.Data;
using Hollowmere.Api.DTOs;
using Hollowmere.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hollowmere.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestController : BaseController
{
  public QuestController(AppDbContext context) : base(context)
  { }

  [HttpGet]
  public async Task<IActionResult> GetQuests()
  {
    var quests = await Context.Quests
      .Include(quest => quest.Requests)
      .ToListAsync();
    return Ok(quests.Select(QuestResponse.FromEntity));
  }

  [HttpGet("{id}")]
  public async Task<ActionResult> GetQuest(int id)
  {
    var quest = await Context.Quests
      .Include(quest => quest.Requests)
      .FirstOrDefaultAsync(quest => quest.Id == id);

    if (quest == null)
    {
      return NotFound();
    }

    return Ok(QuestResponse.FromEntity(quest));
  }

  [HttpPost]
  public async Task<ActionResult<QuestResponse>> PostQuest(CreateQuestRequest request)
  {
    var leader = await Context.Members.FindAsync(request.LeaderId);
    if (leader == null)
    {
      return BadRequest("The specified leader does not exist.");
    }

    Creature? creature = null;
    if (request.CreatureId.HasValue)
    {
      creature = await Context.Creatures.FindAsync(request.CreatureId.Value);
      if (creature == null)
      {
        return BadRequest("The specified creature does not exist.");
      }

      if (creature.Dangerous && !leader.Trained)
      {
        return BadRequest("A quest against a dangerous creature needs a trained leader.");
      }
    }

    var quest = new Quest
    {
      LeaderId = request.LeaderId,
      Village = request.Village,
      AreaDescription = request.AreaDescription,
      CreatureId = request.CreatureId,
      DepartureDate = request.DepartureDate,
      DurationDays = request.DurationDays,
      PartySize = request.PartySize,
      Cancelled = false
    };

    Context.Quests.Add(quest);
    await Context.SaveChangesAsync();

    return CreatedAtAction(
      nameof(GetQuest),
      new { id = quest.Id },
      QuestResponse.FromEntity(quest));
  }
}
