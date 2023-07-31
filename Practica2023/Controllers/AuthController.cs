using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Practica2023.Models;
using Practica2023Business.Contracts;
using Practica2023Business.Domain;
using Practica2023Data.Repositories;
using System.Net;

namespace Practica2023.Controllers
{
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository userRepository;
        private readonly ITokenService tokenService;

        public AuthController(IUserRepository userRepository, ITokenService tokenService)
        {
            this.userRepository = userRepository;
            this.tokenService = tokenService;
        }

        [HttpPost("api/auth/register")]
        public IActionResult Register([FromBody] UserModel userModel)
        {
            if (userModel == null)
            {
                return BadRequest("Invalid data");
            }

            var existingUser = userRepository.GetByUsername(userModel.Username);

            if (existingUser != null)
            {
                return BadRequest("This username already exists");
            }

            var user = new User
            {
                Username = userModel.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(userModel.Password),
                Role = "User"
            };

            var isSuccess = userRepository.Insert(user);

            if (isSuccess)
            {
                return Ok(true);
            }
            else
            {
                return StatusCode(500, false);
            }
        }

        [HttpPost("api/auth/login")]
        public IActionResult Login([FromBody] UserModel userModel)
        {
            if (userModel == null)
            {
                return BadRequest("Invalid data");
            }

            var user = userRepository.GetByUsername(userModel.Username);

            if (user is null)
            {
                return BadRequest("User not found");
            }

            if (!BCrypt.Net.BCrypt.Verify(userModel.Password, user.Password))
            {
                return BadRequest("Wrong password");
            }

            var token = tokenService.CreateToken(user);

            var response = new
            {
                username = user.Username,
                role = user.Role,
                token
            };

            return Ok(response);
        }
    }
}
