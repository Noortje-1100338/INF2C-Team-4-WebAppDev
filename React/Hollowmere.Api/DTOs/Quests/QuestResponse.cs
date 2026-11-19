using Hollowmere.Api.Models;

namespace Hollowmere.Api.DTOs;

public class QuestResponse
{
  public int Id { get; set; }
  public int LeaderId { get; set; }
  public string Village { get; set; } = string.Empty;
  public string AreaDescription { get; set; } = string.Empty;
  public int? CreatureId { get; set; }
  public string DepartureDate { get; set; } = string.Empty;
  public int DurationDays { get; set; }
  public int PartySize { get; set; }
  public bool Cancelled { get; set; }
  public List<QuestRequestResponse> Requests { get; set; } = new();

  public static QuestResponse FromEntity(Quest quest) => new()
  {
    Id = quest.Id,
    LeaderId = quest.LeaderId,
    Village = quest.Village,
    AreaDescription = quest.AreaDescription,
    CreatureId = quest.CreatureId,
    DepartureDate = quest.DepartureDate,
    DurationDays = quest.DurationDays,
    PartySize = quest.PartySize,
    Cancelled = quest.Cancelled,
    Requests = quest.Requests
      .Select(request => new QuestRequestResponse
      {
        Id = request.Id,
        MemberId = request.MemberId,
        Confirmed = request.Confirmed
      })
      .ToList()
  };
}

public class QuestRequestResponse
{
  public int Id { get; set; }
  public int MemberId { get; set; }
  public bool Confirmed { get; set; }
}
