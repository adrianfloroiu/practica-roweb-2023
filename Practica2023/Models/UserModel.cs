using Practica2023Business.Domain;

namespace Practica2023.Models
{
    public class UserModel
    {
        public UserModel() { }

        public UserModel(User entity)
        {
            UserId = entity.UserId;
            Username = entity.Username;
            Password = entity.Password;
            Role = entity.Role;
        }

        public int UserId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } = "User";
    }
}
