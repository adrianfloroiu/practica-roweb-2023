using Dapper;
using Microsoft.IdentityModel.Tokens;
using Practica2023Business.Contracts;
using Practica2023Business.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Practica2023Data.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly IConnectionString connectionString;

        public ProductRepository(IConnectionString connectionString)
        {
            this.connectionString = connectionString;
        }

        public List<Product> GetAll(int offset, int limit)
        {
            using var db = new SqlDataContext(connectionString);
            var sql = @"SELECT [ProductId], [CategoryId], [Name], [Description], [Price], [ImageName] FROM [dbo].[Product]
                    order by ProductId
                    OFFSET @offset ROWS
                    FETCH NEXT @limit ROWS ONLY";
            return db.Connection.Query<Product>(sql, new { offset, limit }).ToList();
        }

        public int GetCount()
        {
            using var db = new SqlDataContext(connectionString);
            var sql = "SELECT COUNT(*) FROM [dbo].[Product]";
            return db.Connection.ExecuteScalar<int>(sql);
        }

        public List<Product> GetByCategory(int categoryId, string searchTerm, string orderType, int offset, int limit)
        {
            using var db = new SqlDataContext(connectionString);

            var orderClause = "ORDER BY ProductId";

            if (!string.IsNullOrEmpty(orderType))
            {
                if (orderType.ToLower() == "asc")
                {
                    orderClause = "ORDER BY Price ASC";
                }
                else if (orderType.ToLower() == "desc")
                {
                    orderClause = "ORDER BY Price DESC";
                }
            }
            var sql = $@"SELECT [ProductId], [CategoryId], [Name], [Description], [Price], [ImageName] 
                FROM [dbo].[Product]
                WHERE [CategoryId] = @categoryId
                AND [Name] LIKE '%' + @searchTerm + '%'
                {orderClause}
                OFFSET @offset ROWS
                FETCH NEXT @limit ROWS ONLY";
            return db.Connection.Query<Product>(sql, new { categoryId, searchTerm, orderType, offset, limit }).ToList();
        }

        public int GetCountByCategory(int categoryId, string searchTerm)
        {
            using var db = new SqlDataContext(connectionString);
            var sql = @"SELECT COUNT(*) FROM [dbo].[Product] WHERE [CategoryId] = @categoryId
                    AND [Name] LIKE '%' + @searchTerm + '%'";
            return db.Connection.ExecuteScalar<int>(sql, new { categoryId, searchTerm });
        }

        public Product GetById(int id)
        {
            using var db = new SqlDataContext(connectionString);
            var sql = @"SELECT [ProductId], [CategoryId], [Name], [Description], [Price], [ImageName] FROM [dbo].[Product]
                    WHERE [ProductId] = @id";

            return db.Connection.QuerySingleOrDefault<Product>(sql, new { id });
        }

        public int GetLastProductId()
        {
            using var db = new SqlDataContext(connectionString);
            var sql = "SELECT TOP 1 [ProductId] FROM [dbo].[Product] ORDER BY [ProductId] DESC";

            return db.Connection.QuerySingleOrDefault<int>(sql);
        }

        public bool Insert(Product product)
        {
            using var db = new SqlDataContext(connectionString);
            var sql = @"INSERT INTO [dbo].[Product] ([CategoryId], [Name], [Description], [Price], [ImageName])
                    VALUES (@CategoryId, @Name, @Description, @Price, @ImageName)";
            return db.Connection.Execute(sql, new { product.CategoryId, product.Name, product.Description, product.Price, product.ImageName }) > 0;
        }

        public bool Update(Product product)
        {
            using var db = new SqlDataContext(connectionString);
            var sql = @"UPDATE [dbo].[Product]
                    SET [CategoryId] = @CategoryId, [Name] = @Name, [Description] = @Description, [Price] = @Price, [ImageName] = @ImageName
                    WHERE ProductId = @ProductId";
            return db.Connection.Execute(sql, product) > 0;
        }

        public bool Delete(int id)
        {
            using var db = new SqlDataContext(connectionString);
            var sql = @"DELETE FROM [dbo].[Product] WHERE ProductId = @id";
            return db.Connection.Execute(sql, new { id }) > 0;
        }
    }
}