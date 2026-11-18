using Hollowmere.Api.Data;
using Microsoft.AspNetCore.Mvc;

public class BaseController : ControllerBase
{
  protected readonly AppDbContext Context;


  public BaseController(
      AppDbContext context)

  {
    Context = context;
  }
}