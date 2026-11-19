using System.ComponentModel.DataAnnotations;

namespace Hollowmere.Api.DTOs;

public class CreateQuestRequest
{
    [Range(1, int.MaxValue)]
    public int LeaderId { get; set; }

    [Required]
    public string Village { get; set; } = string.Empty;

    [Required]
    public string AreaDescription { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int? CreatureId { get; set; }

    [Required]
    public DateOnly? DepartureDate { get; set; }

    [Range(1, int.MaxValue)]
    public int DurationDays { get; set; }

    [Range(1, int.MaxValue)]
    public int PartySize { get; set; }
}
