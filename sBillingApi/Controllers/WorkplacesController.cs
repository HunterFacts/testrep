using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using sBillingApi;
using sBillingApi.Models;
using Z.EntityFramework.Plus;

namespace sBillingApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkplacesController : ControllerBase
    {
        private readonly TaranScrmContext _context;

        public WorkplacesController(TaranScrmContext context)
        {
            _context = context;
        }

        // GET: api/Workplaces
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Workplace>>> GetWorkplace([FromQuery] string request)
        {
            return await _context.Workplace.ToListAsync();
        }

        // GET: api/Workplaces/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Workplace>> GetWorkplace(Guid id)
        {
            var workplace = //await _context.Workplace.FindAsync(id);
                await _context.Workplace.
                IncludeFilter(x => x.Employee.Where(x=>x.UserNavigation.Role == "manager" || x.UserNavigation.Role == "admin"))
                .IncludeFilter(i => i.House).FirstOrDefaultAsync(i => i.Id == id);

            if (workplace == null)
            {
                return NotFound();
            }
            //await _context.Entry(workplace).Collection(i => i.Employee).LoadAsync();
            return workplace;
        }

        [HttpGet("getWorkplaceByUser")]
        public Workplace GetWorkplaceByUser(Guid id)
        {
            var employee = _context.Employee.Find(id);
            if (employee.Workplace != null)
            {
                return _context.Workplace.Where(x=>x.Id == employee.Workplace).FirstOrDefault();
            }
            return null;
        }

        [HttpPost("createWorkplace")]
        public Guid CreateWorkplace(object source)
        {
            var definition = new { name = new string(""), idEmployee = new Guid() };
            var sourceDict = JsonConvert.DeserializeAnonymousType(source.ToString(), definition);
            var newWorkplace = new Workplace() { 
                Id = Guid.NewGuid(),
                Name = sourceDict.name
            };

            _context.Workplace.Add(newWorkplace);

            _context.Employee.Where(x => x.Id == sourceDict.idEmployee).FirstOrDefault().Workplace = newWorkplace.Id;

            _context.SaveChanges();

            return newWorkplace.Id;
        }

        // PUT: api/Workplaces/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWorkplace(Guid id, Workplace workplace)
        {
            workplace.Id = id;
            if (id != workplace.Id)
            {
                return BadRequest();
            }

            _context.Entry(workplace).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WorkplaceExists(id))
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

        // POST: api/Workplaces
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Workplace>> PostWorkplace(Workplace workplace)
        {
            _context.Workplace.Add(workplace);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (WorkplaceExists(workplace.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetWorkplace", new { id = workplace.Id }, workplace);
        }

        // DELETE: api/Workplaces/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Workplace>> DeleteWorkplace(Guid id)
        {
            var workplace = await _context.Workplace.FindAsync(id);
            if (workplace == null)
            {
                return NotFound();
            }

            _context.Workplace.Remove(workplace);
            await _context.SaveChangesAsync();

            return workplace;
        }

        private bool WorkplaceExists(Guid id)
        {
            return _context.Workplace.Any(e => e.Id == id);
        }
    }
}
