using Dapper;
using Practica2023Business.Contracts;
using Practica2023Business.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Practica2023Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly IConnectionString connectionString;

        public UserRepository(IConnectionString connectionString)
        {
            this.connectionString = connectionString;
        }

        public User GetByUsername(string username)
        {
            using var db = new SqlDataContext(connectionString);
            var sql = @"SELECT [UserId], [Username], [Password], [Role] FROM [dbo].[User]
                    WHERE [Username] = @username";

            return db.Connection.QuerySingleOrDefault<User>(sql, new { username });
        }

        public bool Insert(User user)
        {
            using var db = new SqlDataContext(connectionString);
            var sql = @"INSERT INTO [dbo].[User] ([Username], [Password], [Role])
                    VALUES (@Username, @Password, @Role)";
            return db.Connection.Execute(sql, new { user.Username, user.Password, user.Role }) > 0;
        }
    }
}
