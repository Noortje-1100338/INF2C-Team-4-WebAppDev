

using Hollowmere.Api.Data;
using Microsoft.AspNetCore.Mvc;

namespace Hollowmere.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestController : BaseController
{

  public QuestController(AppDbContext context) : base(context)
  { }

  [HttpGet]
  public IActionResult GetQuests()
  {
    var quests = Context.Quests.ToList();
    return Ok(quests);
  }

  [HttpGet("{id}")]
  public async Task<ActionResult> GetQuest(int id)
  {
    var quest = await Context.Quests.FindAsync(id);

    if (quest == null)
    {
      return NotFound();
    }

    return Ok(quest);
  }
}