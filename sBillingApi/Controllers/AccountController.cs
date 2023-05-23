using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using sBillingApi.Helpers;
using sBillingApi.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text.Json;

namespace sBillingApi.Controllers
{
    [ApiController]
    public class AccountController : ControllerBase
    {

        private readonly TaranScrmContext _context;

        public AccountController(TaranScrmContext context)
        {
            _context = context;
        }

        [HttpPost("/api/token-auth")]
        public IActionResult Token([FromBody] JObject credentials)

        {
            string json = System.Text.Json.JsonSerializer.Serialize(credentials.ToString());
            User Usercredentials = JsonConvert.DeserializeObject<User>(credentials.ToString());
            HistoryAuth historyAuth = new HistoryAuth();
            historyAuth.Id = Guid.NewGuid();

            IPAddress remoteIpAddress = Request.HttpContext.Connection.RemoteIpAddress;
            if (remoteIpAddress != null)
            {
                // If we got an IPV6 address, then we need to ask the network for the IPV4 address 
                // This usually only happens when the browser is on the same machine as the server.
                if (remoteIpAddress.AddressFamily == System.Net.Sockets.AddressFamily.InterNetworkV6)
                {
                    remoteIpAddress = System.Net.Dns.GetHostEntry(remoteIpAddress).AddressList
            .First(x => x.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork);
                }
                historyAuth.IpAddress = remoteIpAddress.ToString();
            }

            if (historyAuth.IpAddress != "26.40.166.113" || historyAuth.IpAddress != null)
            {
                historyAuth = GetUserCountryByIp(historyAuth);
            }
            

            var username = Usercredentials.identification;
            var password = MD5Helper.CreateMD5(Usercredentials.password);
            Person person = null;
            Employee employee = null;
            Workplace workplace = null;
            House house = null;

            historyAuth.Device = Request.Headers["User-Agent"].ToString();
            historyAuth.Login = username;
            historyAuth.Date = DateTime.Now;

            person = GetUserByCredentials(username, password);
            if (person != null)
            {
                employee = GetEmployeeByUser(person);
            }
            else
            {
                string errorText = "Неверный пользователь или пароль";
                historyAuth.Status = errorText;
                _context.HistoryAuth.Add(historyAuth);
                _context.SaveChanges();

                return BadRequest(new { errorText = errorText });
            }
            if (employee == null)
            {
                string errorText = "К указанному пользователю не прикреплен сотрудник";
                historyAuth.Status = errorText;
                _context.HistoryAuth.Add(historyAuth);
                _context.SaveChanges();

                return BadRequest(new { errorText = errorText });
            }

            workplace = GetWorkplaceByUser(employee);
            house = GetHouseByUser(employee);

            var identity = GetIdentity(person);

            var now = DateTime.UtcNow;
            // создаем JWT-токен
            var jwt = new JwtSecurityToken(
                    issuer: AuthOptions.ISSUER,
                    audience: AuthOptions.AUDIENCE,
                    notBefore: now,
                    claims: identity.Claims,
                    expires: now.Add(TimeSpan.FromMinutes(AuthOptions.LIFETIME)),
                    signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
            string workplaceId = workplace == null ? null : workplace.Id.ToString();
            string houseId = house == null ? null : house.Id.ToString();
            var response = new
            {
                access_token = encodedJwt,
                username = identity.Name,
                userId = person.Id,
                employee = employee.Id,
                workplace = workplaceId,
                role = MD5Helper.CreateMD5(person.Role + "SecurityTheBest"),
                house = houseId
            };

            historyAuth.Employee = employee.Id;
            historyAuth.Status = "Авторизован";
            _context.HistoryAuth.Add(historyAuth);
            _context.SaveChanges();

            return Content(JsonConvert.SerializeObject(response));
        }

        private static HistoryAuth GetUserCountryByIp(HistoryAuth historyAuth)
        {
            IpInfo ipInfo = new IpInfo();
            try
            {
                string info = new WebClient().DownloadString("http://ipinfo.io/" + historyAuth.IpAddress + "?token=bc8d10bc88985b");
                ipInfo = JsonConvert.DeserializeObject<IpInfo>(info);
                RegionInfo myRI1 = new RegionInfo(ipInfo.Country);
                ipInfo.Country = myRI1.EnglishName;

                historyAuth.Country = ipInfo.Country;
                historyAuth.Digitaltrace = "loc: " + ipInfo.Loc + " | city: " + ipInfo.City;
            }
            catch (Exception)
            {}

            return historyAuth;
        }

        [HttpPost("/api/change-password")]
        public OkResult CreateWorkplace(object source)
        {
            var definition = new { password = new string(""), employee = new Guid() };
            var sourceDict = JsonConvert.DeserializeAnonymousType(source.ToString(), definition);

            var employee = _context.Employee.Where(x=>x.Id == sourceDict.employee && x.Actuality == true).First();

            var user = _context.Person.Where(x=>x.Id == employee.User && x.Actuality == true).First();

            user.Password = MD5Helper.CreateMD5(sourceDict.password);

            _context.SaveChanges();

            return Ok();
        }

        private Person GetUserByCredentials (string username, string password)
        {
            return _context.Person.Where(x => x.Login == username && x.Password == password && x.Actuality == true).FirstOrDefault();
        }

        private Employee GetEmployeeByUser(Person person)
        {
            return _context.Employee.Where(x=>x.User == person.Id && x.Actuality == true).FirstOrDefault();
        }

        private Workplace GetWorkplaceByUser(Employee employee)
        {
            var workplace = _context.Workplace.Where(x => x.Id == employee.Workplace).FirstOrDefault();
            if (workplace == null)
            {
                var house = _context.House.Where(x => x.Id == employee.House).FirstOrDefault();
                if (house == null)
                {
                    return null;
                }
                return _context.Workplace.Where(x => x.Id == house.Workplace).FirstOrDefault();
            }
            return workplace;
        }

        private House GetHouseByUser(Employee employee)
        {
            return _context.House.Where(x => x.Id == employee.House).FirstOrDefault();
        }

        private ClaimsIdentity GetIdentity(Person person)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, person.Login),
                new Claim(ClaimsIdentity.DefaultRoleClaimType, person.Role)
            };
            ClaimsIdentity claimsIdentity =
            new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType,
                ClaimsIdentity.DefaultRoleClaimType);
            return claimsIdentity;
        }

        public class IpInfo
        {
            [JsonProperty("ip")]
            public string Ip { get; set; }

            [JsonProperty("hostname")]
            public string Hostname { get; set; }

            [JsonProperty("city")]
            public string City { get; set; }

            [JsonProperty("region")]
            public string Region { get; set; }

            [JsonProperty("country")]
            public string Country { get; set; }

            [JsonProperty("loc")]
            public string Loc { get; set; }

            [JsonProperty("org")]
            public string Org { get; set; }

            [JsonProperty("postal")]
            public string Postal { get; set; }
        }
    }
}
