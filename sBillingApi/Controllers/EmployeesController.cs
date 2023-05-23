using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using sBillingApi;
using sBillingApi.Helpers;
using sBillingApi.Models;

namespace sBillingApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly TaranScrmContext _context;

        public EmployeesController(TaranScrmContext context)
        {
            _context = context;
        }

        // GET: api/Employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployee(
            string workplace = null, 
            string house = null, 
            string notIds = null,
            string role = null,
            string nonEmployee = null)
        {
            if (workplace != null)
            {
                Guid workplaceGuid = new Guid(workplace);
                if (nonEmployee != null)
                {
                    var nonEmployeeGuid = new Guid(nonEmployee);
                    return await _context.Employee.Where(
                    x => (x.Workplace == workplaceGuid
                    || x.HouseNavigation.Workplace == workplaceGuid) && x.Actuality == true && nonEmployeeGuid != x.Id)
                    .ToListAsync();
                }
                return await _context.Employee.Where(
                    x => (x.Workplace == workplaceGuid
                    || x.HouseNavigation.Workplace == workplaceGuid) && x.Actuality == true)
                    .ToListAsync();
            }
            if (house != null)
            {
                Guid houseGuid = new Guid(house);
                if (role == "model")
                {
                    if (notIds != null)
                    {
                        var ids = notIds.Split(',');
                        return await _context.Employee.Where(
                        x => x.House == houseGuid && x.UserNavigation.Role == role && !ids.Contains(x.Id.ToString()) && x.Actuality == true)
                        .ToListAsync();
                    }
                    return await _context.Employee.Where(
                    x => x.House == houseGuid && x.UserNavigation.Role == role && x.Actuality == true)
                    .ToListAsync();
                }
                else
                {
                    return await _context.Employee.Where(
                    x => x.House == houseGuid && x.Actuality == true)
                    .ToListAsync();
                }
            }
            return await _context.Employee.ToListAsync();
        }

        // GET: api/Employees/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(Guid id)
        {
            try
            {
                string[] includes = Request.Query["include[]"].ToString().Split(',');

            }
            catch (Exception ex)
            {}
            
            var employee = await _context.Employee.FindAsync(id);

            if (employee == null)
            {
                return NotFound();
            }

            return employee;
        }

        // POST: api/addEmployeeToWorkplace
        [HttpPost("addEmployeeToWorkplace")]
        public ActionResult AddEmployeeToWorkplace(object source)
        {
            try
            {
                var definition = new { login = new string(""), workplace = new Guid() };
                var sourceDict = JsonConvert.DeserializeAnonymousType(source.ToString(), definition);
                var person = _context.Person.Where(x => x.Login == sourceDict.login && (x.Role == Constants.adminRole || x.Role == Constants.managerRole) && x.Actuality == true).FirstOrDefault();
                var employee = _context.Employee.Where(x => x.User == person.Id && x.Actuality == true).FirstOrDefault();

                if (employee != null)
                {
                    employee.Workplace = sourceDict.workplace;
                    _context.SaveChanges();
                } 
                else
                {
                    throw new Exception();
                }

                return Ok();
            }
            catch(Exception ex)
            {
                throw new Exception("Сотрудник не найден");
            }
        }

        // PUT: api/Employees/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployee(Guid id, Employee employee)
        {
            employee.Id = id;
            if (id != employee.Id)
            {
                return BadRequest();
            }

            _context.Entry(employee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Employees
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Employee>> PostEmployee(Employee employee)
        {
            _context.Employee.Add(employee);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (EmployeeExists(employee.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetEmployee", new { id = employee.Id }, employee);
        }

        // DELETE: api/Employees/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Employee>> DeleteEmployee(Guid id)
        {
            var employee = await _context.Employee.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            employee.Actuality = false;

            var person = await _context.Person.FindAsync(employee.User);
            
            if (person != null)
            {
                if (person.Role == Constants.adminRole || person.Role == Constants.managerRole)
                {
                    return NotFound();
                }
                else
                {
                    person.Actuality = false;
                }
            }
            
            await _context.SaveChangesAsync();

            return employee;
        }

        private bool EmployeeExists(Guid id)
        {
            return _context.Employee.Any(e => e.Id == id);
        }
    }
}
