using Practica2023Business.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Practica2023Business.Contracts
{
    public interface IUserRepository
    {
        User GetByUsername(string username);
        bool Insert(User user);
    }
}
