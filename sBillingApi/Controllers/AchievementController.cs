using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sBillingApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace sBillingApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AchievementController : ControllerBase
    {
        private readonly TaranScrmContext _context;
        public AchievementController(TaranScrmContext context)
        {
            _context = context;
        }

        [HttpGet("GetAll")]
        public async Task<ActionResult<ICollection<Achievement>>> GetAllAchievement()
        {
            return await _context.Achievement.ToListAsync();
        }

        [HttpGet("GetEmployeeAchievement")]
        public async Task<ActionResult<ICollection<AchievementOnEmployee>>> GetPersonAchievement(string employee)
        {
            if (employee != null)
            {
                var employeeGuid = new Guid(employee);
                return await _context.AchievementOnEmployee.Where(x => x.Employee == employeeGuid).ToListAsync();
            }
            return BadRequest();
        }

        // GET: api/saveAchievementEmployee
        [HttpGet("saveAchievementEmployee")]
        public AchievementOnEmployee saveAchievementEmployee(string employee, string achievement)
        {
            try
            {
                var employeeGuid = new Guid(employee);
                var achievementGuid = new Guid(achievement);
                var ach = new AchievementOnEmployee
                {
                    Id = Guid.NewGuid(),
                    Employee = employeeGuid,
                    Achievement = achievementGuid,
                    Date = DateTime.Now
                };

                _context.AchievementOnEmployee.Add(ach);
                _context.SaveChanges();

                return ach;
            }
            catch (Exception ex)
            {
                throw new Exception("Ошибка сохранения ачивки за сотрудником");
            }
        }

        // GET: api/deleteAchievementEmployee
        [HttpGet("deleteAchievementEmployee")]
        public ActionResult deleteAchievementEmployee(string achievementEmployee)
        {
            try
            {

                var achievementEmployeeGuid = new Guid(achievementEmployee);
                _context.AchievementOnEmployee.DeleteByKey(achievementEmployeeGuid);
                _context.SaveChanges();

                return Ok();
            }
            catch (Exception ex)
            {
                throw new Exception("Ошибка удаления ачивки за сотрудником");
            }
        }

    }
}
