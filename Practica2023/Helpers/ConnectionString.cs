using Practica2023Business.Contracts;

namespace Practica2023.Helpers
{
    public class ConnectionString : IConnectionString
    {
        public ConnectionString(string connectionString)
        {
            SqlConnectionString = connectionString;
        }

        public string SqlConnectionString { get; private set; }
    }
}
