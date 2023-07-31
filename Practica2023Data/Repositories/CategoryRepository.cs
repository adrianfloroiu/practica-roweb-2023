using Dapper;
using Microsoft.IdentityModel.Tokens;
using Practica2023Business.Contracts;
using Practica2023Business.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Practica2023Data.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly IConnectionString connectionString;

        public CategoryRepository(IConnectionString connectionString)
        {
            this.connectionString = connectionString;
        }

        public List<Category> GetAll(int offset, int limit)
        {
            using var db = new SqlDataContext(connectionString);
            var sql = @"SELECT [CategoryId], [Name], [Description] FROM [dbo].[Category]
                    order by CategoryId
                    OFFSET @offset ROWS
                    FETCH NEXT @limit ROWS ONLY";
            return db.Connection.Query<Category>(sql, new { offset, limit }).ToList();
        }

        public int GetCount()
        {
            using var db = new SqlDataContext(connectionString);
            var sql = "SELECT COUNT(*) FROM [dbo].[Category]";
            return db.Connection.ExecuteScalar<int>(sql);
        }

        public Category GetById(int id)
        {
            using var db = new SqlDataContext(connectionString);
            var sql = @"SELECT [CategoryId], [Name], [Description] FROM [dbo].[Category]
                    WHERE [CategoryId] = @id";

            return db.Connection.QuerySingleOrDefault<Category>(sql, new { id });
        }

        public bool Insert(Category category)
        {
            using var db = new SqlDataContext(connectionString);
            var sql = @"INSERT INTO [dbo].[Category] ([Name], [Description])
                    VALUES (@Name, @Description)";
            return db.Connection.Execute(sql, new { category.Name, category.Description }) > 0;
        }

        public bool Update(Category category)
        {
            using var db = new SqlDataContext(connectionString);
            var sql = @"UPDATE [dbo].[Category]
                    SET [Name] = @Name, [Description] = @Description
                    WHERE CategoryId = @CategoryId";
            return db.Connection.Execute(sql, category) > 0;
        }

        public bool Delete(int id)
        {
            using var db = new SqlDataContext(connectionString);
            var sql = @"DELETE FROM [dbo].[Category] WHERE CategoryId = @id";
            return db.Connection.Execute(sql, new { id }) > 0;
        }
    }
}