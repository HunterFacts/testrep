using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sBillingApi;
using sBillingApi.Models;

namespace sBillingApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkshiftsController : ControllerBase
    {
        private readonly TaranScrmContext _context;

        public WorkshiftsController(TaranScrmContext context)
        {
            _context = context;
        }

        // GET: api/Workshifts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Workshift>>> GetWorkshift(
            string house = null, 
            string employee = null, 
            string workplace = null,
            DateTime? date = null)
        {
            if (workplace != null)
            {
                var workplaceGuid = new Guid(workplace);
                return await _context.Workshift.Where(
                    x => x.HouseNavigation.Workplace == workplaceGuid).OrderByDescending(x => x.Date)
                    .ToListAsync();
            }
            
            if (house != null && employee != null)
            {
                Guid houseGuid = new Guid(house);
                Guid employeeGuid = new Guid(employee);
                return await _context.Workshift.Where(
                    x => x.House == houseGuid
                    && x.Responsible == employeeGuid).OrderByDescending(x=>x.Date)
                    .ToListAsync();
            }

            if (house != null && date != null)
            {
                var houseGuid = new Guid(house);
                return await _context.Workshift.Where(
                    x => x.House == houseGuid && date.Value.AddDays(-7) <= x.Date && date.Value.AddDays(7) >= x.Date).OrderByDescending(x => x.Date)
                    .ToListAsync();
            }
            return null;
        }

        // GET: api/Workshifts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Workshift>> GetWorkshift(Guid id)
        {
            try
            {
                Workshift workshift;
                workshift = await _context.Workshift
                    .Include(i => i.RoomOnWorkshift)
                        .ThenInclude(x => x.EmployeeOnWorkshift)
                    .FirstOrDefaultAsync(i => i.Id == id);
                if (workshift == null)
                {
                    return NotFound();
                }

                return workshift;
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
        }

        // PUT: api/Workshifts/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWorkshift(Guid id, Workshift workshift)
        {
            workshift.Id = id;
            if (id != workshift.Id)
            {
                return BadRequest();
            }

            _context.Entry(workshift).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WorkshiftExists(id))
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

        // POST: api/Workshifts
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<Workshift>> PostWorkshift(Workshift workshift)
        {
            _context.Workshift.Add(workshift);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (WorkshiftExists(workshift.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetWorkshift", new { id = workshift.Id }, workshift);
        }

        // DELETE: api/Workshifts/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Workshift>> DeleteWorkshift(Guid id)
        {
            var workshift = await _context.Workshift.FindAsync(id);
            if (workshift == null)
            {
                return NotFound();
            }

            var penaltyOnShifts = await _context.PenaltyOnShift.Where(x => x.Workshift == workshift.Id).ToListAsync();
            foreach (var penaltyOnShift in penaltyOnShifts)
            {
                _context.PenaltyOnShift.Remove(penaltyOnShift);
            }

            var employees = await _context.EmployeeOnWorkshift.Where(x => x.Workshift == workshift.Id).ToListAsync();
            foreach (var employee in employees)
            {
                _context.EmployeeOnWorkshift.Remove(employee);
            }

            var rooms = await _context.RoomOnWorkshift.Where(x => x.Workshift == workshift.Id).ToListAsync();
            foreach (var room in rooms)
            {
                _context.RoomOnWorkshift.Remove(room);
            }

            _context.Workshift.Remove(workshift);
            await _context.SaveChangesAsync();

            return workshift;
        }

        private bool WorkshiftExists(Guid id)
        {
            return _context.Workshift.Any(e => e.Id == id);
        }
    }
}
