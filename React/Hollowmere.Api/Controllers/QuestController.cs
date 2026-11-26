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
    if (!request.DepartureDate.HasValue)
    {
      return BadRequest("A valid departure date is required.");
    }

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
      DepartureDate = request.DepartureDate!.Value.ToString("yyyy-MM-dd"),
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

  [HttpPut("{id}")]
  public async Task<ActionResult<QuestResponse>> PutQuest(
    int id, CreateQuestRequest request)
  {
    var quest = await Context.Quests
    .Include(item => item.Requests)
    .FirstOrDefaultAsync(item => item.Id == id);
    if (quest == null)
    {
      return NotFound();
    }

    var validationError = await ValidateQuestRequest(request);
    if (validationError != null)
    {
      return BadRequest(validationError);
    }

    var confirmedRequests = quest.Requests.Count(item => item.Confirmed);
    if (confirmedRequests + 1 > request.PartySize)
    {
      return BadRequest("Partysize cannot be smaller than its confirmed members");
    }

    if (request.CreatureId.HasValue)
    {
      var confirmedMemberIds = quest.Requests
      .Where(item => item.Confirmed)
      .Select(item => item.MemberId)
      .ToArray();
      var hasUntrainedMember = await Context.Members.AnyAsync(member => confirmedMemberIds.Contains(member.Id) && !member.Trained);

      if (hasUntrainedMember)
      {
        var creature = await Context.Creatures.FindAsync(request.CreatureId.Value);
        if (creature?.Dangerous == true)
        {
          return BadRequest("A dangerous quest can only include trained members.");
        }
      }
    }

    quest.LeaderId = request.LeaderId;
    quest.Village = request.Village;
    quest.AreaDescription = request.AreaDescription;
    quest.CreatureId = request.CreatureId;
    quest.DepartureDate = request.DepartureDate!.Value.ToString("yyyy-MM-dd");
    quest.DurationDays = request.DurationDays;
    quest.PartySize = request.PartySize;
    await Context.SaveChangesAsync();

    return Ok(QuestResponse.FromEntity(quest));

  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> DeleteQuest(int id)
  {
    var quest = await Context.Quests.FindAsync(id);
    if (quest == null)
    {
      return NotFound();
    }

    Context.Quests.Remove(quest);
    await Context.SaveChangesAsync();

    return NoContent();
  }

  private async Task<string?> ValidateQuestRequest(CreateQuestRequest request)
  {
    var leader = await Context.Members.FindAsync(request.LeaderId);
    if (leader == null)
    {
      return "The specified leader does not exist.";
    }

    if (request.CreatureId.HasValue)
    {
      var creature = await Context.Creatures.FindAsync(request.CreatureId.Value);
      if (creature == null)
      {
        return "The specified creature does not exist.";
      }

      if (creature.Dangerous && !leader.Trained)
      {
        return "A quest against a dangerous creature needs a trained leader.";
      }
    }

    return null;
  }

}
