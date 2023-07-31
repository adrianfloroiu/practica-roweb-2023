using Practica2023Business.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Practica2023Business.Contracts
{
    public interface ICategoryRepository
    {
        List<Category> GetAll(int offset, int limit);
        int GetCount();
        Category GetById(int id);
        bool Insert(Category category);
        bool Update(Category category);
        bool Delete(int id);
    }
}
