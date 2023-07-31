using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Practica2023.Models;
using Practica2023Business.Contracts;
using Practica2023Business.Domain;

namespace Practica2023.Controllers
{
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryRepository categoryRepository;

        public CategoriesController(ICategoryRepository categoryRepository)
        {
            this.categoryRepository = categoryRepository;
        }

        [HttpGet("api/categories/{offset?}/{limit?}")]
        public List<CategoryModel> Get([FromRoute] int offset = 0, [FromRoute] int limit = 100)
        {
            var categories = categoryRepository.GetAll(offset, limit);
            return categories.Select(x => new CategoryModel(x)).ToList();
        }

        [HttpGet("api/categories/count")]
        public ActionResult<int> GetCount()
        {
            var numberOfCategories = categoryRepository.GetCount();

            return Ok(numberOfCategories);
        }

        [HttpGet("api/categories/{id}")]
        public ActionResult<CategoryModel> Get(int id)
        {
            var category = categoryRepository.GetById(id);

            if (category == null)
            {
                return NotFound("Category not found");
            }
            
            var categoryModel = new CategoryModel(category);
            return Ok(categoryModel);
        }

        [HttpPost("api/categories")]
        [Authorize(Roles = "Admin")]
        public IActionResult Insert([FromBody] CategoryModel categoryModel)
        {
            if (categoryModel == null)
            {
                return BadRequest("Invalid data");
            }

            var category = new Category
            {
                Name = categoryModel.Name,
                Description = categoryModel.Description
            };

            var isSuccess = categoryRepository.Insert(category);

            if (isSuccess)
            {
                return Ok(true);
            }
            else
            {
                return StatusCode(500, false);
            }
        }

        [HttpPut("/api/categories/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Update(int id, [FromBody] CategoryModel categoryModel)
        {
            var existingCategory = categoryRepository.GetById(id);

            if (existingCategory == null)
            {
                return NotFound();
            }

            existingCategory.Name = categoryModel.Name;
            existingCategory.Description = categoryModel.Description;

            var isUpdated = categoryRepository.Update(existingCategory);

            if (isUpdated)
            {
                return Ok(true);
            }
            else
            {
                return StatusCode(500, false);
            }
        }

        [HttpDelete("api/categories/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Delete(int id)
        {
            var existingCategory = categoryRepository.GetById(id);

            if (existingCategory == null)
            {
                return NotFound();
            }

            var isDeleted = categoryRepository.Delete(id);

            if (isDeleted)
            {
                return Ok(true);
            }
            else
            {
                return StatusCode(500, false);
            }
        }
    }
}
