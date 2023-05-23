using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace sBillingApi
{
    public class AuthOptions
    {
        public const string ISSUER = "SBillingAuth"; // издатель токена
        public const string AUDIENCE = "SBillingFront"; // потребитель токена
        const string KEY = "mysupersecret_sbilling_secretkey!123";   // ключ для шифрации
        public const int LIFETIME = 240; // время жизни токена - 1 минута
        public static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
        }
    }
}
