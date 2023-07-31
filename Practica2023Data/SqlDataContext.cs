using Practica2023Business.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using Microsoft.Data.SqlClient;

namespace Practica2023Data
{
    public class SqlDataContext : IDisposable
    {
        public SqlConnection Connection { get; }

        public SqlDataContext(IConnectionString connectionString)
        {
            Connection = new SqlConnection(connectionString.SqlConnectionString);
            Connection.Open();
        }

        public void Dispose()
        {
            if (Connection == null)
            {
                return;
            }
            Connection.Close();
            Connection.Dispose();
        }
    }
}
