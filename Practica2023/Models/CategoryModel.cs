using Practica2023Business.Domain;
using System.Text.Json.Serialization;

namespace Practica2023.Models
{
    public class CategoryModel
    {
        [JsonConstructor]
        public CategoryModel(string name, string description)
        {
            Name = name;
            Description = description;
        }

        public CategoryModel(Category entity)
        {
            CategoryId = entity.CategoryId;
            Name = entity.Name;
            Description = entity.Description;
        }

        public int CategoryId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
