using Practica2023Business.Domain;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Practica2023.Models
{
    public class ProductModel
    {
        public ProductModel()
        {

        }

        [JsonConstructor]
        public ProductModel(int categoryId, string name, string description, decimal price, string imageName, IFormFile imageFile)
        {
            CategoryId = categoryId;
            Name = name;
            Description = description;
            Price = price;
            ImageName = imageName;
            ImageFile = imageFile;
        }

        public ProductModel(Product entity)
        {
            ProductId = entity.ProductId;
            CategoryId = entity.CategoryId;
            Name = entity.Name;
            Description = entity.Description;
            Price = entity.Price;
            ImageName = entity.ImageName;
            ImageFile = null;
        }

        public int ProductId { get; set; }
        public int CategoryId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; } = 0;
        public string ImageName { get; set; }
        public IFormFile? ImageFile { get; set; }
    }
}
