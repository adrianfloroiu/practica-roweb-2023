using Microsoft.Extensions.DependencyInjection;
using Practica2023Business.Contracts;
using Practica2023Business.Services;
using Practica2023Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Practica2023Data
{
    public static class DataConfig
    {
        public static void ApplyDataServices(this IServiceCollection services)
        {
            services.AddTransient<ICategoryRepository, CategoryRepository>();
            services.AddTransient<IProductRepository, ProductRepository>();
            services.AddTransient<IUserRepository, UserRepository>();
            services.AddTransient<ITokenService, TokenService>();
        }
    }
}
