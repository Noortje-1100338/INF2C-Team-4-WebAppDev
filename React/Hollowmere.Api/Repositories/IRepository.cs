using System.Linq.Expressions;
using Hollowmere.Api.Models;

namespace Hollowmere.Api.Repositories;

public interface IRepository<T> where T : Class, IEntity
{
    Task<List> GetAllAsync(params Expression<Func<T, object>>[] includes);
    Task<T?> GetIdByAsync(int id, params Expression<Func<T, object>>[] includes);

    void Add(T entity);
    void Update(T entity);
    void Delete(T entity);

    Task<int> SaveChangesAsync();
}



