using System.Linq.Expressions;
using Hollowmere.Api.Data;
using Hollowmere.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Hollowmere.Api.Repositories;

public class Repository<T> : IRepository<T> where T : class, IEntity
{
    private readonly AppDbContext _context;

    public Repository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<T>> GetAllAsync(params Expression<Func<T, object>>[] includes)
    {
        IQueryable<T> query = _context.Set<T>();
        foreach (var include in includes)
            query = query.Include(include);
        return await query.ToListAsync();        
    }

    public async Task<T?> GetIdByAsync(int id, params Expression<Func<T, object>>[] includes)
    {
        IQueryable<T> query = _context.Set<T>();
        foreach (var include in includes)
            query = query.Include(include);
        return await query.FirstOrDefaultAsync(e => e.Id == id);
    }

    public void Add(T entity) => _context.Set<T>().Add(entity);
    public void Update(T entity) => _context.Set<T>().Update(entity);
    public void Delete(T entity) => _context.Set<T>().Remove(entity);

    public Task<int> SaveChangesAsync() => _context.SaveChangesAsync();


}