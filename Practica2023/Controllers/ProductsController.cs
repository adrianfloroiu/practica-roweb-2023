using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Practica2023.Models;
using Practica2023Business.Contracts;
using Practica2023Business.Domain;
using Practica2023Data.Repositories;
using System.Data;

namespace Practica2023.Controllers
{
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository productRepository;
        private readonly IWebHostEnvironment webHostEnvironment;

        public ProductsController(IProductRepository productRepository, IWebHostEnvironment webHostEnvironment)
        {
            this.productRepository = productRepository;
            this.webHostEnvironment = webHostEnvironment;
        }

        [HttpGet("api/products/{offset?}/{limit?}")]
        public List<ProductModel> Get([FromRoute] int offset = 0, [FromRoute] int limit = 100)
        {
            var products = productRepository.GetAll(offset, limit);
            return products.Select(x => new ProductModel(x)).ToList();
        }

        [HttpGet("api/products/count")]
        public ActionResult<int> GetCount()
        {
            var numberOfProducts = productRepository.GetCount();

            return Ok(numberOfProducts);
        }

        [HttpGet("api/products/{categoryId}/{searchTerm?}/{orderType?}/{offset?}/{limit?}")]
        public List<ProductModel> GetByCategory([FromRoute] int categoryId, [FromRoute] string searchTerm = "", [FromRoute] string orderType = "", [FromRoute] int offset = 0, [FromRoute] int limit = 100)
        {
            var products = productRepository.GetByCategory(categoryId, searchTerm, orderType, offset, limit);
            return products.Select(x => new ProductModel(x)).ToList();
        }

        [HttpGet("api/products/count/{categoryId}/{searchTerm?}")]
        public ActionResult<int> GetCountByCategory([FromRoute] int categoryId, [FromRoute] string searchTerm = "")
        {
            var numberOfProducts = productRepository.GetCountByCategory(categoryId, searchTerm);

            return Ok(numberOfProducts);
        }

        [HttpGet("api/products/{id}")]
        public ActionResult<ProductModel> Get(int id)
        {
            var product = productRepository.GetById(id);

            if (product == null)
            {
                return NotFound();
            }

            var productModel = new ProductModel(product);
            return Ok(productModel);
        }

        [HttpPost("api/products")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Insert([FromForm] ProductModel productModel)
        {
            string? finalImageName = null;

            if (productModel == null)
            {
                return BadRequest("Invalid data");
            }

            if (productModel.ImageFile is not null)
            {
                var fileId = Guid.NewGuid();
                finalImageName = fileId + "_" + productModel.ImageName;
                string imagePath = Path.Combine(webHostEnvironment.WebRootPath, "images", finalImageName);

                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await productModel.ImageFile.CopyToAsync(stream);
                }
            }

            var product = new Product
            {
                CategoryId = productModel.CategoryId,
                Name = productModel.Name,
                Description = productModel.Description,
                Price = productModel.Price,
                ImageName = finalImageName ?? productModel.ImageName
            };

            var isSuccess = productRepository.Insert(product);

            if (isSuccess)
            {
                return Ok(true);
            }
            else
            {
                return StatusCode(500, false);
            }
        }

        [HttpPut("/api/products/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromForm] ProductModel productModel)
        {
            var existingProduct = productRepository.GetById(id);
            string? finalImageName = null;

            if (existingProduct == null)
            {
                return NotFound();
            }

            existingProduct.CategoryId = productModel.CategoryId;
            existingProduct.Name = productModel.Name;
            existingProduct.Description = productModel.Description;
            existingProduct.Price = productModel.Price;
            
            if (productModel.ImageFile is not null)
            {
                var fileId = Guid.NewGuid();
                finalImageName = fileId + "_" + productModel.ImageName;
                string imagePath = Path.Combine(webHostEnvironment.WebRootPath, "images", finalImageName);

                if (!string.IsNullOrEmpty(existingProduct.ImageName))
                {
                    string oldImagePath = Path.Combine(webHostEnvironment.WebRootPath, "images", existingProduct.ImageName);
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await productModel.ImageFile.CopyToAsync(stream);
                }

                existingProduct.ImageName = finalImageName ?? productModel.ImageName;
            }

            var isUpdated = productRepository.Update(existingProduct);

            if (isUpdated)
            {
                return Ok(true);
            }
            else
            {
                return StatusCode(500, false);
            }
        }

        [HttpDelete("api/products/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Delete(int id)
        {
            var existingProduct = productRepository.GetById(id);
            
            if (existingProduct == null)
            {
                return NotFound();
            }

            if (existingProduct.ImageName != "no_image")
            {
                string imagePath = Path.Combine(webHostEnvironment.WebRootPath, "images", existingProduct.ImageName);
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

            var isDeleted = productRepository.Delete(id);

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
