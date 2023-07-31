using Practica2023Business.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Practica2023Business.Contracts
{
    public interface IProductRepository
    {
        List<Product> GetAll(int offset, int limit);
        int GetCount();
        List<Product> GetByCategory(int categoryId, string searchTerm, string orderType, int offset, int limit);
        int GetCountByCategory(int categoryId, string searchTerm);
        Product GetById(int id);
        int GetLastProductId();
        bool Insert(Product product);
        bool Update(Product product);
        bool Delete(int id);
    }
}
