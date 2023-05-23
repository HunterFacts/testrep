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
    public class EmployeeOnWorkshiftsController : ControllerBase
    {
        private readonly TaranScrmContext _context;

        public EmployeeOnWorkshiftsController(TaranScrmContext context)
        {
            _context = context;
        }

        // GET: api/EmployeeOnWorkshifts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeOnWorkshift>>> GetEmployeeOnWorkshift(string workshift = null)
        {
            if (workshift != null)
            {
                var workshiftGuid = new Guid(workshift);
                return await _context.EmployeeOnWorkshift.Where(x=>x.Workshift == workshiftGuid).ToListAsync();
            }
            return await _context.EmployeeOnWorkshift.ToListAsync();
        }

        // GET: api/EmployeeOnWorkshifts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeOnWorkshift>> GetEmployeeOnWorkshift(Guid id)
        {
            var employeeOnWorkshift = await _context.EmployeeOnWorkshift.FindAsync(id);

            if (employeeOnWorkshift == null)
            {
                return NotFound();
            }

            return employeeOnWorkshift;
        }

        // PUT: api/EmployeeOnWorkshifts/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployeeOnWorkshift(Guid id, EmployeeOnWorkshift employeeOnWorkshift)
        {
            employeeOnWorkshift.Id = id;
            if (id != employeeOnWorkshift.Id)
            {
                return BadRequest();
            }

            _context.Entry(employeeOnWorkshift).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeOnWorkshiftExists(id))
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

        // POST: api/EmployeeOnWorkshifts
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<EmployeeOnWorkshift>> PostEmployeeOnWorkshift(EmployeeOnWorkshift employeeOnWorkshift)
        {
            _context.EmployeeOnWorkshift.Add(employeeOnWorkshift);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (EmployeeOnWorkshiftExists(employeeOnWorkshift.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetEmployeeOnWorkshift", new { id = employeeOnWorkshift.Id }, employeeOnWorkshift);
        }

        // DELETE: api/EmployeeOnWorkshifts/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<EmployeeOnWorkshift>> DeleteEmployeeOnWorkshift(Guid id)
        {
            var employeeOnWorkshift = await _context.EmployeeOnWorkshift.FindAsync(id);
            if (employeeOnWorkshift == null)
            {
                return NotFound();
            }

            _context.EmployeeOnWorkshift.Remove(employeeOnWorkshift);
            await _context.SaveChangesAsync();

            return employeeOnWorkshift;
        }

        private bool EmployeeOnWorkshiftExists(Guid id)
        {
            return _context.EmployeeOnWorkshift.Any(e => e.Id == id);
        }
    }
}
